import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  getUserEnrollments,
  enrollInCourse,
  getCourseProgress,
  updateLessonProgress,
} from '../controllers/enrollmentController';

const router = Router();
const basePath = '/api/enrollments';

// All enrollment routes require authentication
router.get(basePath, requireAuth, getUserEnrollments);
router.post(basePath, requireAuth, enrollInCourse);
router.get(`${basePath}/:courseId/progress`, requireAuth, getCourseProgress);
router.put(`${basePath}/:courseId/progress`, requireAuth, updateLessonProgress);

export default router;
