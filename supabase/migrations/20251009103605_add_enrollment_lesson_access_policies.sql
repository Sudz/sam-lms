/*
  # Add Enrollment-Based Lesson Access Policies

  1. Changes
    - Add policy for enrolled students to view all lessons in their enrolled courses
    - Ensures students who paid for courses can access all content
    - Maintains instructor access to their own course lessons

  2. Security
    - Students can only view lessons from courses they are enrolled in
    - Instructors maintain full access to their own course content
    - Preview lessons remain publicly accessible for published courses
*/

-- Add policy for enrolled students to view lessons
CREATE POLICY "Enrolled students can view course lessons"
  ON course_lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      JOIN enrollments e ON e.course_id = c.id
      WHERE cm.id = course_lessons.module_id
      AND e.user_id = auth.uid()
    )
  );