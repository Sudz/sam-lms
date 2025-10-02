import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';

// Get all published courses
export const getAllCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { category, level, search } = req.query;
  
  let query = `
    SELECT c.*, 
           COUNT(DISTINCT e.id) as enrollment_count,
           AVG(CASE WHEN e.progress_percentage IS NOT NULL THEN e.progress_percentage ELSE 0 END) as avg_progress
    FROM courses c
    LEFT JOIN enrollments e ON c.id = e.course_id
    WHERE c.is_published = true
  `;
  
  const params: any[] = [];
  let paramCount = 1;

  if (category) {
    query += ` AND c.category = $${paramCount}`;
    params.push(category);
    paramCount++;
  }

  if (level) {
    query += ` AND c.level = $${paramCount}`;
    params.push(level);
    paramCount++;
  }

  if (search) {
    query += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
    params.push(`%${search}%`);
    paramCount++;
  }

  query += ` GROUP BY c.id ORDER BY c.created_at DESC`;

  const result = await pool.query(query, params);

  res.json({
    success: true,
    data: result.rows,
  });
});

// Get single course with modules and lessons
export const getCourseById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  // Get course details
  const courseResult = await pool.query(
    `SELECT c.*, 
            COUNT(DISTINCT e.id) as enrollment_count
     FROM courses c
     LEFT JOIN enrollments e ON c.id = e.course_id
     WHERE c.id = $1 AND c.is_published = true
     GROUP BY c.id`,
    [id]
  );

  if (courseResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Course not found',
    });
  }

  const course = courseResult.rows[0];

  // Get modules with lessons
  const modulesResult = await pool.query(
    `SELECT cm.*, 
            json_agg(
              json_build_object(
                'id', cl.id,
                'title', cl.title,
                'content', cl.content,
                'video_url', cl.video_url,
                'duration_minutes', cl.duration_minutes,
                'order_index', cl.order_index,
                'is_preview', cl.is_preview
              ) ORDER BY cl.order_index
            ) as lessons
     FROM course_modules cm
     LEFT JOIN course_lessons cl ON cm.id = cl.module_id
     WHERE cm.course_id = $1
     GROUP BY cm.id
     ORDER BY cm.order_index`,
    [id]
  );

  course.modules = modulesResult.rows;

  // Check if user is enrolled
  if (userId) {
    const enrollmentResult = await pool.query(
      `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
      [userId, id]
    );
    course.is_enrolled = enrollmentResult.rows.length > 0;
    course.enrollment = enrollmentResult.rows[0] || null;
  }

  res.json({
    success: true,
    data: course,
  });
});

// Create a new course (instructor only)
export const createCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const {
    title,
    description,
    price,
    currency,
    thumbnail_url,
    video_url,
    duration_minutes,
    level,
    category,
  } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await pool.query(
    `INSERT INTO courses (
      title, description, instructor_id, price, currency, 
      thumbnail_url, video_url, duration_minutes, level, category
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [title, description, userId, price, currency, thumbnail_url, video_url, duration_minutes, level, category]
  );

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: result.rows[0],
  });
});

// Update course
export const updateCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const {
    title,
    description,
    price,
    currency,
    thumbnail_url,
    video_url,
    duration_minutes,
    level,
    category,
    is_published,
  } = req.body;

  // Check if user is the instructor
  const courseCheck = await pool.query(
    `SELECT * FROM courses WHERE id = $1 AND instructor_id = $2`,
    [id, userId]
  );

  if (courseCheck.rows.length === 0) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to update this course',
    });
  }

  const result = await pool.query(
    `UPDATE courses SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      price = COALESCE($3, price),
      currency = COALESCE($4, currency),
      thumbnail_url = COALESCE($5, thumbnail_url),
      video_url = COALESCE($6, video_url),
      duration_minutes = COALESCE($7, duration_minutes),
      level = COALESCE($8, level),
      category = COALESCE($9, category),
      is_published = COALESCE($10, is_published),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $11
    RETURNING *`,
    [title, description, price, currency, thumbnail_url, video_url, duration_minutes, level, category, is_published, id]
  );

  res.json({
    success: true,
    message: 'Course updated successfully',
    data: result.rows[0],
  });
});

// Delete course
export const deleteCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  // Check if user is the instructor
  const courseCheck = await pool.query(
    `SELECT * FROM courses WHERE id = $1 AND instructor_id = $2`,
    [id, userId]
  );

  if (courseCheck.rows.length === 0) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to delete this course',
    });
  }

  await pool.query(`DELETE FROM courses WHERE id = $1`, [id]);

  res.json({
    success: true,
    message: 'Course deleted successfully',
  });
});
