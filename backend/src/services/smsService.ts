import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AT_USERNAME = process.env.AFRICASTALKING_USERNAME;
const AT_API_KEY = process.env.AFRICASTALKING_API_KEY;
const AT_SENDER_ID = process.env.AFRICASTALKING_SENDER_ID || 'SAM LMS';
const AT_BASE_URL = 'https://api.africastalking.com/version1';

export interface SMSData {
  to: string[]; // Phone numbers in international format (e.g., +27123456789)
  message: string;
}

class SMSService {
  /**
   * Send SMS to one or more recipients
   */
  async sendSMS(data: SMSData) {
    try {
      const response = await axios.post(
        `${AT_BASE_URL}/messaging`,
        {
          username: AT_USERNAME,
          to: data.to.join(','),
          message: data.message,
          from: AT_SENDER_ID,
        },
        {
          headers: {
            'apiKey': AT_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('SMS sending error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'SMS sending failed',
      };
    }
  }

  /**
   * Send course enrollment confirmation SMS
   */
  async sendEnrollmentConfirmation(phoneNumber: string, courseName: string) {
    const message = `Welcome to ${courseName}! You've successfully enrolled. Start learning at samlms.com. Happy learning!`;
    
    return this.sendSMS({
      to: [phoneNumber],
      message,
    });
  }

  /**
   * Send course completion SMS
   */
  async sendCourseCompletionNotification(phoneNumber: string, courseName: string) {
    const message = `Congratulations! You've completed ${courseName}. Your certificate is ready. View it at samlms.com/certificates`;
    
    return this.sendSMS({
      to: [phoneNumber],
      message,
    });
  }

  /**
   * Send course reminder SMS
   */
  async sendCourseReminder(phoneNumber: string, courseName: string) {
    const message = `Don't forget to continue your learning! ${courseName} is waiting for you. Keep up the momentum at samlms.com`;
    
    return this.sendSMS({
      to: [phoneNumber],
      message,
    });
  }

  /**
   * Send verification code SMS
   */
  async sendVerificationCode(phoneNumber: string, code: string) {
    const message = `Your SAM LMS verification code is: ${code}. Valid for 10 minutes. Do not share this code.`;
    
    return this.sendSMS({
      to: [phoneNumber],
      message,
    });
  }

  /**
   * Format phone number to international format
   */
  formatPhoneNumber(phoneNumber: string, countryCode: string = '+27'): string {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If number starts with 0, remove it
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // Add country code if not present
    if (!cleaned.startsWith(countryCode.replace('+', ''))) {
      cleaned = countryCode.replace('+', '') + cleaned;
    }
    
    return '+' + cleaned;
  }
}

export default new SMSService();
