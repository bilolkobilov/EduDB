"""
Data Models and Business Logic
"""

from backend.database import Database
import json
from datetime import datetime, date
import secrets


class Student:
    """Student model"""
    
    @staticmethod
    def get_all():
        """Get all students"""
        return Database.get_table_data('students')
    
    @staticmethod
    def get_by_id(student_id):
        """Get student by ID"""
        query = "SELECT * FROM students WHERE id = %s"
        return Database.execute_query(query, (student_id,))
    
    @staticmethod
    def create(data):
        """Create a new student"""
        return Database.insert_record('students', data)
    
    @staticmethod
    def update(student_id, data):
        """Update a student"""
        return Database.update_record('students', student_id, data)
    
    @staticmethod
    def delete(student_id):
        """Delete a student"""
        return Database.delete_record('students', student_id)


class Teacher:
    """Teacher model"""
    
    @staticmethod
    def get_all():
        """Get all teachers"""
        return Database.get_table_data('teachers')
    
    @staticmethod
    def get_by_id(teacher_id):
        """Get teacher by ID"""
        query = "SELECT * FROM teachers WHERE id = %s"
        return Database.execute_query(query, (teacher_id,))
    
    @staticmethod
    def create(data):
        """Create a new teacher"""
        return Database.insert_record('teachers', data)
    
    @staticmethod
    def update(teacher_id, data):
        """Update a teacher"""
        return Database.update_record('teachers', teacher_id, data)
    
    @staticmethod
    def delete(teacher_id):
        """Delete a teacher"""
        return Database.delete_record('teachers', teacher_id)


class Course:
    """Course model"""
    
    @staticmethod
    def get_all():
        """Get all courses"""
        return Database.get_table_data('courses')
    
    @staticmethod
    def get_by_id(course_id):
        """Get course by ID"""
        query = "SELECT * FROM courses WHERE id = %s"
        return Database.execute_query(query, (course_id,))
    
    @staticmethod
    def create(data):
        """Create a new course"""
        return Database.insert_record('courses', data)
    
    @staticmethod
    def update(course_id, data):
        """Update a course"""
        return Database.update_record('courses', course_id, data)
    
    @staticmethod
    def delete(course_id):
        """Delete a course"""
        return Database.delete_record('courses', course_id)
    
    @staticmethod
    def get_with_teacher():
        """Get all courses with teacher information"""
        query = """
            SELECT c.*, t.name as teacher_name 
            FROM courses c 
            LEFT JOIN teachers t ON c.teacher_id = t.id
        """
        return Database.execute_query(query)


class Enrollment:
    """Enrollment model"""
    
    @staticmethod
    def get_all():
        """Get all enrollments"""
        return Database.get_table_data('enrollments')
    
    @staticmethod
    def get_by_id(enrollment_id):
        """Get enrollment by ID"""
        query = "SELECT * FROM enrollments WHERE id = %s"
        return Database.execute_query(query, (enrollment_id,))
    
    @staticmethod
    def create(data):
        """Create a new enrollment"""
        return Database.insert_record('enrollments', data)
    
    @staticmethod
    def update(enrollment_id, data):
        """Update an enrollment"""
        return Database.update_record('enrollments', enrollment_id, data)
    
    @staticmethod
    def delete(enrollment_id):
        """Delete an enrollment"""
        return Database.delete_record('enrollments', enrollment_id)
    
    @staticmethod
    def get_detailed():
        """Get enrollments with student and course details"""
        query = """
            SELECT 
                e.*,
                s.name as student_name,
                c.course_name,
                t.name as teacher_name
            FROM enrollments e
            JOIN students s ON e.student_id = s.id
            JOIN courses c ON e.course_id = c.id
            JOIN teachers t ON c.teacher_id = t.id
        """
        return Database.execute_query(query)


class Progress:
    """User progress tracking"""
    
    @staticmethod
    def get_progress():
        """Get user progress"""
        query = "SELECT * FROM user_progress LIMIT 1"
        success, result = Database.execute_query(query)
        if success and result:
            return True, result[0]
        return False, "No progress found"
    
    @staticmethod
    def update_progress(data):
        """Update user progress"""
        query = """
            UPDATE user_progress 
            SET module_completed = %s,
                beginner_score = %s,
                intermediate_score = %s,
                advanced_score = %s,
                beginner_answers = %s,
                intermediate_answers = %s,
                advanced_answers = %s,
                total_time_spent = %s
            WHERE id = 1
        """
        params = (
            data.get('module_completed', 0),
            data.get('beginner_score', 0),
            data.get('intermediate_score', 0),
            data.get('advanced_score', 0),
            json.dumps(data.get('beginner_answers', {})),
            json.dumps(data.get('intermediate_answers', {})),
            json.dumps(data.get('advanced_answers', {})),
            data.get('total_time_spent', 0)
        )
        return Database.execute_query(query, params, fetch=False)
    
    @staticmethod
    def reset_progress():
        """Reset user progress"""
        query = """
            UPDATE user_progress 
            SET module_completed = 0,
                beginner_score = 0,
                intermediate_score = 0,
                advanced_score = 0,
                beginner_answers = NULL,
                intermediate_answers = NULL,
                advanced_answers = NULL,
                total_time_spent = 0
            WHERE id = 1
        """
        return Database.execute_query(query, fetch=False)


class Certificate:
    """Certificate management"""
    
    @staticmethod
    def generate_certificate_id():
        """Generate unique certificate ID"""
        year = datetime.now().year
        random_part = secrets.token_hex(3).upper()
        return f"EDB-{year}-{random_part}"
    
    @staticmethod
    def create(data):
        """Create a new certificate"""
        cert_id = Certificate.generate_certificate_id()
        
        # Convert date objects to strings if needed
        issue_date = data.get('issue_date')
        if isinstance(issue_date, date):
            issue_date = issue_date.strftime('%Y-%m-%d')
        elif issue_date is None:
            issue_date = datetime.now().strftime('%Y-%m-%d')
        
        query = """
            INSERT INTO certificates 
            (certificate_id, student_name, issue_date, beginner_score, 
             intermediate_score, advanced_score, overall_score, total_time)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            cert_id,
            data.get('student_name'),
            issue_date,
            data.get('beginner_score', 0),
            data.get('intermediate_score', 0),
            data.get('advanced_score', 0),
            data.get('overall_score', 0.0),
            data.get('total_time', 0)
        )
        
        success, result = Database.execute_query(query, params, fetch=False)
        if success:
            return True, {'certificate_id': cert_id}
        return False, result
    
    @staticmethod
    def get_by_id(certificate_id):
        """Get certificate by ID"""
        query = "SELECT * FROM certificates WHERE certificate_id = %s"
        return Database.execute_query(query, (certificate_id,))
    
    @staticmethod
    def get_all():
        """Get all certificates"""
        query = "SELECT * FROM certificates ORDER BY created_at DESC"
        return Database.execute_query(query)
