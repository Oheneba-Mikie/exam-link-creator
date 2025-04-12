
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ExamUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rawContent, setRawContent] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawContent(e.target.value);
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

    setIsUploading(true);
    
    try {
      // Mock API call for now
      // In a real implementation, we would send the file or content to the API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Exam received",
        description: "Your exam is now being processed",
      });
      
      // Redirect to review page or dashboard
      // window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your exam",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
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
            Upload your exam document or paste its content to extract questions and answers.
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
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
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
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" type="button">
                    {file ? "Change File" : "Browse Files"}
                  </Button>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.docx,.txt" 
                    onChange={handleFileChange} 
                  />
                </label>
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
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isUploading} className="gap-2">
              {isUploading ? "Processing..." : "Submit for Processing"}
              {!isUploading && <ArrowRight size={16} />}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ExamUpload;
