-- Reset database to original sample data
USE edudb;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Clear all data from tables
TRUNCATE TABLE enrollments;
TRUNCATE TABLE courses;
TRUNCATE TABLE teachers;
TRUNCATE TABLE students;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Reinsert sample data into students table
INSERT INTO students (name, email, enrollment_date, grade_level) VALUES
('John Smith', 'john@email.com', '2024-01-15', 10),
('Sara Wilson', 'sara@email.com', '2024-01-16', 11),
('Mike Johnson', 'mike@email.com', '2024-01-17', 10),
('Emily Brown', 'emily@email.com', '2024-01-18', 12),
('David Lee', 'david@email.com', '2024-01-19', 11);

-- Reinsert sample data into teachers table
INSERT INTO teachers (name, email, department, hire_date) VALUES
('Robert Taylor', 'robert@email.com', 'Mathematics', '2020-08-01'),
('Lisa Anderson', 'lisa@email.com', 'Science', '2019-09-01'),
('James Wilson', 'james@email.com', 'English', '2021-07-01'),
('Maria Garcia', 'maria@email.com', 'History', '2018-06-01');

-- Reinsert sample data into courses table
INSERT INTO courses (course_name, teacher_id, credits, semester) VALUES
('Algebra I', 1, 3, 'Fall 2024'),
('Biology', 2, 4, 'Fall 2024'),
('English Literature', 3, 3, 'Fall 2024'),
('World History', 4, 3, 'Spring 2025'),
('Geometry', 1, 3, 'Spring 2025'),
('Chemistry', 2, 4, 'Spring 2025');

-- Reinsert sample data into enrollments table
INSERT INTO enrollments (student_id, course_id, enrollment_date, grade) VALUES
(1, 1, '2024-01-20', 85.5),
(1, 2, '2024-01-20', 90.0),
(2, 1, '2024-01-21', 78.5),
(2, 3, '2024-01-21', 88.0),
(3, 2, '2024-01-22', 92.5),
(3, 4, '2024-01-22', NULL),
(4, 3, '2024-01-23', 95.0),
(4, 5, '2024-01-23', 87.5),
(5, 1, '2024-01-24', 82.0),
(5, 6, '2024-01-24', 89.5);

-- Display success message
SELECT 'Database reset to original sample data successfully!' AS Status;
