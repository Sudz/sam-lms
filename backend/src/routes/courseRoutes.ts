import { Router } from 'express';

const router = Router();

// Placeholder routes for courses
router.get('/', (req, res) => {
  res.json({ message: 'Get all courses' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get course with id ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create a new course' });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update course with id ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete course with id ${req.params.id}` });
});

export default router;
