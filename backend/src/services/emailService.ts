import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_BASE_URL = 'https://api.resend.com';
const FROM_EMAIL = process.env.BETTERAUTH_EMAIL_FROM || 'no-reply@samlms.com';

export interface EmailData {
  to: string[];
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private headers = {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  };

  /**
   * Send email
   */
  async sendEmail(data: EmailData) {
    try {
      const response = await axios.post(
        `${RESEND_BASE_URL}/emails`,
        {
          from: FROM_EMAIL,
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text,
        },
        { headers: this.headers }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Email sending error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Email sending failed',
      };
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, name: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to SAM LMS!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Welcome to SAM LMS! We're excited to have you join our community of learners.</p>
              <p>Start exploring our courses and begin your learning journey today.</p>
              <a href="https://samlms.com/courses" class="button">Browse Courses</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Happy learning!</p>
              <p><strong>The SAM LMS Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: [email],
      subject: 'Welcome to SAM LMS!',
      html,
      text: `Hi ${name}, Welcome to SAM LMS! Start exploring our courses at https://samlms.com/courses`,
    });
  }

  /**
   * Send enrollment confirmation email
   */
  async sendEnrollmentConfirmation(email: string, name: string, courseName: string, courseId: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Enrollment Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>You've successfully enrolled in <strong>${courseName}</strong>!</p>
              <p>You can start learning right away. Access your course from your dashboard.</p>
              <a href="https://samlms.com/courses/${courseId}" class="button">Start Learning</a>
              <p>Good luck with your studies!</p>
              <p><strong>The SAM LMS Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: [email],
      subject: `Enrollment Confirmed: ${courseName}`,
      html,
      text: `Hi ${name}, You've successfully enrolled in ${courseName}! Start learning at https://samlms.com/courses/${courseId}`,
    });
  }

  /**
   * Send course completion email
   */
  async sendCourseCompletionEmail(email: string, name: string, courseName: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Congratulations on completing <strong>${courseName}</strong>!</p>
              <p>Your certificate of completion is now available.</p>
              <a href="https://samlms.com/certificates" class="button">View Certificate</a>
              <p>Keep up the great work and continue your learning journey!</p>
              <p><strong>The SAM LMS Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: [email],
      subject: `Congratulations! You completed ${courseName}`,
      html,
      text: `Hi ${name}, Congratulations on completing ${courseName}! View your certificate at https://samlms.com/certificates`,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, name: string, resetToken: string) {
    const resetUrl = `https://samlms.com/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>We received a request to reset your password.</p>
              <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>If you didn't request this, please ignore this email.</p>
              <p><strong>The SAM LMS Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: [email],
      subject: 'Password Reset Request',
      html,
      text: `Hi ${name}, Reset your password at ${resetUrl}. This link expires in 1 hour.`,
    });
  }
}

export default new EmailService();
