import { Router } from 'express';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';

const router = Router();

// Public routes (with optional auth to check enrollment status)
router.get('/', optionalAuth, getAllCourses);
router.get('/:id', optionalAuth, getCourseById);

// Protected routes (require authentication)
router.post('/', requireAuth, createCourse);
router.put('/:id', requireAuth, updateCourse);
router.delete('/:id', requireAuth, deleteCourse);

export default router;
