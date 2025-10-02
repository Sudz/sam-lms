import { Router } from 'express';

const router = Router();

// Placeholder routes for enrollments
router.get('/', (req, res) => {
  res.json({ message: 'Get all enrollments for the current user' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Enroll in a course' });
});

router.get('/:courseId/progress', (req, res) => {
  res.json({ message: `Get progress for course ${req.params.courseId}` });
});

router.put('/:courseId/progress', (req, res) => {
  res.json({ message: `Update progress for course ${req.params.courseId}` });
});

export default router;
