
import React, { useState } from 'react';
import Header from '@/components/Header';
import ExamLinkForm, { ExamSettings } from '@/components/ExamLinkForm';
import LinkPreview from '@/components/LinkPreview';
import { generateExamLink } from '@/lib/linkGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarRange, History, PenLine } from 'lucide-react';

const Index = () => {
  const [examLink, setExamLink] = useState<string | null>(null);
  const [currentSettings, setCurrentSettings] = useState<ExamSettings | null>(null);

  const handleGenerateLink = (settings: ExamSettings) => {
    const link = generateExamLink(settings);
    setExamLink(link);
    setCurrentSettings(settings);
  };

  const handleReset = () => {
    setExamLink(null);
    setCurrentSettings(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          {!examLink ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Create An Exam Link</h2>
              <p className="text-muted-foreground">
                Configure your exam settings to generate a secure link that you can share with your students.
              </p>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">
                    <PenLine className="h-4 w-4 mr-2" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="schedule">
                    <CalendarRange className="h-4 w-4 mr-2" />
                    Schedule
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="h-4 w-4 mr-2" />
                    Recent Links
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <ExamLinkForm onGenerateLink={handleGenerateLink} />
                </TabsContent>
                <TabsContent value="schedule" className="h-[400px] flex items-center justify-center text-muted-foreground">
                  Schedule multiple exams feature coming soon
                </TabsContent>
                <TabsContent value="history" className="h-[400px] flex items-center justify-center text-muted-foreground">
                  View link history feature coming soon
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Your Exam Link</h2>
              <p className="text-muted-foreground">
                Your secure exam link has been generated. Copy and share it with your students.
              </p>
              
              {currentSettings && (
                <LinkPreview 
                  examLink={examLink} 
                  settings={currentSettings}
                  onReset={handleReset}
                />
              )}
            </div>
          )}
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container flex justify-center text-sm text-muted-foreground">
          ExamLink Creator © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
