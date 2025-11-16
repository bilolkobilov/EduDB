-- EduDB Database Initialization Script
-- Creates edudb database with all tables and sample data

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS edudb;
USE edudb;

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;

-- Create students table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    enrollment_date DATE NOT NULL,
    grade_level INT NOT NULL,
    CHECK (grade_level BETWEEN 9 AND 12)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create teachers table
CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create courses table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    teacher_id INT,
    credits INT NOT NULL,
    semester VARCHAR(20) NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create enrollments table
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    enrollment_date DATE NOT NULL,
    grade DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data into students table
INSERT INTO students (name, email, enrollment_date, grade_level) VALUES
('John Smith', 'john@email.com', '2024-01-15', 10),
('Sara Wilson', 'sara@email.com', '2024-01-16', 11),
('Mike Johnson', 'mike@email.com', '2024-01-17', 10),
('Emily Brown', 'emily@email.com', '2024-01-18', 12),
('David Lee', 'david@email.com', '2024-01-19', 11);

-- Insert sample data into teachers table
INSERT INTO teachers (name, email, department, hire_date) VALUES
('Robert Taylor', 'robert@email.com', 'Mathematics', '2020-08-01'),
('Lisa Anderson', 'lisa@email.com', 'Science', '2019-09-01'),
('James Wilson', 'james@email.com', 'English', '2021-07-01'),
('Maria Garcia', 'maria@email.com', 'History', '2018-06-01');

-- Insert sample data into courses table
INSERT INTO courses (course_name, teacher_id, credits, semester) VALUES
('Algebra I', 1, 3, 'Fall 2024'),
('Biology', 2, 4, 'Fall 2024'),
('English Literature', 3, 3, 'Fall 2024'),
('World History', 4, 3, 'Spring 2025'),
('Geometry', 1, 3, 'Spring 2025'),
('Chemistry', 2, 4, 'Spring 2025');

-- Insert sample data into enrollments table
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

-- Create indexes for better performance
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_grade ON students(grade_level);
CREATE INDEX idx_teachers_department ON teachers(department);
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_semester ON courses(semester);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- Display success message
SELECT 'Database edudb created successfully!' AS Status;
SELECT 'All tables created and populated with sample data.' AS Info;
