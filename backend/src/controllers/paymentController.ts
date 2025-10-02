import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import paystackService from '../services/paystackService';
import emailService from '../services/emailService';
import smsService from '../services/smsService';

/**
 * Initialize payment for course enrollment
 */
export const initializePayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { course_id } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  // Get course details
  const courseResult = await pool.query(
    `SELECT * FROM courses WHERE id = $1 AND is_published = true`,
    [course_id]
  );

  if (courseResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Course not found',
    });
  }

  const course = courseResult.rows[0];

  // Check if already enrolled
  const enrollmentCheck = await pool.query(
    `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
    [userId, course_id]
  );

  if (enrollmentCheck.rows.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Already enrolled in this course',
    });
  }

  // Generate payment reference
  const reference = `SAM-${Date.now()}-${userId}-${course_id}`;

  // Initialize payment with Paystack
  const paymentData = {
    email: req.user.email,
    amount: paystackService.convertToKobo(course.price),
    currency: course.currency,
    reference,
    callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
    metadata: {
      user_id: userId,
      course_id,
      course_title: course.title,
    },
  };

  const paymentResponse = await paystackService.initializePayment(paymentData);

  if (!paymentResponse.success) {
    return res.status(500).json({
      success: false,
      message: 'Payment initialization failed',
    });
  }

  // Save payment record
  await pool.query(
    `INSERT INTO payments (user_id, course_id, amount, currency, payment_method, payment_reference, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, course_id, course.price, course.currency, 'paystack', reference, 'pending']
  );

  res.json({
    success: true,
    data: {
      authorization_url: paymentResponse.data.authorization_url,
      access_code: paymentResponse.data.access_code,
      reference,
    },
  });
});

/**
 * Verify payment and enroll user
 */
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { reference } = req.params;

  // Verify payment with Paystack
  const verificationResponse = await paystackService.verifyPayment(reference);

  if (!verificationResponse.status || verificationResponse.data.status !== 'success') {
    return res.status(400).json({
      success: false,
      message: 'Payment verification failed',
    });
  }

  const { user_id, course_id } = verificationResponse.data.metadata;

  // Update payment status
  await pool.query(
    `UPDATE payments 
     SET status = $1, paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE payment_reference = $2`,
    ['completed', reference]
  );

  // Enroll user in course
  const enrollmentResult = await pool.query(
    `INSERT INTO enrollments (user_id, course_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, course_id) DO NOTHING
     RETURNING *`,
    [user_id, course_id]
  );

  // Get user and course details for notifications
  const userResult = await pool.query(
    `SELECT u.email, u.name, up.phone_number, up.country_code
     FROM users u
     LEFT JOIN user_profiles up ON u.id = up.user_id
     WHERE u.id = $1`,
    [user_id]
  );

  const courseResult = await pool.query(
    `SELECT title FROM courses WHERE id = $1`,
    [course_id]
  );

  const user = userResult.rows[0];
  const course = courseResult.rows[0];

  // Send notifications
  if (user && course) {
    // Send email
    await emailService.sendEnrollmentConfirmation(
      user.email,
      user.name,
      course.title,
      course_id
    );

    // Send SMS if phone number is available
    if (user.phone_number && user.country_code) {
      const phoneNumber = smsService.formatPhoneNumber(user.phone_number, user.country_code);
      await smsService.sendEnrollmentConfirmation(phoneNumber, course.title);
    }
  }

  res.json({
    success: true,
    message: 'Payment verified and enrollment completed',
    data: {
      enrollment: enrollmentResult.rows[0],
      payment: verificationResponse.data,
    },
  });
});

/**
 * Paystack webhook handler
 */
export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['x-paystack-signature'] as string;
  const payload = JSON.stringify(req.body);

  // Verify webhook signature
  if (!paystackService.verifyWebhookSignature(payload, signature)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid signature',
    });
  }

  const event = req.body;

  // Handle different event types
  switch (event.event) {
    case 'charge.success':
      // Payment successful - already handled in verify endpoint
      console.log('Payment successful:', event.data.reference);
      break;

    case 'charge.failed':
      // Update payment status to failed
      await pool.query(
        `UPDATE payments 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE payment_reference = $2`,
        ['failed', event.data.reference]
      );
      break;

    default:
      console.log('Unhandled webhook event:', event.event);
  }

  res.json({ success: true });
});
