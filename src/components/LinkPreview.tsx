
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Copy, ArrowLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export interface LinkPreviewProps {
  link: string;
  examLink?: string; // Added this for backward compatibility
  settings?: any;
  onReset?: () => void;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ 
  link, 
  examLink, // Accept both prop names for flexibility
  settings,
  onReset
}) => {
  const { toast } = useToast();
  const finalLink = link || examLink || ''; // Use whichever is provided
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(finalLink);
    toast({
      title: "Link copied!",
      description: "Exam link copied to clipboard"
    });
  };
  
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Exam Published!</h3>
        <p className="text-green-700 mb-3">Your exam is ready to be shared with students.</p>
        <div className="bg-white p-3 rounded border border-green-200 flex justify-between items-center">
          <input
            type="text"
            value={finalLink}
            readOnly
            className="bg-transparent flex-grow mr-3 focus:outline-none text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
        
        {onReset && (
          <div className="mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset}
              className="text-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Generate a new link
            </Button>
          </div>
        )}
      </CardContent>
      
      {settings && (
        <CardFooter className="border-t border-green-200 bg-green-100/50 px-6 py-4">
          <div className="text-sm text-green-800 space-y-1">
            <h4 className="font-medium">Link settings:</h4>
            <ul className="space-y-1">
              {settings.password && <li>• Password protected</li>}
              <li>• Expires: {new Date(settings.startDate).toLocaleDateString()} + {settings.duration} {settings.durationUnit}</li>
              {settings.limitAttempts && settings.maxAttempts && <li>• Max attempts: {settings.maxAttempts}</li>}
            </ul>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default LinkPreview;
