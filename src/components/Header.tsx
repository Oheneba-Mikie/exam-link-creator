
import React from 'react';
import { GraduationCap } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-4 border-b">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">ExamLink Creator</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Create secure exam links for your students
        </div>
      </div>
    </header>
  );
};

export default Header;
