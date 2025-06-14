
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before logging in.');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(error.message);
        }
        return;
      }

      console.log('Login successful:', data);
      setSuccess('Login successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error: any) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        if (error.message.includes('Signups not allowed')) {
          setError('Account registration is currently disabled. Please contact the administrator or try logging in with an existing account.');
        } else if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please try logging in instead.');
        } else {
          setError(error.message);
        }
        return;
      }

      console.log('Signup successful:', data);
      
      if (data.user && !data.user.email_confirmed_at) {
        setSuccess('Registration successful! Please check your email to verify your account before logging in.');
      } else {
        setSuccess('Registration successful! You can now log in.');
      }

    } catch (error: any) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');
    
    // Demo credentials - you can create these in your Supabase dashboard
    const demoCredentials = {
      email: 'demo@spark.gov.in',
      password: 'demo123456'
    };

    try {
      const { data, error } = await supabase.auth.signInWithPassword(demoCredentials);

      if (error) {
        setError('Demo login is not available. Please contact the administrator.');
        return;
      }

      setSuccess('Demo login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      setError('Demo login failed. Please try manual login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">SPARK</h1>
          <p className="text-gray-300">Smart Public Auto Record Keeper</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-center">Welcome</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger value="login" className="text-gray-300">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-gray-300">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center">
                  <Button 
                    onClick={handleDemoLogin}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    disabled={isLoading}
                  >
                    Try Demo Account
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({...signupData, firstName: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({...signupData, lastName: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signupEmail" className="text-gray-300">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signupPassword" className="text-gray-300">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert className="mt-4 border-red-600 bg-red-900/50">
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-600 bg-green-900/50">
                <AlertDescription className="text-green-300">{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Powered by AI & Blockchain Technology
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Having trouble? Contact support at admin@spark.gov.in
          </p>
        </div>
      </div>
    </div>
  );
}
