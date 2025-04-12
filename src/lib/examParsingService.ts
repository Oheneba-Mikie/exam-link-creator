
/**
 * This service handles exam file parsing and processing.
 * In a real implementation, this would call a backend API endpoint.
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
 * Parses an exam file and returns structured content
 * 
 * @param file The exam file to parse
 * @returns A promise that resolves to the parsed exam data
 */
export const parseExamFile = async (file: File): Promise<ParsedExam> => {
  // In a real implementation, this would:
  // 1. Upload the file to the /api/parse-exam endpoint
  // 2. Extract text from PDF/DOCX using pdf-parse, docx, or an external service
  // 3. Send content to Claude or GPT-4 with the specialized system prompt
  // 4. Process and format the response
  
  console.log('Parsing exam file:', file.name, file.type);

  // Mock implementation - this simulates what would happen after AI processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substring(7),
        title: file.name.replace(/\.\w+$/, ''),
        questions: [
          {
            id: '1',
            text: 'What is the capital of France?',
            type: 'MCQ',
            options: [
              { id: 'a', text: 'London', isCorrect: false },
              { id: 'b', text: 'Paris', isCorrect: true },
              { id: 'c', text: 'Berlin', isCorrect: false },
              { id: 'd', text: 'Madrid', isCorrect: false },
            ],
            answer: 'Paris',
            instruction: 'Choose the correct answer.'
          },
          {
            id: '2',
            text: 'Explain the concept of photosynthesis.',
            type: 'essay',
            instruction: 'Write a detailed explanation with examples.'
          },
          {
            id: '3',
            text: 'List three main functions of the human liver.',
            type: 'short-answer',
            answer: 'Detoxification, metabolism, protein synthesis',
            instruction: 'Provide a concise answer.'
          }
        ]
      });
    }, 2000);
  });
};

/**
 * Parses raw text content and returns structured exam data
 * 
 * @param content The raw exam content as text
 * @returns A promise that resolves to the parsed exam data
 */
export const parseExamContent = async (content: string): Promise<ParsedExam> => {
  // In a real implementation, this would:
  // 1. Send the content to the /api/parse-exam endpoint
  // 2. Pass content to Claude or GPT-4 with the specialized system prompt:
  // "You are an Exam Extractor AI. Your job is to extract questions and answers from an uploaded exam document. 
  // Do not guess. Only use answers if they are explicitly bolded, or marked with 'Answer:'. 
  // Return the result as a JSON array of question objects."
  // 3. Process and format the response
  
  console.log('Parsing exam content, length:', content.length);

  // Mock implementation - this simulates what would happen after AI processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substring(7),
        title: 'Untitled Exam',
        questions: [
          {
            id: '1',
            text: 'What is the largest planet in our solar system?',
            type: 'MCQ',
            options: [
              { id: 'a', text: 'Earth', isCorrect: false },
              { id: 'b', text: 'Jupiter', isCorrect: true },
              { id: 'c', text: 'Saturn', isCorrect: false },
              { id: 'd', text: 'Neptune', isCorrect: false },
            ],
            answer: 'Jupiter',
            instruction: 'Select the correct option.'
          },
          {
            id: '2',
            text: 'Describe the water cycle in detail.',
            type: 'essay',
            instruction: 'Include all major phases and processes in your answer.'
          },
          {
            id: '3',
            text: 'What are the three states of matter?',
            type: 'short-answer',
            answer: 'Solid, liquid, gas',
            instruction: 'List all three states.'
          }
        ]
      });
    }, 2000);
  });
};

/**
 * In a real application, this would be an actual API call to the backend
 * that implements the system prompt described in the requirements.
 * 
 * System Prompt Template:
 * "You are an Exam Extractor AI. Your job is to extract questions and answers 
 * from an uploaded exam document. Do not guess. Only use answers if they are 
 * explicitly bolded, or marked with 'Answer:'. Return the result as a JSON array 
 * of question objects."
 */
export const parseExamAPI = async (fileOrContent: File | string): Promise<ParsedExam> => {
  if (typeof fileOrContent === 'string') {
    return parseExamContent(fileOrContent);
  } else {
    return parseExamFile(fileOrContent);
  }
};
