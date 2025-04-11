
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full py-4 border-b">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">adon</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Login
          </Link>
          <Link to="/signup" className="text-sm font-medium bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
