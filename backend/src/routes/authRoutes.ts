import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { getUserProfile, updateUserProfile } from '../controllers/userController';

const router = Router();
const basePath = '/api/user';

// User profile routes (protected)
router.get(`${basePath}/profile`, requireAuth, getUserProfile);
router.put(`${basePath}/profile`, requireAuth, updateUserProfile);

export default router;
