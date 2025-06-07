
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

class DatabaseManager {
  private dbUrl = 'postgres://postgres:jayanthir@localhost:5432/document';

  async query(sql: string, params: any[] = []): Promise<any[]> {
    try {
      const response = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params })
      });
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
             phone_number as "phoneNumber", role, created_at
      FROM users WHERE username = $1
    `;
    const result = await this.query(sql, [username]);
    return result[0] || null;
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
}

export const db = new DatabaseManager();
export type { User, Application, Certificate };
