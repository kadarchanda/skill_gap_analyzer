/*
# Student Skills Gap Analyzer — Schema & Seed Data

1. Purpose
   A full-stack app where students self-evaluate their technical skills, pick a target
   job role, and get a gap analysis (Target - Current) with categorized gaps (High/Medium/Low)
   and ranked learning resource recommendations.

2. New Tables
   - `job_roles`: Predefined industry benchmark roles (Web Developer, Data Analyst, Software Engineer)
     with target proficiency levels per skill on a 0-100 scale.
   - `student_profiles`: A student's self-evaluation scores and selected target role.
   - `learning_resources`: Ranked learning resources (courses, docs, tutorials, practice tasks)
     tagged by skill and resource type.

3. Columns
   job_roles:
     - id (uuid PK)
     - name (text, unique) — e.g. "Web Developer"
     - description (text)
     - benchmarks (jsonb) — { "Python": 60, "SQL": 50, "REST APIs": 80, ... }
     - icon (text) — lucide icon name for the role
     - created_at (timestamptz)

   student_profiles:
     - id (uuid PK)
     - name (text) — student display name
     - target_role_id (uuid FK → job_roles)
     - skills (jsonb) — { "Python": 45, "SQL": 30, ... }
     - created_at (timestamptz)
     - updated_at (timestamptz)

   learning_resources:
     - id (uuid PK)
     - skill (text) — which skill this resource helps (e.g. "Python")
     - title (text)
     - url (text)
     - type (text) — 'course' | 'documentation' | 'tutorial' | 'practice'
     - source (text) — e.g. "freeCodeCamp", "MDN", "LeetCode"
     - is_free (boolean, default true)
     - rating (numeric, 0-5) — quality/recommendation ranking
     - created_at (timestamptz)

4. Security
   - This is a single-tenant app with no sign-in screen. All policies use
     `TO anon, authenticated` so the anon-key frontend can read and write.
   - RLS enabled on all tables.
   - SELECT/INSERT/UPDATE/DELETE policies per table (4 each, no FOR ALL).

5. Seed Data
   - 3 job roles with benchmark skill levels.
   - 1 sample student profile.
   - ~24 learning resources across 5 skills (Python, SQL, REST APIs, React, Data Structures).
*/

-- =========================================================
-- job_roles
-- =========================================================
CREATE TABLE IF NOT EXISTS job_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  benchmarks jsonb NOT NULL DEFAULT '{}',
  icon text NOT NULL DEFAULT 'Code2',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE job_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_job_roles" ON job_roles;
CREATE POLICY "anon_select_job_roles" ON job_roles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_job_roles" ON job_roles;
CREATE POLICY "anon_insert_job_roles" ON job_roles FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_job_roles" ON job_roles;
CREATE POLICY "anon_update_job_roles" ON job_roles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_job_roles" ON job_roles;
CREATE POLICY "anon_delete_job_roles" ON job_roles FOR DELETE
  TO anon, authenticated USING (true);

-- =========================================================
-- student_profiles
-- =========================================================
CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Student',
  target_role_id uuid REFERENCES job_roles(id) ON DELETE SET NULL,
  skills jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_student_profiles" ON student_profiles;
CREATE POLICY "anon_select_student_profiles" ON student_profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_student_profiles" ON student_profiles;
CREATE POLICY "anon_insert_student_profiles" ON student_profiles FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_student_profiles" ON student_profiles;
CREATE POLICY "anon_update_student_profiles" ON student_profiles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_student_profiles" ON student_profiles;
CREATE POLICY "anon_delete_student_profiles" ON student_profiles FOR DELETE
  TO anon, authenticated USING (true);

-- =========================================================
-- learning_resources
-- =========================================================
CREATE TABLE IF NOT EXISTS learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill text NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  type text NOT NULL DEFAULT 'course',
  source text NOT NULL DEFAULT '',
  is_free boolean NOT NULL DEFAULT true,
  rating numeric NOT NULL DEFAULT 3.0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_learning_resources" ON learning_resources;
CREATE POLICY "anon_select_learning_resources" ON learning_resources FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_learning_resources" ON learning_resources;
CREATE POLICY "anon_insert_learning_resources" ON learning_resources FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_learning_resources" ON learning_resources;
CREATE POLICY "anon_update_learning_resources" ON learning_resources FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_learning_resources" ON learning_resources;
CREATE POLICY "anon_delete_learning_resources" ON learning_resources FOR DELETE
  TO anon, authenticated USING (true);

-- =========================================================
-- Seed: Job Roles
-- =========================================================
INSERT INTO job_roles (name, description, icon, benchmarks) VALUES
(
  'Web Developer',
  'Builds responsive, interactive web applications using modern frontend frameworks and backend APIs.',
  'Code2',
  '{"Python": 55, "SQL": 45, "REST APIs": 80, "React": 85, "Data Structures": 55}'::jsonb
),
(
  'Data Analyst',
  'Analyzes datasets, builds dashboards, and extracts insights using SQL, Python, and statistics.',
  'BarChart3',
  '{"Python": 80, "SQL": 85, "REST APIs": 50, "React": 40, "Data Structures": 60}'::jsonb
),
(
  'Software Engineer',
  'Designs and builds robust systems with strong fundamentals in algorithms, APIs, and databases.',
  'Cpu',
  '{"Python": 75, "SQL": 70, "REST APIs": 75, "React": 60, "Data Structures": 90}'::jsonb
)
ON CONFLICT (name) DO NOTHING;

-- =========================================================
-- Seed: Sample Student Profile
-- =========================================================
INSERT INTO student_profiles (name, target_role_id, skills)
SELECT 'Alex Johnson', id, '{"Python": 50, "SQL": 35, "REST APIs": 40, "React": 30, "Data Structures": 45}'::jsonb
FROM job_roles WHERE name = 'Web Developer'
ON CONFLICT DO NOTHING;

-- =========================================================
-- Seed: Learning Resources
-- =========================================================
INSERT INTO learning_resources (skill, title, url, type, source, is_free, rating) VALUES
-- Python
('Python', 'Python for Everybody — Full Course', 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', 'course', 'freeCodeCamp', true, 4.8),
('Python', 'Official Python Documentation', 'https://docs.python.org/3/', 'documentation', 'Python.org', true, 4.7),
('Python', 'Real Python Tutorials', 'https://realpython.com/', 'tutorial', 'Real Python', true, 4.9),
('Python', 'HackerRank Python Practice', 'https://www.hackerrank.com/domains/python', 'practice', 'HackerRank', true, 4.5),
('Python', 'Automate the Boring Stuff with Python', 'https://automatetheboringstuff.com/', 'course', 'ATBS', true, 4.8),
-- SQL
('SQL', 'SQL for Data Science — Free Course', 'https://www.coursera.org/learn/sql-for-data-science', 'course', 'Coursera', true, 4.6),
('SQL', 'PostgreSQL Official Documentation', 'https://www.postgresql.org/docs/', 'documentation', 'PostgreSQL', true, 4.5),
('SQL', 'SQLZoo Interactive Tutorial', 'https://sqlzoo.net/', 'tutorial', 'SQLZoo', true, 4.4),
('SQL', 'LeetCode Database Problems', 'https://leetcode.com/studyplan/top-sql-50/', 'practice', 'LeetCode', true, 4.7),
('SQL', 'Mode SQL Tutorial', 'https://mode.com/sql/tutorial/', 'tutorial', 'Mode', true, 4.5),
-- REST APIs
('REST APIs', 'REST API Tutorial', 'https://restfulapi.net/', 'tutorial', 'RESTful API', true, 4.5),
('REST APIs', 'MDN — HTTP Overview', 'https://developer.mozilla.org/en-US/docs/Web/HTTP', 'documentation', 'MDN', true, 4.7),
('REST APIs', 'Postman API Testing Course', 'https://www.postman.com/api-platform/api-101/', 'course', 'Postman', true, 4.6),
('REST APIs', 'Build a REST API with Node.js', 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', 'course', 'freeCodeCamp', true, 4.7),
('REST APIs', 'JSONPlaceholder Practice API', 'https://jsonplaceholder.typicode.com/', 'practice', 'JSONPlaceholder', true, 4.3),
-- React
('React', 'React Official Docs — Quick Start', 'https://react.dev/learn', 'documentation', 'React', true, 4.9),
('React', 'FreeCodeCamp React Course', 'https://www.freecodecamp.org/learn/front-end-development-libraries/', 'course', 'freeCodeCamp', true, 4.7),
('React', 'Joy of React — Interactive Tutorial', 'https://www.joyofreact.com/', 'tutorial', 'Josh Comeau', false, 4.8),
('React', 'React Router Documentation', 'https://reactrouter.com/', 'documentation', 'React Router', true, 4.5),
('React', 'Frontend Mentor Challenges', 'https://www.frontendmentor.io/', 'practice', 'Frontend Mentor', true, 4.6),
-- Data Structures
('Data Structures', 'freeCodeCamp Data Structures Course', 'https://www.freecodecamp.org/learn/coding-interview-prep/', 'course', 'freeCodeCamp', true, 4.7),
('Data Structures', 'Visualgo — Visual Data Structure Tool', 'https://visualgo.net/', 'tutorial', 'Visualgo', true, 4.8),
('Data Structures', 'LeetCode DSA Study Plan', 'https://leetcode.com/studyplan/leetcode-75/', 'practice', 'LeetCode', true, 4.9),
('Data Structures', 'Big-O Cheat Sheet', 'https://www.bigocheatsheet.com/', 'documentation', 'Big-O', true, 4.6),
('Data Structures', 'GeeksforGeeks DSA Tutorials', 'https://www.geeksforgeeks.org/data-structures/', 'tutorial', 'GeeksforGeeks', true, 4.5)
ON CONFLICT DO NOTHING;
