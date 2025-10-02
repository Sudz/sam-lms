import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface PaymentInitializationData {
  email: string;
  amount: number; // in kobo (smallest currency unit)
  currency: string;
  reference?: string;
  callback_url?: string;
  metadata?: any;
}

export interface PaymentVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string;
    customer: {
      email: string;
    };
    metadata: any;
  };
}

class PaystackService {
  private headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  /**
   * Initialize a payment transaction
   */
  async initializePayment(data: PaymentInitializationData) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        data,
        { headers: this.headers }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Paystack initialization error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Payment initialization failed',
      };
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        { headers: this.headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Paystack verification error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET || '')
      .update(payload)
      .digest('hex');
    
    return hash === signature;
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies() {
    return ['NGN', 'GHS', 'ZAR', 'USD'];
  }

  /**
   * Convert amount to kobo (smallest currency unit)
   */
  convertToKobo(amount: number): number {
    return amount * 100;
  }

  /**
   * Convert kobo to main currency unit
   */
  convertFromKobo(amount: number): number {
    return amount / 100;
  }
}

export default new PaystackService();
