
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface LinkPreviewProps {
  link: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ link }) => {
  const { toast } = useToast();
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
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
            value={link}
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
      </CardContent>
    </Card>
  );
};

export default LinkPreview;
