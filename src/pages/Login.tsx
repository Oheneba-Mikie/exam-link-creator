import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Apple, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        if (error.message === 'Invalid login credentials') {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message || 'Failed to login');
        }
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-50 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-10">
            <span className="text-2xl font-bold">the Examiner</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-600 mb-8">
            We are glad to see you again!<br />
            Please, enter your details
          </p>
          
          <div className="flex gap-4 mb-6">
            <button type="button" disabled={isLoading} className="flex-1 border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              <span>Login with Google</span>
            </button>
            <button type="button" disabled={isLoading} className="flex-1 border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50">
              <Apple size={20} />
              <span>Login with Apple</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          
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
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="w-full"
                  disabled={isLoading} 
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm mb-1">
                  Password <span className="text-gray-500">*</span>
                </label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="w-full" 
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={rememberMe} 
                    onCheckedChange={checked => setRememberMe(checked as boolean)} 
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-gray-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : 'Login'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
      
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-orange-200 to-orange-300 items-center justify-center p-16">
        <div className="w-full max-w-md">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 rounded-full w-12 h-12 overflow-hidden flex items-center justify-center">
                <img src="/lovable-uploads/b7ccf7e3-cba1-4dd5-8b80-399c11607d27.png" alt="Profile" className="w-full h-full object-cover" onError={e => {
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

export default Login;
