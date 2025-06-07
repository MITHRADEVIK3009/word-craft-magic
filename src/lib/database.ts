
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
  estimatedCompletion?: Date;
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
  private dbUrl = 'postgres://postgres:Mdcse1221%40@localhost:5000/document';

  async query(sql: string, params: any[] = []): Promise<any[]> {
    try {
      const response = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params, connectionString: this.dbUrl })
      });
      
      if (!response.ok) {
        console.error('Database query failed:', response.statusText);
        return [];
      }
      
      const data = await response.json();
      return data.rows || [];
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  }

  async createUser(userData: {
    username: string;
    email: string;
    name: string;
    aadhaarNumber: string;
    phoneNumber: string;
    passwordHash: string;
  }): Promise<User | null> {
    const sql = `
      INSERT INTO users (username, email, name, aadhaar_number, phone_number, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, $6, 'citizen')
      RETURNING id, username, email, name, aadhaar_number as "aadhaarNumber", phone_number as "phoneNumber", role, created_at
    `;
    const result = await this.query(sql, [
      userData.username,
      userData.email,
      userData.name,
      userData.aadhaarNumber,
      userData.phoneNumber,
      userData.passwordHash
    ]);
    return result[0] || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const sql = `
      SELECT id, username, email, name, aadhaar_number as "aadhaarNumber", 
             phone_number as "phoneNumber", role, created_at, password_hash
      FROM users WHERE username = $1
    `;
    const result = await this.query(sql, [username]);
    return result[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const sql = `
      SELECT id, username, email, name, aadhaar_number as "aadhaarNumber", 
             phone_number as "phoneNumber", role, created_at
      FROM users WHERE email = $1
    `;
    const result = await this.query(sql, [email]);
    return result[0] || null;
  }

  async storeOTP(email: string, otp: string, expiresAt: Date): Promise<boolean> {
    const sql = `
      INSERT INTO otp_records (email, otp, expires_at, verified)
      VALUES ($1, $2, $3, false)
      ON CONFLICT (email) 
      DO UPDATE SET otp = $2, expires_at = $3, verified = false
    `;
    const result = await this.query(sql, [email, otp, expiresAt]);
    return result !== null;
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const sql = `
      UPDATE otp_records 
      SET verified = true 
      WHERE email = $1 AND otp = $2 AND expires_at > NOW() AND verified = false
      RETURNING id
    `;
    const result = await this.query(sql, [email, otp]);
    return result.length > 0;
  }

  async getUserApplications(userId: string): Promise<Application[]> {
    const sql = `
      SELECT id, user_id as "userId", service_type as "serviceType", status, progress,
             submitted_at as "submittedAt", estimated_completion as "estimatedCompletion",
             completed_at as "completedAt"
      FROM applications WHERE user_id = $1 ORDER BY submitted_at DESC
    `;
    return await this.query(sql, [userId]);
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    const sql = `
      SELECT id, user_id as "userId", type, issue_date as "issueDate",
             valid_until as "validUntil", authority, blockchain_hash as "blockchainHash",
             ipfs_hash as "ipfsHash", digital_signature as "digitalSignature"
      FROM certificates WHERE user_id = $1 ORDER BY issue_date DESC
    `;
    return await this.query(sql, [userId]);
  }

  async createApplication(appData: {
    userId: string;
    serviceType: string;
    details: any;
  }): Promise<Application | null> {
    const sql = `
      INSERT INTO applications (user_id, service_type, status, progress, submitted_at, estimated_completion)
      VALUES ($1, $2, 'submitted', 0, NOW(), NOW() + INTERVAL '7 days')
      RETURNING id, user_id as "userId", service_type as "serviceType", status, progress,
                submitted_at as "submittedAt", estimated_completion as "estimatedCompletion"
    `;
    const result = await this.query(sql, [appData.userId, appData.serviceType]);
    return result[0] || null;
  }

  async logUserActivity(userId: string, action: string, details: any): Promise<void> {
    const sql = `
      INSERT INTO user_activities (user_id, action, details, timestamp)
      VALUES ($1, $2, $3, NOW())
    `;
    await this.query(sql, [userId, action, JSON.stringify(details)]);
  }

  async getSystemMetrics(): Promise<any> {
    const queries = [
      'SELECT COUNT(*) as total_users FROM users',
      'SELECT COUNT(*) as total_applications FROM applications',
      'SELECT COUNT(*) as total_certificates FROM certificates',
      'SELECT service_type, COUNT(*) as count FROM applications GROUP BY service_type',
      'SELECT status, COUNT(*) as count FROM applications GROUP BY status'
    ];

    const results = await Promise.all(queries.map(query => this.query(query)));
    
    return {
      totalUsers: results[0][0]?.total_users || 0,
      totalApplications: results[1][0]?.total_applications || 0,
      totalCertificates: results[2][0]?.total_certificates || 0,
      serviceTypes: results[3] || [],
      applicationStatus: results[4] || []
    };
  }
}

export const db = new DatabaseManager();
export type { User, Application, Certificate, OTPRecord };
