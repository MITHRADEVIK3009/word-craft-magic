
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
        const response = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          localStorage.removeItem('authToken');
          return null;
        }

        const userData = await response.json();
        
        // Log user activity
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const { token, user } = await response.json();
      
      // Log successful login
      await db.logUserActivity(user.id, 'login', { method: 'password', timestamp: new Date() });
      
      return { token, user };
    },
    onSuccess: ({ token }) => {
      localStorage.setItem('authToken', token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
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
      // Generate OTP first
      const otpResult = await aiCrew.executeTask('auth', {
        action: 'generate_otp',
        email: userData.email
      });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      return await response.json();
    }
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const isValid = await aiCrew.executeTask('auth', {
        action: 'verify_otp',
        email,
        otp
      });

      if (!isValid) {
        throw new Error('Invalid OTP');
      }

      return { verified: true };
    }
  });

  const logout = () => {
    if (user) {
      db.logUserActivity(user.id, 'logout', { timestamp: new Date() });
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
    loginError: loginMutation.error,
    registerError: registerMutation.error
  };
}
