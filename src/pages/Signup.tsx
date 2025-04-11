
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Apple, CheckCircle2 } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup attempt with:', { name, email, password, agreeTerms });
    // Signup logic would go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-50 flex flex-col md:flex-row">
      {/* Left side - Signup Form */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="mb-10">
            <span className="text-2xl font-bold">adon</span>
          </div>
          
          {/* Welcome text */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Join us today</h1>
          <p className="text-gray-600 mb-8">
            Create an account to get started<br />
            Please, fill in your details
          </p>
          
          {/* Social signup buttons */}
          <div className="flex gap-4 mb-6">
            <button className="flex-1 border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span>Signup with Google</span>
            </button>
            <button className="flex-1 border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <Apple size={20} />
              <span>Signup with Apple</span>
            </button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          
          {/* Signup form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm mb-1">
                  Full Name <span className="text-gray-500">*</span>
                </label>
                <Input 
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email <span className="text-gray-500">*</span>
                </label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm mb-1">
                  Password <span className="text-gray-500">*</span>
                </label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms} 
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>
              
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                Create Account
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </div>
        </div>
      </div>
      
      {/* Right side - Stats/Graphics */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-orange-200 to-orange-300 items-center justify-center p-16">
        <div className="w-full max-w-md">
          {/* User card */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 rounded-full w-12 h-12 overflow-hidden flex items-center justify-center">
                <img src="/lovable-uploads/b7ccf7e3-cba1-4dd5-8b80-399c11607d27.png" alt="Profile" className="w-full h-full object-cover" onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/100';
                }} />
              </div>
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-700">CEO at Agle Solutions</p>
              </div>
            </div>
          </div>
          
          {/* Stats card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-orange-500" size={20} />
              </div>
              <div className="flex items-center bg-gray-100 rounded-md px-3 py-1 text-xs">
                Last month
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-6">+84.32%</h3>
            
            {/* Bar chart */}
            <div className="flex items-end h-32 gap-4">
              <div className="flex-1 bg-orange-100 rounded-t-md h-[20%]"></div>
              <div className="flex-1 bg-orange-200 rounded-t-md h-[40%]"></div>
              <div className="flex-1 bg-orange-300 rounded-t-md h-[60%]"></div>
              <div className="flex-1 bg-orange-400 rounded-t-md h-[80%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
