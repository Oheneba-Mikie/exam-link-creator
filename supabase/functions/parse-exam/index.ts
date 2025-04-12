
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Initialize Supabase client with env variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY') || '';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Parse-exam function invoked');
    
    // Parse the request body
    let reqBody;
    try {
      reqBody = await req.json();
    } catch (e) {
      console.error('Error parsing request JSON:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { content, fileType, userId } = reqBody;

    if (!content) {
      console.error('Missing content in request body');
      return new Response(
        JSON.stringify({ error: 'Missing content in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userId) {
      console.error('Missing userId in request body');
      return new Response(
        JSON.stringify({ error: 'Missing userId in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: ANTHROPIC_API_KEY is not set' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log request info (not content itself which could be large)
    console.log(`Processing ${fileType} exam content for user ${userId}`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Claude API system prompt
    const systemPrompt = `You are an Exam Extractor AI. Your job is to extract questions and answers from an uploaded exam document. 
Do not guess. Only use answers if they are explicitly marked or clear from context. 
For each question, identify:
1. The question text
2. The question type (multiple-choice, short-answer, or essay)
3. The correct answer (if provided)
4. Any instructions for the question
5. For multiple-choice questions, extract all options and identify the correct one(s)

Return the result as a JSON array with this structure:
{
  "title": "Exam Title",
  "questions": [
    {
      "text": "Question text here",
      "type": "MCQ", // or "short-answer" or "essay" or "multiple-choice"
      "options": [
        { "text": "Option A", "isCorrect": false },
        { "text": "Option B", "isCorrect": true }
      ],
      "answer": "Optional answer for short-answer",
      "instruction": "Optional instruction text"
    }
  ]
}`;

    console.log('Calling Claude API');
    
    // Call Claude API to process the exam content
    // FIX: Changed the API request format to use system parameter instead of system role
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        system: systemPrompt, // Changed from messages array with system role
        messages: [
          { role: 'user', content: content }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Error calling Claude API', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const claudeResponse = await response.json();
    console.log('Claude API responded successfully');
    
    if (!claudeResponse.content || !claudeResponse.content[0] || !claudeResponse.content[0].text) {
      console.error('Unexpected Claude response format:', claudeResponse);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from Claude API', 
          details: 'The AI response did not contain the expected content structure' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const textContent = claudeResponse.content[0].text;
    
    // Extract JSON from Claude's response (it might have markdown or other text around it)
    let parsedExam;
    try {
      // Try to find JSON in the response using regex
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedExam = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON object found, try parsing the entire response
        parsedExam = JSON.parse(textContent);
      }
      
      console.log('Successfully parsed Claude response into JSON');
    } catch (e) {
      console.error('Error parsing Claude response:', e);
      console.log('Claude response excerpt:', textContent.substring(0, 500) + '...');
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse Claude response',
          details: e.message,
          rawResponsePreview: textContent.substring(0, 1000) + '...' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create exam in database if userId is provided
    let examId = null;
    try {
      console.log('Creating exam in database for user:', userId);
      
      // Insert exam
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .insert({
          user_id: userId,
          title: parsedExam.title || 'Untitled Exam',
          description: 'Extracted from ' + fileType
        })
        .select()
        .single();

      if (examError) {
        console.error('Error creating exam in database:', examError);
        throw examError;
      }
      
      examId = exam.id;
      console.log('Created exam with ID:', examId);

      // Insert questions and options
      for (let i = 0; i < parsedExam.questions.length; i++) {
        const q = parsedExam.questions[i];
        
        // Insert question
        const { data: question, error: questionError } = await supabase
          .from('exam_questions')
          .insert({
            exam_id: examId,
            text: q.text,
            type: q.type,
            instruction: q.instruction || null,
            answer: q.answer || null,
            position: i + 1
          })
          .select()
          .single();
          
        if (questionError) {
          console.error('Error creating question in database:', questionError);
          throw questionError;
        }
        
        // Insert options for multiple choice questions
        if (q.options && q.options.length > 0) {
          const optionsToInsert = q.options.map((opt, index) => ({
            question_id: question.id,
            text: opt.text,
            is_correct: opt.isCorrect,
            position: index + 1
          }));
          
          const { error: optionsError } = await supabase
            .from('question_options')
            .insert(optionsToInsert);
            
          if (optionsError) {
            console.error('Error creating options in database:', optionsError);
            throw optionsError;
          }
        }
      }
      
      console.log('Successfully created all questions and options in database');
    } catch (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Error saving to database', details: dbError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Exam processing complete, returning response');
    
    // Return the processed exam data
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: parsedExam,
        examId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in parse-exam function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
