"""
EduDB Configuration
Central configuration file for the application
"""

import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent.parent

class Config:
    """Application configuration"""
    
    # Application Settings
    APP_NAME = "EduDB"
    VERSION = "1.0.0"
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY', 'edudb-secret-key-change-in-production')
    PORT = int(os.getenv('PORT', 5000))
    HOST = os.getenv('HOST', '127.0.0.1')
    
    # Database Settings
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '1234')
    DB_NAME = os.getenv('DB_NAME', 'edudb')
    
    # Database Connection Pool Settings
    DB_POOL_SIZE = 5
    DB_POOL_NAME = 'edudb_pool'
    DB_POOL_RESET_SESSION = True
    
    # Exercise Settings
    PASSING_SCORE = 80  # Minimum percentage to pass each level
    HINTS_PER_QUESTION = 3
    BEGINNER_QUESTIONS = 15
    INTERMEDIATE_QUESTIONS = 15
    ADVANCED_QUESTIONS = 15
    
    # Certificate Settings
    CERTIFICATE_PREFIX = 'EDB'
    CERTIFICATE_YEAR = '2024'
    
    # File Paths
    FRONTEND_DIR = BASE_DIR / 'frontend'
    STATIC_DIR = FRONTEND_DIR / 'static'
    PAGES_DIR = FRONTEND_DIR / 'pages'
    DATABASE_DIR = BASE_DIR / 'database'
    
    # Logging Settings
    LOG_LEVEL = 'INFO'
    LOG_FILE = BASE_DIR / 'edudb.log'
    
    # Session Settings
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = 3600  # 1 hour
    
    @classmethod
    def get_database_config(cls):
        """Returns database configuration dictionary"""
        return {
            'host': cls.DB_HOST,
            'port': cls.DB_PORT,
            'user': cls.DB_USER,
            'password': cls.DB_PASSWORD,
            'database': cls.DB_NAME,
            'charset': 'utf8mb4',
            'collation': 'utf8mb4_unicode_ci',
            'autocommit': False,
            'raise_on_warnings': True
        }
    
    @classmethod
    def get_pool_config(cls):
        """Returns connection pool configuration"""
        return {
            'pool_name': cls.DB_POOL_NAME,
            'pool_size': cls.DB_POOL_SIZE,
            'pool_reset_session': cls.DB_POOL_RESET_SESSION,
            **cls.get_database_config()
        }


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    # In production, these should come from environment variables
    SECRET_KEY = os.getenv('SECRET_KEY')


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    DB_NAME = 'edudb_test'


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config(env='development'):
    """Get configuration based on environment"""
    return config.get(env, config['default'])
