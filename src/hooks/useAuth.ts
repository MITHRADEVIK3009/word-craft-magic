
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  aadhaarNumber: string;
  phoneNumber: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const token = localStorage.getItem('token');
      if (!token) return null;

      if (token === 'demo_token') {
        return {
          id: 'demo_user',
          name: 'Demo User',
          username: 'demo_user',
          email: 'demo@spark.gov.in',
          role: 'citizen',
          aadhaarNumber: '1234-5678-9012',
          phoneNumber: '+91-9876543210'
        };
      }

      try {
        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          return null;
        }

        return response.json();
      } catch (error) {
        localStorage.removeItem('token');
        return null;
      }
    },
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem('token');
    queryClient.setQueryData(['user'], null);
    window.location.reload();
  };

  return { user, isLoading, logout };
}
