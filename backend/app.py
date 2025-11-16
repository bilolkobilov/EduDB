"""
EduDB Flask Application
Main application file with all routes
"""

from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import logging
import json
from pathlib import Path

from config.config import Config
from backend.database import Database
from backend.models import Student, Teacher, Course, Enrollment, Progress, Certificate

# Initialize Flask app
app = Flask(__name__, 
            static_folder='../frontend/static',
            template_folder='../frontend/pages')
app.config.from_object(Config)

# Enable CORS
CORS(app)

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Do NOT initialize database pool on startup
# It will be initialized lazily when first needed


# ========== Page Routes ==========

@app.route('/')
def home():
    """Serve home page"""
    try:
        with open(Config.PAGES_DIR / 'home.html', 'r', encoding='utf-8') as f:
            content = f.read()
            logger.info("Application started successfully. Database will be initialized through Setup page.")
            return content
    except FileNotFoundError:
        return "Home page not found", 404


@app.route('/setup')
@app.route('/setup/')
def setup():
    """Serve setup page"""
    try:
        with open(Config.PAGES_DIR / 'setup.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Setup page not found", 404


@app.route('/studio')
@app.route('/studio/')
def studio():
    """Serve studio page"""
    try:
        with open(Config.PAGES_DIR / 'studio.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Studio page not found", 404


@app.route('/exercises')
@app.route('/exercises/')
def exercises():
    """Serve exercises page"""
    try:
        with open(Config.PAGES_DIR / 'exercises.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Exercises page not found", 404


# ========== API Routes - Database Operations ==========

@app.route('/api/test-connection', methods=['POST'])
def test_connection():
    """Test database connection"""
    data = request.json
    host = data.get('host', 'localhost')
    user = data.get('user', 'root')
    password = data.get('password', '')
    port = data.get('port', 3306)
    
    success, message = Database.test_connection(host, user, password, port)
    
    return jsonify({
        'success': success,
        'message': message
    })


@app.route('/api/check-database-status', methods=['GET'])
def check_database_status():
    """Check if edudb database exists and is accessible"""
    try:
        # Try to get tables - if successful, database is connected
        success, result = Database.get_all_tables()
        
        if success and result:
            return jsonify({
                'success': True,
                'connected': True,
                'message': 'Database is connected and ready',
                'table_count': len(result)
            })
        else:
            return jsonify({
                'success': False,
                'connected': False,
                'message': 'Database not found or not set up'
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'connected': False,
            'message': 'Database not accessible'
        })


@app.route('/api/create-database', methods=['POST'])
def create_database():
    """Create database with all tables and sample data"""
    data = request.json
    host = data.get('host', 'localhost')
    user = data.get('user', 'root')
    password = data.get('password', '')
    port = data.get('port', 3306)
    
    success, message = Database.create_database(host, user, password, port)
    
    return jsonify({
        'success': success,
        'message': message
    })


@app.route('/api/tables', methods=['GET'])
def get_tables():
    """Get list of all tables"""
    success, result = Database.get_all_tables()
    
    if success:
        return jsonify({
            'success': True,
            'tables': result
        })
    return jsonify({
        'success': False,
        'error': result
    }), 500


@app.route('/api/tables/<table_name>', methods=['GET'])
def get_table_data(table_name):
    """Get all records from a specific table"""
    success, result = Database.get_table_data(table_name)
    
    if success:
        # Result is a dict with 'data' and 'total' keys
        data = result.get('data', []) if isinstance(result, dict) else result
        
        # Convert date objects to strings
        for record in data:
            for key, value in record.items():
                if hasattr(value, 'isoformat'):
                    record[key] = value.isoformat()
        
        return jsonify({
            'success': True,
            'data': data,
            'total': result.get('total', len(data)) if isinstance(result, dict) else len(data)
        })
    
    # Check if it's a database not available error
    if isinstance(result, str) and 'not available' in result.lower():
        return jsonify({
            'success': False,
            'error': result,
            'database_missing': True
        }), 503  # Service Unavailable
    
    return jsonify({
        'success': False,
        'error': result
    }), 400


@app.route('/api/tables/<table_name>', methods=['POST'])
def insert_record(table_name):
    """Insert a new record"""
    data = request.json
    success, result = Database.insert_record(table_name, data)
    
    if success:
        return jsonify({
            'success': True,
            'message': 'Record inserted successfully',
            'id': result.get('last_id')
        })
    return jsonify({
        'success': False,
        'error': result
    }), 400


@app.route('/api/tables/<table_name>/<int:record_id>', methods=['PUT'])
def update_record(table_name, record_id):
    """Update a record"""
    data = request.json
    success, result = Database.update_record(table_name, record_id, data)
    
    if success:
        return jsonify({
            'success': True,
            'message': 'Record updated successfully',
            'affected_rows': result.get('affected_rows')
        })
    return jsonify({
        'success': False,
        'error': result
    }), 400


@app.route('/api/tables/<table_name>/<int:record_id>', methods=['DELETE'])
def delete_record(table_name, record_id):
    """Delete a record"""
    success, result = Database.delete_record(table_name, record_id)
    
    if success:
        return jsonify({
            'success': True,
            'message': 'Record deleted successfully'
        })
    return jsonify({
        'success': False,
        'error': result
    }), 400


@app.route('/api/reset-database', methods=['POST'])
def reset_database():
    """Reset database to original sample data"""
    success, message = Database.reset_database()
    
    return jsonify({
        'success': success,
        'message': message
    })


# ========== API Routes - Progress Tracking ==========

@app.route('/api/progress', methods=['GET'])
def get_progress():
    """Get user progress"""
    success, result = Progress.get_progress()
    
    if success:
        # Parse JSON fields
        if result.get('beginner_answers'):
            try:
                result['beginner_answers'] = json.loads(result['beginner_answers'])
            except:
                result['beginner_answers'] = {}
        
        if result.get('intermediate_answers'):
            try:
                result['intermediate_answers'] = json.loads(result['intermediate_answers'])
            except:
                result['intermediate_answers'] = {}
        
        if result.get('advanced_answers'):
            try:
                result['advanced_answers'] = json.loads(result['advanced_answers'])
            except:
                result['advanced_answers'] = {}
        
        return jsonify({
            'success': True,
            'progress': result
        })
    return jsonify({
        'success': False,
        'error': result
    }), 500


@app.route('/api/progress', methods=['POST'])
def save_progress():
    """Save user progress"""
    data = request.json
    success, result = Progress.update_progress(data)
    
    if success:
        return jsonify({
            'success': True,
            'message': 'Progress saved successfully'
        })
    return jsonify({
        'success': False,
        'error': result
    }), 400


@app.route('/api/progress/reset', methods=['POST'])
def reset_progress():
    """Reset user progress"""
    success, result = Progress.reset_progress()
    
    return jsonify({
        'success': success,
        'message': 'Progress reset successfully' if success else result
    })


# ========== API Routes - Certificates ==========

@app.route('/api/certificate/generate', methods=['POST'])
def generate_certificate():
    """Generate a new certificate"""
    data = request.json
    
    # Validate required fields
    if not data.get('student_name'):
        return jsonify({
            'success': False,
            'error': 'Student name is required'
        }), 400
    
    # Calculate overall score
    beginner = data.get('beginner_score', 0)
    intermediate = data.get('intermediate_score', 0)
    advanced = data.get('advanced_score', 0)
    overall = round((beginner + intermediate + advanced) / 45 * 100, 2)
    
    data['overall_score'] = overall
    
    success, result = Certificate.create(data)
    
    if success:
        return jsonify({
            'success': True,
            'certificate_id': result['certificate_id'],
            'message': 'Certificate generated successfully'
        })
    return jsonify({
        'success': False,
        'error': result
    }), 400


@app.route('/api/certificate/<certificate_id>', methods=['GET'])
def get_certificate(certificate_id):
    """Get certificate by ID"""
    success, result = Certificate.get_by_id(certificate_id)
    
    if success and result:
        certificate = result[0]
        # Convert date objects to strings
        if hasattr(certificate.get('issue_date'), 'isoformat'):
            certificate['issue_date'] = certificate['issue_date'].isoformat()
        
        return jsonify({
            'success': True,
            'certificate': certificate
        })
    return jsonify({
        'success': False,
        'error': 'Certificate not found'
    }), 404


@app.route('/api/certificates', methods=['GET'])
def get_all_certificates():
    """Get all certificates"""
    success, result = Certificate.get_all()
    
    if success:
        # Convert date objects to strings
        for cert in result:
            if hasattr(cert.get('issue_date'), 'isoformat'):
                cert['issue_date'] = cert['issue_date'].isoformat()
            if hasattr(cert.get('created_at'), 'isoformat'):
                cert['created_at'] = cert['created_at'].isoformat()
        
        return jsonify({
            'success': True,
            'certificates': result
        })
    return jsonify({
        'success': False,
        'error': result
    }), 500


# ========== API Routes - Module Operations ==========

@app.route('/api/execute-query', methods=['POST'])
def execute_query():
    """Execute a custom SQL query (for Studio demonstrations)"""
    data = request.json
    query = data.get('query', '')
    params = data.get('params', [])
    
    # Basic validation - only allow SELECT queries for safety
    query_upper = query.strip().upper()
    if not query_upper.startswith('SELECT'):
        return jsonify({
            'success': False,
            'error': 'Only SELECT queries are allowed through this endpoint'
        }), 400
    
    success, result = Database.execute_query(query, tuple(params) if params else None)
    
    if success:
        # Convert date objects to strings
        for record in result:
            for key, value in record.items():
                if hasattr(value, 'isoformat'):
                    record[key] = value.isoformat()
        
        return jsonify({
            'success': True,
            'data': result
        })
    return jsonify({
        'success': False,
        'error': result
    }), 400


# ========== Error Handlers ==========

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Resource not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({
        'success': False,
        'error': 'Internal server error occurred'
    }), 500


@app.errorhandler(Exception)
def handle_exception(e):
    """Handle all unhandled exceptions"""
    logger.error(f"Unhandled exception: {str(e)}")
    return jsonify({
        'success': False,
        'error': 'An unexpected error occurred'
    }), 500


# ========== Application Entry Point ==========

if __name__ == '__main__':
    logger.info(f"Starting EduDB server on {Config.HOST}:{Config.PORT}")
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
