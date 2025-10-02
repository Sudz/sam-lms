import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { getUserProfile, updateUserProfile } from '../controllers/userController';

const router = Router();

// User profile routes (protected)
router.get('/profile', requireAuth, getUserProfile);
router.put('/profile', requireAuth, updateUserProfile);

export default router;
