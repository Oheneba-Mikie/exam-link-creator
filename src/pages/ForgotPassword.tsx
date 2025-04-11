
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
    // Password reset request logic would go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-50 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="mb-10">
            <span className="text-2xl font-bold">adon</span>
          </div>

          <Link to="/login" className="inline-flex items-center text-sm text-gray-600 mb-8 hover:text-gray-900">
            <ArrowLeft size={16} className="mr-2" />
            Back to login
          </Link>
          
          {!isSubmitted ? (
            <>
              <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
              <p className="text-gray-600 mb-8">
                No worries, we'll send you reset instructions
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
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
                  
                  <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                    Reset Password
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={24} className="text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Check your email</h1>
              <p className="text-gray-600 mb-8">
                We have sent a password reset link to<br />
                <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or
                <button 
                  onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} 
                  className="text-blue-600 hover:underline ml-1"
                >
                  Try another email
                </button>
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Right side with gradient */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-orange-200 to-orange-300"></div>
    </div>
  );
};

export default ForgotPassword;
