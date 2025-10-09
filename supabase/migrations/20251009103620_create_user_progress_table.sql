/*
  # Create User Progress Table

  1. New Table
    - `user_progress` - Tracks user progress through lessons
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References auth.users
      - `lesson_id` (uuid) - References course_lessons
      - `is_completed` (boolean)
      - `completed_at`, `last_accessed_at` (timestamp)
      - Unique constraint on (user_id, lesson_id)

  2. Security
    - Enable RLS
    - Add policies for users to manage their own progress
*/

-- User Progress
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);