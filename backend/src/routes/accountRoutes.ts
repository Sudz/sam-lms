import { Router } from 'express';
import {
  changePassword,
  getAuthConfiguration,
  requestPasswordReset,
  resendVerificationEmail,
  resetPassword,
} from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
const basePath = '/api/account';

router.get(`${basePath}/config`, getAuthConfiguration);
router.post(`${basePath}/password/request-reset`, requestPasswordReset);
router.post(`${basePath}/password/reset`, resetPassword);
router.post(`${basePath}/password/change`, requireAuth, changePassword);
router.post(`${basePath}/email/resend-verification`, resendVerificationEmail);

export default router;
