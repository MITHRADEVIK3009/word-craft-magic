
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private config: EmailConfig;

  constructor() {
    // Using a free SMTP service for demo - in production, use Azure Email Service
    this.config = {
      host: 'smtp.gmail.com', // Can be configured to use Microsoft/Azure SMTP
      port: 587,
      secure: false,
      auth: {
        user: 'sparkplatform2024@gmail.com', // Using hardcoded value for demo
        pass: 'your-app-password' // This should be set via environment variables in production
      }
    };
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // In a real environment, this would use nodemailer or Azure Email Service
      // For now, simulating email sending with a POST request to a backend service
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...emailData,
          config: this.config
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendOTP(email: string, otp: string, userName: string = 'User'): Promise<boolean> {
    const emailData: EmailData = {
      to: email,
      subject: 'SPARK Platform - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: #fbbf24; margin: 0; font-size: 32px; font-weight: bold;">SPARK</h1>
            <p style="color: #d1d5db; margin: 5px 0 0 0; font-size: 14px;">Smart Public Auto Record Keeper</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #1f2937; text-align: center; margin-bottom: 20px;">Email Verification</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Dear ${userName},
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Your OTP for SPARK platform verification is:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #fbbf24; color: #1f2937; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 8px; display: inline-block;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">
              This OTP is valid for 10 minutes. Please do not share this code with anyone.
            </p>
            
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <p style="color: #1e40af; font-size: 14px; margin: 0;">
                <strong>Security Notice:</strong> SPARK will never ask you to share your OTP via phone or email. 
                If you didn't request this verification, please ignore this email.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 12px;">
            <p>This is an automated message from SPARK Platform.</p>
            <p>Powered by Microsoft AI Innovation Challenge 2024</p>
          </div>
        </div>
      `,
      text: `
        SPARK Platform - OTP Verification
        
        Dear ${userName},
        
        Your OTP for SPARK platform verification is: ${otp}
        
        This OTP is valid for 10 minutes. Please do not share this code with anyone.
        
        If you didn't request this verification, please ignore this email.
        
        Best regards,
        SPARK Team
      `
    };

    return await this.sendEmail(emailData);
  }

  async sendCertificateNotification(email: string, certificateType: string, userName: string): Promise<boolean> {
    const emailData: EmailData = {
      to: email,
      subject: `SPARK - Your ${certificateType} is Ready`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: #fbbf24; margin: 0; font-size: 32px; font-weight: bold;">SPARK</h1>
            <p style="color: #d1d5db; margin: 5px 0 0 0; font-size: 14px;">Smart Public Auto Record Keeper</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 30px; border-radius: 10px; margin: 20px 0; border: 2px solid #10b981;">
            <h2 style="color: #065f46; text-align: center; margin-bottom: 20px;">🎉 Certificate Ready!</h2>
            <p style="color: #047857; font-size: 16px; line-height: 1.5;">
              Dear ${userName},
            </p>
            <p style="color: #047857; font-size: 16px; line-height: 1.5;">
              Great news! Your <strong>${certificateType}</strong> has been processed and is now available in your SPARK dashboard.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://spark-platform.com/dashboard" style="background: #fbbf24; color: #1f2937; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; display: inline-block;">
                View Certificate
              </a>
            </div>
            
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <p style="color: #1e40af; font-size: 14px; margin: 0;">
                <strong>Blockchain Verified:</strong> Your certificate is secured on blockchain for tamper-proof verification.
              </p>
            </div>
          </div>
        </div>
      `
    };

    return await this.sendEmail(emailData);
  }
}

export const emailService = new EmailService();
