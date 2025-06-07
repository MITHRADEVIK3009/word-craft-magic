
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, type User } from '@/lib/database';
import { aiCrew } from '@/lib/aiAgents';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      try {
        // In production, this would verify the JWT token
        const userData = JSON.parse(token);
        
        // Log user activity in real database
        if (userData) {
          await db.logUserActivity(userData.id, 'session_check', { timestamp: new Date() });
        }
        
        return userData;
      } catch (error) {
        localStorage.removeItem('authToken');
        return null;
      }
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      // Get user from real database
      const user = await db.getUserByUsername(username);
      if (!user) {
        throw new Error('User not found');
      }

      // In production, verify password hash
      // For demo, accepting any password for existing users
      
      // Generate and send OTP via real SMTP
      const otpResult = await aiCrew.executeTask('auth', {
        action: 'generate_otp',
        email: user.email
      });

      if (!otpResult.emailSent) {
        throw new Error('Failed to send OTP email');
      }
      
      // Log successful login attempt
      await db.logUserActivity(user.id, 'login_attempt', { 
        method: 'password', 
        timestamp: new Date(),
        otpSent: otpResult.emailSent 
      });
      
      return { user, otpSent: true };
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      username: string;
      password: string;
      email: string;
      name: string;
      aadhaarNumber: string;
      phoneNumber: string;
    }) => {
      // Create user in real database
      const hashedPassword = btoa(userData.password); // In production, use proper hashing
      
      const newUser = await db.createUser({
        ...userData,
        passwordHash: hashedPassword
      });

      if (!newUser) {
        throw new Error('Failed to create user');
      }

      // Generate OTP for email verification
      const otpResult = await aiCrew.executeTask('auth', {
        action: 'generate_otp',
        email: userData.email
      });

      // Log registration
      await db.logUserActivity(newUser.id, 'registration', { 
        timestamp: new Date(),
        otpSent: otpResult.emailSent 
      });

      return { user: newUser, otpSent: otpResult.emailSent };
    }
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      // Verify OTP using real database
      const isValid = await aiCrew.executeTask('auth', {
        action: 'verify_otp',
        email,
        otp
      });

      if (!isValid) {
        throw new Error('Invalid OTP');
      }

      // Get user and create session
      const user = await db.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // Log successful verification
      await db.logUserActivity(user.id, 'otp_verified', { timestamp: new Date() });

      return { user, verified: true };
    },
    onSuccess: ({ user }) => {
      // Create session token (in production, use proper JWT)
      const token = JSON.stringify(user);
      localStorage.setItem('authToken', token);
      queryClient.setQueryData(['user'], user);
    }
  });

  const logout = async () => {
    if (user) {
      await db.logUserActivity(user.id, 'logout', { timestamp: new Date() });
    }
    localStorage.removeItem('authToken');
    queryClient.setQueryData(['user'], null);
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    verifyOTP: verifyOTPMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isOTPLoading: verifyOTPMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    otpError: verifyOTPMutation.error
  };
}
