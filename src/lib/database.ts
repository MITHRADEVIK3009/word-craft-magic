
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  aadhaarNumber: string;
  phoneNumber: string;
  role: string;
  created_at: Date;
}

interface Application {
  id: string;
  userId: string;
  serviceType: string;
  status: string;
  progress: number;
  submittedAt: Date;
  estimatedCompletion: Date;
  completedAt?: Date;
}

interface Certificate {
  id: string;
  userId: string;
  type: string;
  issueDate: Date;
  validUntil: Date;
  authority: string;
  blockchainHash: string;
  ipfsHash: string;
  digitalSignature: string;
}

interface OTPRecord {
  id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
}

class DatabaseManager {
  async createUser(userData: {
    username: string;
    email: string;
    name: string;
    aadhaarNumber: string;
    phoneNumber: string;
    passwordHash: string;
  }): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        first_name: userData.name,
        last_name: '',
        phone: userData.phoneNumber,
        aadhaar_number: userData.aadhaarNumber,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return {
      id: data.id,
      username: userData.username,
      email: userData.email,
      name: userData.name,
      aadhaarNumber: data.aadhaar_number || '',
      phoneNumber: data.phone || '',
      role: 'citizen',
      created_at: new Date(data.created_at)
    };
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', username)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return {
      id: data.id,
      username: username,
      email: '', // You'll need to store this in a separate table
      name: data.first_name || '',
      aadhaarNumber: data.aadhaar_number || '',
      phoneNumber: data.phone || '',
      role: 'citizen',
      created_at: new Date(data.created_at)
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // Since we don't have an email column in profiles, we'll need to use a different approach
    // For now, return null and suggest implementing proper auth
    console.log('getUserByEmail not implemented - use Supabase auth instead');
    return null;
  }

  async storeOTP(email: string, otp: string, expiresAt: Date): Promise<boolean> {
    // OTP table doesn't exist, so we'll simulate this for now
    console.log('OTP storage simulated:', { email, otp });
    return true;
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    // OTP verification simulated
    console.log('OTP verification simulated:', { email, otp });
    return otp === '123456'; // Simple demo OTP
  }

  async getUserApplications(userId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }

    return data.map(app => ({
      id: app.id,
      userId: app.user_id,
      serviceType: app.service_type,
      status: app.status,
      progress: 50, // Default progress since column doesn't exist
      submittedAt: new Date(app.created_at),
      estimatedCompletion: app.estimated_completion_date ? new Date(app.estimated_completion_date) : new Date(),
      completedAt: app.status === 'completed' ? new Date(app.updated_at) : undefined
    }));
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    // Certificates table doesn't exist, return empty array
    console.log('Certificates table not implemented yet');
    return [];
  }

  async createApplication(appData: {
    userId: string;
    serviceType: string;
    details: any;
  }): Promise<Application | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        user_id: appData.userId,
        service_type: appData.serviceType,
        status: 'pending',
        title: appData.details.title || 'New Application',
        description: appData.details.description || '',
        category: appData.details.category || 'general',
        priority: appData.details.priority || 'medium',
        estimated_completion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      serviceType: data.service_type,
      status: data.status,
      progress: 0,
      submittedAt: new Date(data.created_at),
      estimatedCompletion: data.estimated_completion_date ? new Date(data.estimated_completion_date) : new Date(),
      completedAt: data.status === 'completed' ? new Date(data.updated_at) : undefined
    };
  }

  async logUserActivity(userId: string, action: string, details: any): Promise<void> {
    // User activities table doesn't exist, log to console
    console.log('User activity:', { userId, action, details });
  }

  async getSystemMetrics(): Promise<any> {
    const [
      { count: totalUsers },
      { count: totalApplications }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('service_requests').select('*', { count: 'exact', head: true })
    ]);
    
    return {
      totalUsers: totalUsers || 0,
      totalApplications: totalApplications || 0,
      totalCertificates: 0,
      serviceTypes: [],
      applicationStatus: []
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      return !error;
    } catch (error) {
      console.error('Error testing database connection:', error);
      return false;
    }
  }
}

export const db = new DatabaseManager();
export type { User, Application, Certificate, OTPRecord };
