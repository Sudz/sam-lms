/*
  # Create LMS Tables

  1. New Tables
    - `user_profiles` - User profile information
    - `courses` - Course catalog
    - `course_modules` - Course modules
    - `course_lessons` - Individual lessons
    - `enrollments` - User enrollments
    - `payments` - Payment records
    - `notifications` - Notification history

  2. Security
    - Enable RLS on all tables
    - Add restrictive policies for data access
*/

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    country_code VARCHAR(10),
    bio TEXT,
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'ZAR',
    thumbnail_url VARCHAR(500),
    video_url VARCHAR(500),
    duration_minutes INT,
    level VARCHAR(50),
    category VARCHAR(100),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Instructors can view own courses"
  ON courses FOR SELECT
  TO authenticated
  USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can insert courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can update own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (auth.uid() = instructor_id)
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can delete own courses"
  ON courses FOR DELETE
  TO authenticated
  USING (auth.uid() = instructor_id);

-- Course Modules
CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules of published courses"
  ON course_modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND courses.is_published = true
    )
  );

CREATE POLICY "Instructors can manage own course modules"
  ON course_modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND courses.instructor_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- Course Lessons
CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url VARCHAR(500),
    duration_minutes INT,
    order_index INT NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view preview lessons"
  ON course_lessons FOR SELECT
  USING (
    is_preview = true AND
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = course_lessons.module_id
      AND c.is_published = true
    )
  );

CREATE POLICY "Instructors can manage own course lessons"
  ON course_lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = course_lessons.module_id
      AND c.instructor_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = course_lessons.module_id
      AND c.instructor_id = auth.uid()
    )
  );

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    progress_percentage DECIMAL(5, 2) DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    paystack_reference VARCHAR(255) UNIQUE,
    paystack_transaction_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_course_id ON payments(course_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);