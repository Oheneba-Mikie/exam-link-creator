
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Link as LinkIcon, Plus, File, Eye } from 'lucide-react';
import { generateExamLink } from '@/lib/linkGenerator';

const Dashboard = () => {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    name: string;
    type: string;
    date: string;
    status: 'processing' | 'ready' | 'error';
  }>>([
    {
      id: '1',
      name: 'Midterm Exam 2025.pdf',
      type: 'PDF',
      date: '2025-04-10',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Final Assessment.docx',
      type: 'DOCX',
      date: '2025-04-05',
      status: 'ready'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'exams' | 'links'>('exams');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'PDF' : 'DOCX',
        date: new Date().toISOString().split('T')[0],
        status: 'processing' as const
      }));
      
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      
      // Simulate processing completion after 2 seconds
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(file => 
            newFiles.some(newFile => newFile.id === file.id) 
              ? { ...file, status: 'ready' } 
              : file
          )
        );
      }, 2000);
    }
  };

  const recentLinks = [
    {
      id: '1',
      title: 'Midterm Exam 2025',
      created: '2025-04-10',
      expires: '2025-04-20',
      views: 42
    },
    {
      id: '2',
      title: 'Final Assessment',
      created: '2025-04-05',
      expires: '2025-04-25',
      views: 15
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold">the Examiner</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 rounded-full w-8 h-8 overflow-hidden flex items-center justify-center">
              <span className="font-semibold text-sm">OL</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Upload exam documents, review extracted questions, and generate links for your students.
          </p>
        </div>
        
        <div className="flex mb-8 border-b">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'exams' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('exams')}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              My Exams
            </div>
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'links' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('links')}
          >
            <div className="flex items-center gap-2">
              <LinkIcon size={18} />
              Generated Links
            </div>
          </button>
        </div>
        
        {activeTab === 'exams' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Upload New Exam</CardTitle>
                  <CardDescription>
                    Upload PDF or DOCX exam files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop your exam file or
                    </p>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm">
                        Browse Files
                      </Button>
                      <Input 
                        id="file-upload" 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.docx" 
                        onChange={handleFileUpload} 
                      />
                    </label>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-gray-500">
                  Supported formats: PDF, DOCX
                </CardFooter>
              </Card>
              
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Exams</CardTitle>
                  <CardDescription>
                    Your uploaded exam documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-orange-500 mb-1">{uploadedFiles.length}</p>
                      <p className="text-sm text-gray-600">Exams Available</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus size={14} className="mr-1" />
                    Create Exam Manually
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks you may want to perform
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button variant="outline" className="justify-start">
                    <Upload size={16} className="mr-2" />
                    Upload Exam
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <LinkIcon size={16} className="mr-2" />
                    Generate New Link
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Eye size={16} className="mr-2" />
                    Review Questions
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white shadow-sm mb-8">
              <CardHeader>
                <CardTitle>Recent Exam Files</CardTitle>
                <CardDescription>
                  Your recently uploaded exam documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <File size={16} />
                            {file.name}
                          </div>
                        </TableCell>
                        <TableCell>{file.type}</TableCell>
                        <TableCell>{file.date}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            file.status === 'ready' ? 'bg-green-100 text-green-800' : 
                            file.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {file.status === 'ready' ? 'Ready' : 
                             file.status === 'processing' ? 'Processing' : 
                             'Error'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <LinkIcon size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="bg-white shadow-sm mb-8">
            <CardHeader>
              <CardTitle>Generated Links</CardTitle>
              <CardDescription>
                Links you've generated to share with students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Title</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        {link.title}
                      </TableCell>
                      <TableCell>{link.created}</TableCell>
                      <TableCell>{link.expires}</TableCell>
                      <TableCell>{link.views}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <LinkIcon size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
