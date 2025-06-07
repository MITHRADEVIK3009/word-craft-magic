
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [currentEmail, setCurrentEmail] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    aadhaarNumber: '',
    phoneNumber: '',
    otp: ''
  });

  const { 
    login, 
    register, 
    verifyOTP, 
    isLoginLoading, 
    isRegisterLoading, 
    isOTPLoading,
    loginError,
    registerError,
    otpError
  } = useAuth();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      login(
        { username: formData.username, password: formData.password },
        {
          onSuccess: (data) => {
            if (data.otpSent) {
              setCurrentEmail(data.user.email);
              setStep('otp');
              toast({
                title: "OTP Sent Successfully",
                description: `Please check ${data.user.email} for your verification code.`,
              });
            }
          },
          onError: (error: any) => {
            toast({
              title: "Login Failed",
              description: error.message || "Invalid credentials",
              variant: "destructive",
            });
          }
        }
      );
    } else {
      register(
        formData,
        {
          onSuccess: (data) => {
            if (data.otpSent) {
              setCurrentEmail(formData.email);
              setStep('otp');
              toast({
                title: "Registration Successful",
                description: `OTP sent to ${formData.email}. Please verify to complete registration.`,
              });
            }
          },
          onError: (error: any) => {
            toast({
              title: "Registration Failed",
              description: error.message || "Registration failed",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    verifyOTP(
      { email: currentEmail, otp: formData.otp },
      {
        onSuccess: () => {
          toast({
            title: "Welcome to SPARK!",
            description: "You have been successfully verified.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Verification Failed",
            description: error.message || "Invalid OTP",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleDemoLogin = () => {
    setFormData({ ...formData, username: 'demo_user', password: 'demo123' });
    // Simulate successful demo login
    const demoUser = {
      id: 'demo-123',
      username: 'demo_user',
      email: 'demo@spark.gov.in',
      name: 'Demo User',
      aadhaarNumber: '1234-5678-9012',
      phoneNumber: '+91-9876543210',
      role: 'citizen',
      created_at: new Date()
    };
    
    localStorage.setItem('authToken', JSON.stringify(demoUser));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">SPARK</h1>
          <p className="text-gray-300">Smart Public Auto Record Keeper</p>
          <p className="text-sm text-gray-400 mt-2">Powered by AI • Secured by Blockchain • Built for Everyone</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">
              {step === 'otp' ? 'Email Verification' : (isLogin ? 'Login' : 'Register')}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {step === 'otp' 
                ? `Enter the 6-digit code sent to ${currentEmail}`
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
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required={!isLogin}
                        placeholder="your.email@example.com"
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
                        placeholder="1234-5678-9012"
                        maxLength={12}
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
                        placeholder="+91-9876543210"
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
                    placeholder="Enter username"
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
                    placeholder="Enter password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                  disabled={isLoginLoading || isRegisterLoading}
                >
                  {(isLoginLoading || isRegisterLoading) ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                      {isLogin ? 'Logging in...' : 'Creating account...'}
                    </div>
                  ) : (
                    isLogin ? 'Login' : 'Create Account'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-gray-300">Enter 6-Digit OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={formData.otp}
                      onChange={(value) => setFormData({...formData, otp: value})}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="bg-gray-700 border-gray-600 text-white" />
                        <InputOTPSlot index={1} className="bg-gray-700 border-gray-600 text-white" />
                        <InputOTPSlot index={2} className="bg-gray-700 border-gray-600 text-white" />
                        <InputOTPSlot index={3} className="bg-gray-700 border-gray-600 text-white" />
                        <InputOTPSlot index={4} className="bg-gray-700 border-gray-600 text-white" />
                        <InputOTPSlot index={5} className="bg-gray-700 border-gray-600 text-white" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-sm text-gray-400 text-center">
                    Check your email for the verification code
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                  disabled={isOTPLoading || formData.otp.length !== 6}
                >
                  {isOTPLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setStep('credentials')}
                >
                  ← Back to Login
                </Button>
              </form>
            )}

            {step === 'credentials' && (
              <>
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                  </Button>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={handleDemoLogin}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    🚀 Quick Demo Access
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Experience SPARK instantly with demo data
                  </p>
                </div>
              </>
            )}

            {/* Error Display */}
            {(loginError || registerError || otpError) && (
              <div className="p-3 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">
                {loginError?.message || registerError?.message || otpError?.message}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>🔒 Secured with blockchain technology</p>
          <p>🧠 Powered by Microsoft AI</p>
          <p>🌍 Accessible in multiple languages</p>
        </div>
      </div>
    </div>
  );
}
