import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';

// Get all enrollments for the current user
export const getUserEnrollments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await pool.query(
    `SELECT e.*, 
            c.title as course_title,
            c.description as course_description,
            c.thumbnail_url,
            c.duration_minutes,
            c.level,
            c.category
     FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     WHERE e.user_id = $1
     ORDER BY e.enrolled_at DESC`,
    [userId]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// Enroll in a course
export const enrollInCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { course_id } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  // Check if course exists
  const courseCheck = await pool.query(
    `SELECT * FROM courses WHERE id = $1 AND is_published = true`,
    [course_id]
  );

  if (courseCheck.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Course not found or not published',
    });
  }

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

  const result = await pool.query(
    `INSERT INTO enrollments (user_id, course_id)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, course_id]
  );

  res.status(201).json({
    success: true,
    message: 'Successfully enrolled in course',
    data: result.rows[0],
  });
});

// Get progress for a specific course
export const getCourseProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { courseId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  // Get enrollment
  const enrollmentResult = await pool.query(
    `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );

  if (enrollmentResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Not enrolled in this course',
    });
  }

  // Get detailed progress
  const progressResult = await pool.query(
    `SELECT 
       cm.id as module_id,
       cm.title as module_title,
       cm.order_index as module_order,
       cl.id as lesson_id,
       cl.title as lesson_title,
       cl.order_index as lesson_order,
       cl.duration_minutes,
       COALESCE(up.is_completed, false) as is_completed,
       up.completed_at,
       up.last_accessed_at
     FROM course_modules cm
     JOIN course_lessons cl ON cm.id = cl.module_id
     LEFT JOIN user_progress up ON cl.id = up.lesson_id AND up.user_id = $1
     WHERE cm.course_id = $2
     ORDER BY cm.order_index, cl.order_index`,
    [userId, courseId]
  );

  // Calculate overall progress
  const totalLessons = progressResult.rows.length;
  const completedLessons = progressResult.rows.filter((row: any) => row.is_completed).length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Update enrollment progress
  await pool.query(
    `UPDATE enrollments 
     SET progress_percentage = $1, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2 AND course_id = $3`,
    [progressPercentage, userId, courseId]
  );

  res.json({
    success: true,
    data: {
      enrollment: enrollmentResult.rows[0],
      progress_percentage: progressPercentage,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      lessons: progressResult.rows,
    },
  });
});

// Update progress for a lesson
export const updateLessonProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { courseId } = req.params;
  const { lesson_id, is_completed } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  // Check enrollment
  const enrollmentCheck = await pool.query(
    `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );

  if (enrollmentCheck.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Not enrolled in this course',
    });
  }

  // Update or insert progress
  const result = await pool.query(
    `INSERT INTO user_progress (user_id, lesson_id, is_completed, completed_at, last_accessed_at)
     VALUES ($1, $2, $3, ${is_completed ? 'CURRENT_TIMESTAMP' : 'NULL'}, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, lesson_id)
     DO UPDATE SET
       is_completed = EXCLUDED.is_completed,
       completed_at = ${is_completed ? 'CURRENT_TIMESTAMP' : 'user_progress.completed_at'},
       last_accessed_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, lesson_id, is_completed]
  );

  // Recalculate overall progress
  const progressResult = await pool.query(
    `SELECT COUNT(*) as total,
            SUM(CASE WHEN up.is_completed THEN 1 ELSE 0 END) as completed
     FROM course_lessons cl
     JOIN course_modules cm ON cl.module_id = cm.id
     LEFT JOIN user_progress up ON cl.id = up.lesson_id AND up.user_id = $1
     WHERE cm.course_id = $2`,
    [userId, courseId]
  );

  const { total, completed } = progressResult.rows[0];
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

  // Update enrollment
  await pool.query(
    `UPDATE enrollments 
     SET progress_percentage = $1, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2 AND course_id = $3`,
    [progressPercentage, userId, courseId]
  );

  res.json({
    success: true,
    message: 'Progress updated successfully',
    data: {
      progress: result.rows[0],
      progress_percentage: progressPercentage,
    },
  });
});
