
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the recovery token in the URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    if (!params.get('type') || params.get('type') !== 'recovery') {
      toast.error('Invalid password reset link');
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast.success('Password has been reset successfully');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-50 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="mb-10">
            <span className="text-2xl font-bold">the Examiner</span>
          </div>

          <Link to="/login" className="inline-flex items-center text-sm text-gray-600 mb-8 hover:text-gray-900">
            <ArrowLeft size={16} className="mr-2" />
            Back to login
          </Link>
          
          {!isSuccess ? (
            <>
              <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
              <p className="text-gray-600 mb-8">
                Create a new password for your account
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm mb-1">
                      New Password <span className="text-gray-500">*</span>
                    </label>
                    <Input 
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm mb-1">
                      Confirm Password <span className="text-gray-500">*</span>
                    </label>
                    <Input 
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-black hover:bg-gray-800 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : 'Reset Password'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Password Reset Complete</h1>
              <p className="text-gray-600 mb-8">
                Your password has been reset successfully.
              </p>
              <Link to="/login">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  Log in with new password
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

export default ResetPassword;
