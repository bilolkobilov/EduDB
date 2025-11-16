-- Application-specific tables for progress tracking and certificates
USE edudb;

-- Drop tables if they exist
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS user_progress;

-- User progress table
CREATE TABLE user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_completed INT DEFAULT 0,
    beginner_score INT DEFAULT 0,
    intermediate_score INT DEFAULT 0,
    advanced_score INT DEFAULT 0,
    beginner_answers JSON,
    intermediate_answers JSON,
    advanced_answers JSON,
    total_time_spent INT DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Certificates table
CREATE TABLE certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    certificate_id VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    beginner_score INT NOT NULL,
    intermediate_score INT NOT NULL,
    advanced_score INT NOT NULL,
    overall_score DECIMAL(5,2) NOT NULL,
    total_time INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initialize user progress with a default record
INSERT INTO user_progress (module_completed, beginner_score, intermediate_score, advanced_score, total_time_spent) 
VALUES (0, 0, 0, 0, 0);

-- Display success message
SELECT 'Application tables created successfully!' AS Status;
