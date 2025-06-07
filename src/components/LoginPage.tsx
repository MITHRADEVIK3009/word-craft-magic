
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    aadhaarNumber: '',
    phoneNumber: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          setStep('otp');
          toast({
            title: "OTP Sent",
            description: "Please check your email for the verification code.",
          });
        } else {
          toast({
            title: "Registration Successful",
            description: "Please login with your credentials.",
          });
          setIsLogin(true);
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          otp: formData.otp
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.reload();
      } else {
        toast({
          title: "Invalid OTP",
          description: data.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({ ...formData, username: 'demo_user', password: 'demo123' });
    setTimeout(() => {
      localStorage.setItem('token', 'demo_token');
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">SPARK</h1>
          <p className="text-gray-300">Smart Public Auto Record Keeper</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">
              {step === 'otp' ? 'Enter OTP' : (isLogin ? 'Login' : 'Register')}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {step === 'otp' 
                ? 'Enter the verification code sent to your email'
                : (isLogin ? 'Welcome back to SPARK' : 'Create your SPARK account')
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'credentials' ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <Label htmlFor="aadhaar" className="text-gray-300">Aadhaar Number</Label>
                      <Input
                        id="aadhaar"
                        type="text"
                        value={formData.aadhaarNumber}
                        onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="username" className="text-gray-300">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="otp" className="text-gray-300">6-Digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={formData.otp}
                    onChange={(e) => setFormData({...formData, otp: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    maxLength={6}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300"
                  onClick={() => setStep('credentials')}
                >
                  Back to Login
                </Button>
              </form>
            )}

            {step === 'credentials' && (
              <>
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                  </Button>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={handleDemoLogin}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Quick Demo Access
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
