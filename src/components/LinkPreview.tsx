
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Clock, Copy, Download, CheckCircle2, Link as LinkIcon, Key, AlertCircle } from 'lucide-react';
import { formatExpiryTime } from '@/lib/linkGenerator';
import { ExamSettings } from './ExamLinkForm';

interface LinkPreviewProps {
  examLink: string;
  settings: ExamSettings;
  onReset: () => void;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ examLink, settings, onReset }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(examLink).then(() => {
      setCopied(true);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this link with your students",
      });
      
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const expiryDate = settings.durationUnit === 'hours' 
      ? new Date(settings.startDate.getTime() + settings.duration * 60 * 60 * 1000)
      : new Date(settings.startDate.getTime() + settings.duration * 60 * 1000);
      
    const fileContent = `
Exam: ${settings.title}
${settings.description ? `Description: ${settings.description}\n` : ''}
Link: ${examLink}
Starts: ${formatExpiryTime(settings.startDate)}
Expires: ${formatExpiryTime(expiryDate)}
Duration: ${settings.duration} ${settings.durationUnit}
${settings.password ? `Password: ${settings.password}\n` : ''}
${settings.limitAttempts ? `Maximum Attempts: ${settings.maxAttempts}\n` : ''}
    `.trim();
    
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${settings.title.replace(/\s+/g, '-').toLowerCase()}-exam-link.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Exam details downloaded",
      description: "A text file with the exam details has been downloaded",
    });
  };

  const expiryDate = settings.durationUnit === 'hours' 
    ? new Date(settings.startDate.getTime() + settings.duration * 60 * 60 * 1000)
    : new Date(settings.startDate.getTime() + settings.duration * 60 * 1000);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Exam Link Generated</span>
          <div className="flex space-x-1">
            {settings.password && (
              <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                <Key className="h-3 w-3 mr-1" />
                Password Protected
              </Badge>
            )}
            {settings.limitAttempts && (
              <Badge variant="outline" className="text-purple-500 border-purple-200 bg-purple-50">
                {settings.maxAttempts} {settings.maxAttempts === 1 ? 'Attempt' : 'Attempts'}
              </Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          <span className="font-medium text-primary">{settings.title}</span>
          {settings.description && <p className="mt-1 text-sm">{settings.description}</p>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input 
            value={examLink} 
            readOnly 
            className="pr-24 font-mono text-sm"
          />
          <Button 
            size="sm" 
            className="absolute right-1 top-1 h-7"
            onClick={copyToClipboard}
            variant={copied ? "outline" : "default"}
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
        
        <div className="rounded-md bg-secondary p-3 flex items-center space-x-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Exam Duration: {settings.duration} {settings.durationUnit}</p>
            <p className="text-xs text-muted-foreground">
              Expires: {formatExpiryTime(expiryDate)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center text-amber-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1.5" />
          This link will no longer work after the expiration time.
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={downloadAsText}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Details
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onReset}
        >
          Create New Link
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LinkPreview;
