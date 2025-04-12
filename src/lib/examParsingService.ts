
import { supabase } from "@/integrations/supabase/client";

/**
 * This service handles exam file parsing and processing.
 */

export interface ParsedExam {
  id: string;
  title: string;
  questions: {
    id: string;
    text: string;
    type: 'multiple-choice' | 'short-answer' | 'essay' | 'MCQ';
    options?: {
      id: string;
      text: string;
      isCorrect: boolean;
    }[];
    answer?: string;
    instruction?: string;
  }[];
}

/**
 * Extracts text from file using appropriate method based on file type
 * 
 * @param file The exam file to parse
 * @returns A promise that resolves to the text content
 */
const extractTextFromFile = async (file: File): Promise<string> => {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result.toString());
      } else {
        reject(new Error('Failed to read file content'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    // Read as text
    reader.readAsText(file);
  });
};

/**
 * Parses an exam file and returns structured content
 * 
 * @param file The exam file to parse
 * @returns A promise that resolves to the parsed exam data
 */
export const parseExamFile = async (file: File): Promise<ParsedExam> => {
  const fileType = file.type || 'text/plain';
  console.log('Parsing exam file:', file.name, fileType);
  
  try {
    // Extract file content as text
    const content = await extractTextFromFile(file);
    
    // Get current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    // Call the Supabase edge function to process the exam
    const { data, error } = await supabase.functions.invoke('parse-exam', {
      body: {
        content,
        fileType,
        userId
      }
    });
    
    if (error) {
      console.error('Error calling parse-exam function:', error);
      throw new Error(`Error parsing exam: ${error.message}`);
    }
    
    if (!data || !data.success) {
      throw new Error('Failed to parse exam content');
    }
    
    const parsedData = data.data;
    
    // Format the response to match the expected ParsedExam interface
    return {
      id: data.examId || Math.random().toString(36).substring(7),
      title: parsedData.title || file.name.replace(/\.\w+$/, ''),
      questions: parsedData.questions.map((q: any, index: number) => ({
        id: String(index + 1),
        text: q.text,
        type: q.type,
        options: q.options?.map((opt: any, optIndex: number) => ({
          id: String.fromCharCode(97 + optIndex), // a, b, c, d...
          text: opt.text,
          isCorrect: opt.isCorrect
        })),
        answer: q.answer,
        instruction: q.instruction
      }))
    };
  } catch (error) {
    console.error('Error in parseExamFile:', error);
    // Fallback to a simple exam structure
    return {
      id: Math.random().toString(36).substring(7),
      title: file.name.replace(/\.\w+$/, ''),
      questions: [
        {
          id: '1',
          text: 'Error parsing exam file. Please check the format and try again.',
          type: 'essay',
          instruction: 'Please contact support if this error persists.'
        }
      ]
    };
  }
};

/**
 * Parses raw text content and returns structured exam data
 * 
 * @param content The raw exam content as text
 * @returns A promise that resolves to the parsed exam data
 */
export const parseExamContent = async (content: string): Promise<ParsedExam> => {
  console.log('Parsing exam content, length:', content.length);
  
  try {
    // Get current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    // Call the Supabase edge function
    const { data, error } = await supabase.functions.invoke('parse-exam', {
      body: {
        content,
        fileType: 'text/plain',
        userId
      }
    });
    
    if (error) {
      console.error('Error calling parse-exam function:', error);
      throw new Error(`Error parsing exam: ${error.message}`);
    }
    
    if (!data || !data.success) {
      throw new Error('Failed to parse exam content');
    }
    
    const parsedData = data.data;
    
    // Format the response to match the expected ParsedExam interface
    return {
      id: data.examId || Math.random().toString(36).substring(7),
      title: parsedData.title || 'Untitled Exam',
      questions: parsedData.questions.map((q: any, index: number) => ({
        id: String(index + 1),
        text: q.text,
        type: q.type,
        options: q.options?.map((opt: any, optIndex: number) => ({
          id: String.fromCharCode(97 + optIndex), // a, b, c, d...
          text: opt.text,
          isCorrect: opt.isCorrect
        })),
        answer: q.answer,
        instruction: q.instruction
      }))
    };
  } catch (error) {
    console.error('Error in parseExamContent:', error);
    // Fallback to a simple exam structure
    return {
      id: Math.random().toString(36).substring(7),
      title: 'Untitled Exam',
      questions: [
        {
          id: '1',
          text: 'Error parsing exam content. Please check the format and try again.',
          type: 'essay',
          instruction: 'Please contact support if this error persists.'
        }
      ]
    };
  }
};

/**
 * Unified interface for parsing exam content from either a file or text
 */
export const parseExamAPI = async (fileOrContent: File | string): Promise<ParsedExam> => {
  if (typeof fileOrContent === 'string') {
    return parseExamContent(fileOrContent);
  } else {
    return parseExamFile(fileOrContent);
  }
};
