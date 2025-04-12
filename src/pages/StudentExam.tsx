import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

// Types matching our question structure from examParsingService
interface ExamQuestion {
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
}

interface Exam {
  id: string;
  title: string;
  questions: ExamQuestion[];
}

interface StudentAnswer {
  questionId: string;
  answerText?: string;
  selectedOptionIds?: string[];
}

const StudentExam = () => {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [examPassword, setExamPassword] = useState('');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ total: number; correct: number; percentage: number } | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  
  // Parse exam parameters from URL
  const title = searchParams.get('title') ? decodeURIComponent(searchParams.get('title') || '') : '';
  const secure = searchParams.get('secure') === 'true';
  const expiryString = searchParams.get('expires');
  const expiryDate = expiryString ? new Date(expiryString) : null;
  const maxAttempts = searchParams.get('attempts') ? parseInt(searchParams.get('attempts') || '1', 10) : undefined;

  useEffect(() => {
    // In a real app, this would fetch the exam from an API endpoint
    const loadExam = async () => {
      setIsLoading(true);
      
      try {
        // For now, we'll simulate fetching from Supabase or session storage
        const mockFetch = async () => {
          // Check if we have the exam in session storage (just for demo purposes)
          const storedExam = sessionStorage.getItem('lastParsedExam');
          
          if (storedExam) {
            return JSON.parse(storedExam) as Exam;
          }
          
          // In a real app, this would be a call to Supabase:
          // const { data, error } = await supabase
          //   .from('exams')
          //   .select('*')
          //   .eq('id', examId)
          //   .single();
          //
          // if (error) throw error;
          // return data;
          
          // Fallback dummy exam if nothing is found
          return {
            id: examId || 'sample-exam',
            title: title || 'Sample Exam',
            questions: [
              {
                id: '1',
                text: 'What is the capital of France?',
                type: 'MCQ' as const,
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
                type: 'essay' as const,
                instruction: 'Write a detailed explanation with examples.'
              }
            ]
          };
        };
        
        const examData = await mockFetch();
        // Make sure the data has the correct types
        const typedExam: Exam = {
          id: examData.id,
          title: examData.title,
          questions: examData.questions.map(q => ({
            ...q,
            type: q.type as 'multiple-choice' | 'short-answer' | 'essay' | 'MCQ'
          }))
        };
        
        setExam(typedExam);
        
        // Initialize student answers structure
        setStudentAnswers(
          typedExam.questions.map(q => ({
            questionId: q.id,
            answerText: '',
            selectedOptionIds: []
          }))
        );
        
        // Set password protection status
        setPasswordProtected(secure);
        setUnlocked(!secure); // Auto-unlock if no password is required
        
      } catch (error) {
        console.error('Error loading exam:', error);
        toast({
          title: "Error loading exam",
          description: "There was a problem loading the exam",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExam();
  }, [examId, title, secure, toast]);

  // Timer effect for exam expiry
  useEffect(() => {
    if (!expiryDate) return;
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        // Exam has expired
        setRemainingTime(0);
        if (!submitted) {
          toast({
            title: "Exam time expired",
            description: "Your exam has been automatically submitted",
            variant: "destructive"
          });
          handleSubmit();
        }
        return;
      }
      
      setRemainingTime(Math.floor(diff / 1000)); // in seconds
    };
    
    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(timer);
  }, [expiryDate, submitted]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would verify the password against the stored value
    // Simulate password check (the correct password is 'test123')
    if (examPassword === 'test123') {
      setUnlocked(true);
      toast({
        title: "Exam unlocked",
        description: "You can now proceed with the exam"
      });
    } else {
      toast({
        title: "Incorrect password",
        description: "Please try again with the correct password",
        variant: "destructive"
      });
    }
  };

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setStudentAnswers(prev => 
      prev.map(ans => 
        ans.questionId === questionId 
          ? typeof value === 'string' 
            ? { ...ans, answerText: value } 
            : { ...ans, selectedOptionIds: value }
          : ans
      )
    );
  };

  const handleOptionToggle = (questionId: string, optionId: string) => {
    setStudentAnswers(prev => 
      prev.map(ans => {
        if (ans.questionId !== questionId) return ans;
        
        const question = exam?.questions.find(q => q.id === questionId);
        if (!question) return ans;
        
        // If MCQ, only allow one option to be selected
        if (question.type === 'MCQ') {
          return { ...ans, selectedOptionIds: [optionId] };
        }
        
        // For multiple-choice, toggle the selection
        const currentSelections = ans.selectedOptionIds || [];
        const isSelected = currentSelections.includes(optionId);
        
        return {
          ...ans,
          selectedOptionIds: isSelected
            ? currentSelections.filter(id => id !== optionId)
            : [...currentSelections, optionId]
        };
      })
    );
  };

  const handleSubmit = async () => {
    if (!exam) return;
    
    setSubmitLoading(true);
    
    try {
      // Calculate score (only for multiple-choice and MCQ questions with clear answers)
      let correctCount = 0;
      let totalAssessable = 0;
      
      exam.questions.forEach(question => {
        const studentAnswer = studentAnswers.find(a => a.questionId === question.id);
        
        if (!studentAnswer) return;
        
        if (question.type === 'MCQ') {
          totalAssessable++;
          
          // Check if student selected the correct option
          const selectedId = studentAnswer.selectedOptionIds?.[0];
          const correctOption = question.options?.find(o => o.isCorrect);
          
          if (selectedId && correctOption && selectedId === correctOption.id) {
            correctCount++;
          }
        } else if (question.type === 'multiple-choice') {
          totalAssessable++;
          
          // All selected options should be correct and all correct options should be selected
          const selectedIds = studentAnswer.selectedOptionIds || [];
          const correctOptionIds = question.options
            ?.filter(o => o.isCorrect)
            .map(o => o.id) || [];
          
          if (selectedIds.length === correctOptionIds.length && 
              selectedIds.every(id => correctOptionIds.includes(id))) {
            correctCount++;
          }
        } else if (question.type === 'short-answer' && question.answer) {
          totalAssessable++;
          
          // Simple exact match for short answers
          if (studentAnswer.answerText?.trim().toLowerCase() === question.answer.trim().toLowerCase()) {
            correctCount++;
          }
        }
        // Essay questions would need manual grading
      });
      
      const scoreResult = {
        total: totalAssessable,
        correct: correctCount,
        percentage: totalAssessable > 0 ? Math.round((correctCount / totalAssessable) * 100) : 0
      };
      
      setScore(scoreResult);
      setSubmitted(true);
      
      // In a real app, you'd save the student's answers and score to Supabase
      // const { error } = await supabase.from('exam_submissions').insert({
      //   exam_id: examId,
      //   answers: studentAnswers,
      //   score: scoreResult.percentage,
      //   submitted_at: new Date()
      // });
      
      toast({
        title: "Exam submitted successfully",
        description: `Your score: ${scoreResult.correct}/${scoreResult.total} (${scoreResult.percentage}%)`,
      });
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error submitting exam",
        description: "There was a problem submitting your answers",
        variant: "destructive"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Format remaining time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
        <span className="ml-2 text-lg">Loading exam...</span>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Exam Not Found</h1>
        <p className="mb-6 text-gray-600">The requested exam could not be loaded. It may have been removed or the link is invalid.</p>
      </div>
    );
  }

  // Password protection screen
  if (passwordProtected && !unlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Protected Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="exam-password">Enter exam password</Label>
                  <Input 
                    id="exam-password" 
                    type="password" 
                    value={examPassword}
                    onChange={e => setExamPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Unlock Exam
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results screen after submission
  if (submitted && score) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 pt-8">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-xl text-green-800">Exam Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="inline-block p-4 bg-white rounded-full border-4 border-green-500 mb-4">
                  <span className="text-5xl font-bold text-green-600">{score.percentage}%</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">Your Score</h3>
                <p className="text-gray-600">
                  You answered {score.correct} out of {score.total} questions correctly
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-medium mb-2">Exam Summary</h4>
                <ul className="space-y-3">
                  {exam.questions.map((question, index) => {
                    const studentAnswer = studentAnswers.find(a => a.questionId === question.id);
                    let isCorrect = false;
                    
                    // Determine if the answer is correct for different question types
                    if (question.type === 'MCQ' && studentAnswer?.selectedOptionIds) {
                      const selectedId = studentAnswer.selectedOptionIds[0];
                      const correctOption = question.options?.find(o => o.isCorrect);
                      isCorrect = selectedId === correctOption?.id;
                    } else if (question.type === 'short-answer' && question.answer) {
                      isCorrect = studentAnswer?.answerText?.trim().toLowerCase() === question.answer.trim().toLowerCase();
                    }
                    
                    return (
                      <li key={question.id} className="flex items-start">
                        {question.type === 'essay' ? (
                          <AlertCircle className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        ) : (
                          isCorrect ? 
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" /> : 
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        )}
                        <div>
                          <span className="font-medium">Question {index + 1}:</span> {question.text.substring(0, 50)}
                          {question.text.length > 50 ? '...' : ''}
                          {question.type === 'essay' && 
                            <span className="text-sm text-gray-500 block">
                              (Essay questions require manual grading)
                            </span>
                          }
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button 
                variant="outline" 
                onClick={() => window.close()}
                className="mr-2"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setSubmitted(false);
                  setScore(null);
                  window.scrollTo(0, 0);
                }}
              >
                Review Answers
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Exam taking interface
  return (
    <div className="min-h-screen bg-slate-50 p-4 pt-8">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{exam.title}</CardTitle>
              {remainingTime !== null && (
                <div className="flex items-center text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Time remaining: {formatTime(remainingTime)}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">
              {exam.questions.length} questions • {maxAttempts ? `${maxAttempts} attempts allowed` : 'Unlimited attempts'}
            </p>
            {expiryDate && (
              <p className="text-sm text-gray-500">
                This exam expires on {expiryDate.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
        
        {exam.questions.map((question, index) => (
          <Card key={question.id} className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-start">
                <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 text-sm">
                  {index + 1}
                </span>
                <span>{question.text}</span>
              </CardTitle>
              {question.instruction && (
                <p className="text-sm text-gray-600 ml-8 mt-1">
                  {question.instruction}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {(question.type === 'MCQ' || question.type === 'multiple-choice') && question.options && (
                <div className="space-y-3 ml-8">
                  {question.options.map(option => {
                    const studentAnswer = studentAnswers.find(a => a.questionId === question.id);
                    const isSelected = studentAnswer?.selectedOptionIds?.includes(option.id);
                    
                    return (
                      <div key={option.id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={`question-${question.id}-option-${option.id}`} 
                          checked={isSelected}
                          onCheckedChange={() => handleOptionToggle(question.id, option.id)}
                          disabled={submitted}
                        />
                        <Label 
                          htmlFor={`question-${question.id}-option-${option.id}`}
                          className="cursor-pointer"
                        >
                          {option.text}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {question.type === 'short-answer' && (
                <div className="ml-8">
                  <Input 
                    id={`question-${question.id}-answer`}
                    value={studentAnswers.find(a => a.questionId === question.id)?.answerText || ''}
                    onChange={e => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Your answer..."
                    disabled={submitted}
                  />
                </div>
              )}
              
              {question.type === 'essay' && (
                <div className="ml-8">
                  <Textarea 
                    id={`question-${question.id}-answer`}
                    value={studentAnswers.find(a => a.questionId === question.id)?.answerText || ''}
                    onChange={e => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Your answer..."
                    className="min-h-[150px]"
                    disabled={submitted}
                  />
                </div>
              )}
              
              {submitted && (question.type === 'MCQ' || question.type === 'short-answer') && (
                <div className="mt-4 ml-8 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="font-medium text-sm mb-1">Correct Answer:</h4>
                  <p>
                    {question.type === 'MCQ' && question.options ? 
                      question.options.find(o => o.isCorrect)?.text : 
                      question.answer}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {!submitted && (
          <div className="flex justify-end mb-12">
            <Button 
              onClick={handleSubmit} 
              disabled={submitLoading}
              className="px-6"
            >
              {submitLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Exam'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExam;
