#!/usr/bin/env python3
"""
EduDB Application Entry Point
Run this file to start the server
"""

import sys
import os
import webbrowser
from threading import Timer

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app import app
from config.config import Config

def open_browser():
    """Open browser after a short delay"""
    webbrowser.open(f'http://{Config.HOST}:{Config.PORT}')

if __name__ == '__main__':
    print("=" * 60)
    print(" EduDB - Learn MySQL with Python")
    print("=" * 60)
    print(f" Server starting on: http://{Config.HOST}:{Config.PORT}")
    print(" Press CTRL+C to stop the server")
    print("=" * 60)
    print()
    
    Timer(1.0, open_browser).start()
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG,
        use_reloader=False  
    )
