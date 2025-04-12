
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { parseExamAPI, ParsedExam } from "@/lib/examParsingService";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const ExamUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rawContent, setRawContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<string>('');
  const [progressValue, setProgressValue] = useState<number>(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is authenticated
  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      toast({
        title: "File selected",
        description: `Selected file: ${selectedFile.name}`,
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      toast({
        title: "File dropped",
        description: `Selected file: ${droppedFile.name}`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawContent(e.target.value);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file && !rawContent) {
      toast({
        title: "Missing content",
        description: "Please upload a file or paste raw content",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgressValue(10);
    setProcessingProgress('Checking authentication...');
    
    try {
      // Check if user is authenticated
      const isAuthenticated = await checkAuth();
      setProgressValue(20);
      
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please sign in to use this feature",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
      
      setProcessingProgress('Processing content with AI...');
      setProgressValue(30);
      
      // Call the parse exam API with either the file or raw content
      const parsedExam: ParsedExam = await parseExamAPI(file || rawContent);
      
      setProgressValue(80);
      setProcessingProgress('Saving to database...');
      
      toast({
        title: "Exam processed successfully",
        description: `Extracted ${parsedExam.questions.length} questions`,
      });
      
      // Store the parsed exam in session storage to access it in the review page
      sessionStorage.setItem('lastParsedExam', JSON.stringify(parsedExam));
      
      setProgressValue(100);
      
      // Redirect to review page with the generated exam ID
      navigate(`/examiner/review/${parsedExam.id}`);
    } catch (error) {
      console.error('Error processing exam:', error);
      toast({
        title: "Processing failed",
        description: "There was an error processing your exam",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgressValue(0);
      setProcessingProgress('');
    }
  };

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
      
      <main className="container py-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload New Exam</h1>
          <p className="text-gray-600">
            Upload your exam document or paste its content to extract questions and answers automatically using AI.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
              <CardDescription>
                Upload a PDF, DOCX, or TXT file containing your exam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                {file ? (
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="text-orange-500" size={20} />
                    <span className="font-medium">{file.name}</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your exam file or
                  </p>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button"
                  onClick={handleBrowseClick}
                >
                  {file ? "Change File" : "Browse Files"}
                </Button>
                <Input 
                  id="file-upload" 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.txt" 
                  onChange={handleFileChange} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Or Paste Raw Content</CardTitle>
              <CardDescription>
                Alternatively, you can paste the exam content directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="raw-content">Exam Content</Label>
                <Textarea 
                  id="raw-content" 
                  placeholder="Paste your exam questions and answers here..." 
                  className="min-h-[200px]"
                  value={rawContent}
                  onChange={handleContentChange}
                />
              </div>
            </CardContent>
          </Card>
          
          {isProcessing && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Processing Exam</CardTitle>
                <CardDescription>
                  Please wait while we extract questions and answers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progressValue} className="h-2" />
                <p className="text-sm text-center">{processingProgress}</p>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isProcessing} className="gap-2">
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Submit for Processing
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ExamUpload;
