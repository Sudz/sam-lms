import { Router } from 'express';

const router = Router();

// Placeholder routes for payments
router.post('/initialize', (req, res) => {
  res.json({ message: 'Initialize payment with Paystack' });
});

router.post('/webhook', (req, res) => {
  res.json({ message: 'Paystack webhook handler' });
});

router.get('/verify/:reference', (req, res) => {
  res.json({ message: `Verify payment with reference ${req.params.reference}` });
});

export default router;
