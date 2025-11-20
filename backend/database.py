"""
Database Connection and Operations Module

This module manages MySQL database connections using connection pooling
and provides methods for executing queries and managing the database.
"""

import mysql.connector
from mysql.connector import Error, pooling
from pathlib import Path
import logging
from config.config import Config

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Database:
    """Database connection manager with connection pooling"""
    
    _pool = None
    
    @classmethod
    def initialize_pool(cls):
        """Initialize the connection pool - now with graceful handling if DB doesn't exist"""
        try:
            pool_config = Config.get_pool_config()
            cls._pool = pooling.MySQLConnectionPool(**pool_config)
            logger.info(f"Connection pool created successfully for database: {Config.DB_NAME}")
            return True
        except Error as e:
            logger.error(f"Error creating connection pool: {e}")
            # Don't raise - allow app to start even if DB doesn't exist
            logger.warning("Database not available yet. Use Setup page to create it.")
            return False
        return True
    
    @classmethod
    def get_connection(cls):
        """Get a connection from the pool"""
        if cls._pool is None:
            success = cls.initialize_pool()
            if not success:
                raise Error("Database not available. Please use Setup page to create the database.")
        return cls._pool.get_connection()
    
    @classmethod
    def test_connection(cls, host='localhost', user='root', password='', port=3306):
        """Test database connection with provided credentials"""
        try:
            connection = mysql.connector.connect(
                host=host,
                port=port,
                user=user,
                password=password
            )
            if connection.is_connected():
                connection.close()
                return True, "Connection successful!"
        except Error as e:
            return False, f"Connection failed: {str(e)}"
        return False, "Unknown error occurred"
    
    @classmethod
    def execute_query(cls, query, params=None, fetch_one=False, fetch_all=True):
        """
        Execute a SQL query with parameters
        
        Args:
            query: SQL query string
            params: Query parameters (tuple or dict)
            fetch_one: If True, fetch only one row
            fetch_all: If True, fetch all rows (default)
            
        Returns:
            tuple: (success, result/error_message)
        """
        connection = None
        cursor = None
        
        try:
            connection = cls.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            # For SELECT queries
            if query.strip().upper().startswith('SELECT') or query.strip().upper().startswith('SHOW'):
                if fetch_one:
                    result = cursor.fetchone()
                elif fetch_all:
                    result = cursor.fetchall()
                else:
                    result = None
                return True, result
            
            # For INSERT, UPDATE, DELETE queries
            connection.commit()
            return True, {"affected_rows": cursor.rowcount, "last_id": cursor.lastrowid}
            
        except Error as e:
            if connection:
                connection.rollback()
            # Check if it's a "database doesn't exist" error
            if 'Unknown database' in str(e) or e.errno == 1049:
                logger.error(f"Database not available: {e}")
                return False, "Database not available. Please use Setup page to create the database."
            logger.error(f"Database query error: {e}")
            return False, str(e)
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
    @classmethod
    def execute_many(cls, query, data_list):
        """Execute a query with multiple data rows"""
        connection = None
        cursor = None
        
        try:
            connection = cls.get_connection()
            cursor = connection.cursor()
            cursor.executemany(query, data_list)
            connection.commit()
            return True, {"affected_rows": cursor.rowcount}
        except Error as e:
            if connection:
                connection.rollback()
            logger.error(f"Database executemany error: {e}")
            return False, str(e)
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
    @classmethod
    def get_all_tables(cls):
        """Get list of all tables in the database"""
        query = "SHOW TABLES"
        success, result = cls.execute_query(query)
        if success:
            table_key = f'Tables_in_{Config.DB_NAME}'
            return True, [row[table_key] for row in result]
        return False, result
    
    @classmethod
    def get_table_data(cls, table_name, limit=100, offset=0):
        """Get data from a specific table with pagination"""
        # Sanitize table name (basic protection)
        if not table_name.replace('_', '').isalnum():
            return False, "Invalid table name"
        
        query = f"SELECT * FROM {table_name} LIMIT {int(limit)} OFFSET {int(offset)}"
        success, result = cls.execute_query(query)
        
        if success:
            # Also get total count
            count_query = f"SELECT COUNT(*) as total FROM {table_name}"
            count_success, count_result = cls.execute_query(count_query, fetch_one=True)
            
            return True, {
                "data": result,
                "total": count_result['total'] if count_success else len(result)
            }
        
        return False, result
    
    @classmethod
    def insert_record(cls, table_name, data):
        """Insert a new record into a table"""
        if not table_name.replace('_', '').isalnum():
            return False, "Invalid table name"
        
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['%s'] * len(data))
        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        
        return cls.execute_query(query, tuple(data.values()))
    
    @classmethod
    def update_record(cls, table_name, record_id, data, id_column='id'):
        """Update an existing record in a table"""
        if not table_name.replace('_', '').isalnum():
            return False, "Invalid table name"
        
        set_clause = ', '.join([f"{key} = %s" for key in data.keys()])
        query = f"UPDATE {table_name} SET {set_clause} WHERE {id_column} = %s"
        
        values = list(data.values()) + [record_id]
        return cls.execute_query(query, tuple(values))
    
    @classmethod
    def delete_record(cls, table_name, record_id, id_column='id'):
        """Delete a record from a table"""
        if not table_name.replace('_', '').isalnum():
            return False, "Invalid table name"
        
        query = f"DELETE FROM {table_name} WHERE {id_column} = %s"
        return cls.execute_query(query, (record_id,))
    
    @classmethod
    def create_database(cls, host, user, password, port=3306):
        """Create the edudb database with all tables and data"""
        connection = None
        cursor = None
        
        try:
            # Step 1: Connect without database and create it
            connection = mysql.connector.connect(
                host=host,
                port=port,
                user=user,
                password=password
            )
            cursor = connection.cursor()
            
            # Create database
            cursor.execute("CREATE DATABASE IF NOT EXISTS edudb")
            connection.commit()
            logger.info("Database 'edudb' created or already exists")
            
            # Close and reconnect to the new database
            cursor.close()
            connection.close()
            
            # Step 2: Connect to the edudb database
            connection = mysql.connector.connect(
                host=host,
                port=port,
                user=user,
                password=password,
                database='edudb'
            )
            cursor = connection.cursor()
            
            # Read initialization script
            with open(Config.DATABASE_DIR / 'init_db.sql', 'r', encoding='utf-8') as f:
                sql_script = f.read()
            
            # Remove comments and split by semicolon
            lines = sql_script.split('\n')
            clean_lines = []
            for line in lines:
                # Remove inline comments
                if '--' in line:
                    line = line[:line.index('--')]
                clean_lines.append(line)
            
            clean_script = '\n'.join(clean_lines)
            statements = [s.strip() for s in clean_script.split(';') if s.strip()]
            
            logger.info(f"Processing {len(statements)} SQL statements from init_db.sql")
            
            for i, statement in enumerate(statements, 1):
                statement_upper = statement.upper()
                
                # Skip CREATE DATABASE and USE statements
                if statement_upper.startswith('CREATE DATABASE') or statement_upper.startswith('USE '):
                    logger.info(f"Skipping statement #{i}: {statement[:50]}...")
                    continue
                
                # Skip SELECT statements used for displaying messages
                if statement_upper.startswith('SELECT') and ('AS STATUS' in statement_upper or 'AS INFO' in statement_upper):
                    logger.info(f"Skipping info statement #{i}: {statement[:50]}...")
                    continue
                
                try:
                    cursor.execute(statement)
                    # Consume any results from SELECT statements
                    if cursor.with_rows:
                        cursor.fetchall()
                    connection.commit()
                    
                    # Log successful operations
                    if 'CREATE TABLE' in statement_upper:
                        table_name = statement.split('TABLE')[1].split('(')[0].strip().replace('IF NOT EXISTS', '').strip()
                        logger.info(f"✓ Statement #{i}: Created table '{table_name}'")
                    elif 'DROP TABLE' in statement_upper:
                        table_name = statement.split('TABLE')[1].strip().replace('IF EXISTS', '').strip()
                        logger.info(f"✓ Statement #{i}: Dropped table '{table_name}'")
                    elif 'INSERT INTO' in statement_upper:
                        table_name = statement.split('INTO')[1].split('(')[0].strip().split()[0]
                        logger.info(f"✓ Statement #{i}: Inserted data into '{table_name}'")
                    elif 'CREATE INDEX' in statement_upper:
                        index_name = statement.split('INDEX')[1].split('ON')[0].strip()
                        logger.info(f"✓ Statement #{i}: Created index '{index_name}'")
                    else:
                        logger.info(f"✓ Statement #{i}: Executed successfully")
                        
                except Error as e:
                    logger.error(f"✗ Statement #{i} failed: {e}")
                    logger.error(f"  Statement: {statement[:100]}...")
                    connection.rollback()
                    # Continue with other statements
                    continue
            
            logger.info("init_db.sql executed successfully")
            
            # Now execute app schema
            with open(Config.DATABASE_DIR / 'app_schema.sql', 'r', encoding='utf-8') as f:
                app_schema_script = f.read()
            
            # Remove comments and split by semicolon
            lines = app_schema_script.split('\n')
            clean_lines = []
            for line in lines:
                if '--' in line:
                    line = line[:line.index('--')]
                clean_lines.append(line)
            
            clean_script = '\n'.join(clean_lines)
            statements = [s.strip() for s in clean_script.split(';') if s.strip()]
            
            logger.info(f"Processing {len(statements)} SQL statements from app_schema.sql")
            
            for i, statement in enumerate(statements, 1):
                statement_upper = statement.upper()
                
                # Skip USE and SELECT info statements
                if statement_upper.startswith('USE '):
                    continue
                if statement_upper.startswith('SELECT') and 'AS STATUS' in statement_upper:
                    continue
                
                try:
                    cursor.execute(statement)
                    # Consume any results from SELECT statements
                    if cursor.with_rows:
                        cursor.fetchall()
                    connection.commit()
                    
                    if 'CREATE TABLE' in statement_upper:
                        table_name = statement.split('TABLE')[1].split('(')[0].strip().replace('IF NOT EXISTS', '').strip()
                        logger.info(f"✓ Statement #{i}: Created app table '{table_name}'")
                    elif 'DROP TABLE' in statement_upper:
                        table_name = statement.split('TABLE')[1].strip().replace('IF EXISTS', '').strip()
                        logger.info(f"✓ Statement #{i}: Dropped app table '{table_name}'")
                    elif 'INSERT INTO' in statement_upper:
                        table_name = statement.split('INTO')[1].split('(')[0].strip().split()[0]
                        logger.info(f"✓ Statement #{i}: Inserted data into '{table_name}'")
                    else:
                        logger.info(f"✓ Statement #{i}: Executed successfully")
                        
                except Error as e:
                    logger.error(f"✗ App schema statement #{i} failed: {e}")
                    logger.error(f"  Statement: {statement[:100]}...")
                    connection.rollback()
                    continue
            
            logger.info("app_schema.sql executed successfully")
            
            # Reset the connection pool so it can connect to the new database
            cls._pool = None
            logger.info("Database created successfully. Connection pool reset.")
            
            # Initialize the pool now that database exists
            cls.initialize_pool()
            
            return True, "Database created successfully with all tables and data!"
            
        except Error as e:
            logger.error(f"Database creation error: {e}")
            if connection:
                try:
                    connection.rollback()
                except:
                    pass
            return False, f"Failed to create database: {str(e)}"
        finally:
            if cursor:
                try:
                    cursor.close()
                except:
                    pass
            if connection and connection.is_connected():
                try:
                    connection.close()
                except:
                    pass
    
    @classmethod
    def reset_database(cls):
        """Reset database to original sample data"""
        try:
            with open(Config.DATABASE_DIR / 'reset_db.sql', 'r') as f:
                sql_script = f.read()
            
            connection = cls.get_connection()
            cursor = connection.cursor()
            
            # Execute each statement
            for statement in sql_script.split(';'):
                statement = statement.strip()
                if statement and not statement.startswith('--'):
                    cursor.execute(statement)
            
            connection.commit()
            cursor.close()
            connection.close()
            
            logger.info("Database reset successfully")
            return True, "Database reset to original sample data"
        except Error as e:
            logger.error(f"Database reset error: {e}")
            return False, str(e)
