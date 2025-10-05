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
const basePath = '/api/courses';

// Public routes (with optional auth to check enrollment status)
router.get(basePath, optionalAuth, getAllCourses);
router.get(`${basePath}/:id`, optionalAuth, getCourseById);

// Protected routes (require authentication)
router.post(basePath, requireAuth, createCourse);
router.put(`${basePath}/:id`, requireAuth, updateCourse);
router.delete(`${basePath}/:id`, requireAuth, deleteCourse);

export default router;
