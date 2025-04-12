
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Edit, 
  Save, 
  ChevronLeft, 
  SendHorizonal,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ParsedExam } from "@/lib/examParsingService";
import QuestionCard from "@/components/QuestionCard";
import { generateExamLink } from "@/lib/linkGenerator";

const ExamReview = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exam, setExam] = useState<ParsedExam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedLink, setPublishedLink] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be fetched from an API endpoint
    // using the examId from the URL params
    const loadExam = () => {
      setIsLoading(true);
      
      try {
        // For now, we'll retrieve the exam from sessionStorage
        const storedExam = sessionStorage.getItem('lastParsedExam');
        
        if (storedExam) {
          const parsedExam = JSON.parse(storedExam) as ParsedExam;
          setExam(parsedExam);
        } else {
          toast({
            title: "Exam not found",
            description: "The requested exam could not be found",
            variant: "destructive"
          });
          navigate('/examiner/upload');
        }
      } catch (error) {
        console.error('Error loading exam:', error);
        toast({
          title: "Error loading exam",
          description: "There was a problem loading the exam data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExam();
  }, [examId, navigate, toast]);

  const handleMoveUp = (index: number) => {
    if (!exam || index <= 0) return;
    
    const updatedQuestions = [...exam.questions];
    const temp = updatedQuestions[index];
    updatedQuestions[index] = updatedQuestions[index - 1];
    updatedQuestions[index - 1] = temp;
    
    setExam({ ...exam, questions: updatedQuestions });
  };

  const handleMoveDown = (index: number) => {
    if (!exam || index >= exam.questions.length - 1) return;
    
    const updatedQuestions = [...exam.questions];
    const temp = updatedQuestions[index];
    updatedQuestions[index] = updatedQuestions[index + 1];
    updatedQuestions[index + 1] = temp;
    
    setExam({ ...exam, questions: updatedQuestions });
  };

  const handleRemove = (index: number) => {
    if (!exam) return;
    
    const updatedQuestions = exam.questions.filter((_, i) => i !== index);
    setExam({ ...exam, questions: updatedQuestions });
    
    toast({
      title: "Question removed",
      description: "The question has been removed from the exam"
    });
  };

  const handleUpdateQuestion = (index: number, updatedQuestion: any) => {
    if (!exam) return;
    
    const updatedQuestions = [...exam.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updatedQuestion };
    
    setExam({ ...exam, questions: updatedQuestions });
  };

  const handleSave = async () => {
    if (!exam) return;
    
    setIsSaving(true);
    
    try {
      // In a real app, this would be an API call to save the exam
      // For now, we'll just save to sessionStorage
      sessionStorage.setItem('lastParsedExam', JSON.stringify(exam));
      
      toast({
        title: "Exam saved",
        description: "All changes have been saved"
      });
    } catch (error) {
      console.error('Error saving exam:', error);
      toast({
        title: "Error saving exam",
        description: "There was a problem saving your changes",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!exam) return;
    
    setIsPublishing(true);
    
    try {
      // In a real app, this would be an API call to publish the exam
      // For now, we'll just generate a mock link
      await handleSave();
      
      // Generate a shareable link
      const link = generateExamLink({
        title: exam.title,
        description: 'Generated exam',
        duration: 60,
        durationUnit: 'minutes',
        startDate: new Date(),
        limitAttempts: true,
        maxAttempts: 1
      });
      
      setPublishedLink(link);
      
      toast({
        title: "Exam published",
        description: "You can now share the exam link with students"
      });
    } catch (error) {
      console.error('Error publishing exam:', error);
      toast({
        title: "Error publishing exam",
        description: "There was a problem publishing the exam",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Exam Not Found</h1>
        <p className="mb-6 text-gray-600">The requested exam could not be loaded.</p>
        <Button onClick={() => navigate('/examiner/upload')}>
          <ChevronLeft className="mr-2" size={16} />
          Return to Upload
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold">the Examiner</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm text-gray-600 hover:text-orange-500">
              Dashboard
            </a>
            <div className="bg-orange-100 rounded-full w-8 h-8 overflow-hidden flex items-center justify-center">
              <span className="font-semibold text-sm">OL</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-8 max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/examiner/upload')}
              className="mb-4"
            >
              <ChevronLeft className="mr-2" size={16} />
              Back to Upload
            </Button>
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            <p className="text-gray-600 mt-2">
              {exam.questions.length} questions • Review and edit before publishing
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSave} 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={16} />
                  Save Changes
                </>
              )}
            </Button>
            
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing || exam.questions.length === 0}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <SendHorizonal className="mr-2" size={16} />
                  Publish Exam
                </>
              )}
            </Button>
          </div>
        </div>
        
        {publishedLink && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Exam Published!</h3>
              <p className="text-green-700 mb-3">Your exam is ready to be shared with students.</p>
              <div className="bg-white p-3 rounded border border-green-200 flex justify-between items-center">
                <input
                  type="text"
                  value={publishedLink}
                  readOnly
                  className="bg-transparent flex-grow mr-3 focus:outline-none text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(publishedLink);
                    toast({
                      title: "Link copied!",
                      description: "Exam link copied to clipboard"
                    });
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-6">
          {exam.questions.map((question, index) => (
            <QuestionCard
              key={question.id || index}
              question={question}
              index={index}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onRemove={() => handleRemove(index)}
              onUpdate={(updatedQuestion) => handleUpdateQuestion(index, updatedQuestion)}
              isFirst={index === 0}
              isLast={index === exam.questions.length - 1}
            />
          ))}
        </div>
        
        {exam.questions.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No questions in this exam</h3>
            <p className="text-gray-500 mb-4">All questions have been removed. Upload a new file or add questions manually.</p>
            <Button onClick={() => navigate('/examiner/upload')}>
              Return to Upload
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamReview;
