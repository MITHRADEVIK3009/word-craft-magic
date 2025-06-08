import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import SupabaseConnectionTest from './components/SupabaseConnectionTest';

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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    return {
      id: data.id,
      username: data.id, // Using ID as username for now
      email: email,
      name: data.first_name || '',
      aadhaarNumber: data.aadhaar_number || '',
      phoneNumber: data.phone || '',
      role: 'citizen',
      created_at: new Date(data.created_at)
    };
  }

  async storeOTP(email: string, otp: string, expiresAt: Date): Promise<boolean> {
    const { error } = await supabase
      .from('otp_records')
      .upsert({
        email,
        otp,
        expires_at: expiresAt.toISOString(),
        verified: false
      });

    return !error;
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('otp_records')
      .update({ verified: true })
      .eq('email', email)
      .eq('otp', otp)
      .gt('expires_at', new Date().toISOString())
      .eq('verified', false)
      .select()
      .single();

    if (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }

    return !!data;
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
      progress: app.progress || 0,
      submittedAt: new Date(app.created_at),
      estimatedCompletion: app.estimated_completion_date ? new Date(app.estimated_completion_date) : new Date(),
      completedAt: app.status === 'completed' ? new Date(app.updated_at) : undefined
    }));
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('Error fetching certificates:', error);
      return [];
    }

    return data.map(cert => ({
      id: cert.id,
      userId: cert.user_id,
      type: cert.type,
      issueDate: new Date(cert.issue_date),
      validUntil: new Date(cert.valid_until),
      authority: cert.authority,
      blockchainHash: cert.blockchain_hash,
      ipfsHash: cert.ipfs_hash,
      digitalSignature: cert.digital_signature
    }));
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
        status: 'submitted',
        progress: 0,
        title: appData.details.title || 'New Application',
        description: appData.details.description || '',
        category: appData.details.category || 'general',
        priority: appData.details.priority || 'normal',
        estimated_completion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
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
      progress: data.progress || 0,
      submittedAt: new Date(data.created_at),
      estimatedCompletion: data.estimated_completion_date ? new Date(data.estimated_completion_date) : new Date(),
      completedAt: data.status === 'completed' ? new Date(data.updated_at) : undefined
    };
  }

  async logUserActivity(userId: string, action: string, details: any): Promise<void> {
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        action,
        details: JSON.stringify(details),
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error logging user activity:', error);
    }
  }

  async getSystemMetrics(): Promise<any> {
    const [
      { count: totalUsers },
      { count: totalApplications },
      { count: totalCertificates },
      { data: serviceTypes },
      { data: applicationStatus }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('service_requests').select('*', { count: 'exact', head: true }),
      supabase.from('certificates').select('*', { count: 'exact', head: true }),
      supabase.from('service_requests').select('service_type').select('count'),
      supabase.from('service_requests').select('status').select('count')
    ]);
    
    return {
      totalUsers: totalUsers || 0,
      totalApplications: totalApplications || 0,
      totalCertificates: totalCertificates || 0,
      serviceTypes: serviceTypes || [],
      applicationStatus: applicationStatus || []
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
