import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  initializePayment,
  verifyPayment,
  handleWebhook,
} from '../controllers/paymentController';

const router = Router();
const basePath = '/api/payments';

// Initialize payment (requires authentication)
router.post(`${basePath}/initialize`, requireAuth, initializePayment);

// Verify payment (public endpoint)
router.get(`${basePath}/verify/:reference`, verifyPayment);

// Paystack webhook handler (public endpoint)
router.post(`${basePath}/webhook`, handleWebhook);

export default router;
