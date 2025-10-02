import { Router } from 'express';

const router = Router();

// Placeholder routes for authentication
// BetterAuth will handle most of the authentication logic
// These routes are for custom authentication-related endpoints

router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update user profile' });
});

export default router;
