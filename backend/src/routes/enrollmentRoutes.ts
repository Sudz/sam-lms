import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  getUserEnrollments,
  enrollInCourse,
  getCourseProgress,
  updateLessonProgress,
} from '../controllers/enrollmentController';

const router = Router();

// All enrollment routes require authentication
router.get('/', requireAuth, getUserEnrollments);
router.post('/', requireAuth, enrollInCourse);
router.get('/:courseId/progress', requireAuth, getCourseProgress);
router.put('/:courseId/progress', requireAuth, updateLessonProgress);

export default router;
