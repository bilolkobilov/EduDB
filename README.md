# EduDB

Educational MySQL database learning platform with interactive Python examples.

## Quick Start

```bash
pip install -r requirements.txt
python run.py
```

Browser opens automatically at `http://localhost:5000`

## Setup

1. **Prerequisites**: MySQL 8.0+ installed and running
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Navigate to Setup**: Go to `/setup` and enter MySQL root password
4. **Create database**: Click "Create Database Automatically"
5. **Start learning**: Go to Studio page

## Features

- Interactive table management (CRUD operations)
- Live Python & SQL code generation
- Real-time syntax highlighting
- Sample data included (students, teachers, courses, enrollments)

## Tech Stack

- Backend: Flask 3.0.0 + MySQL 8.0+
- Frontend: HTML5, Tailwind CSS, JavaScript
- Database: MySQL with connection pooling

## Troubleshooting

**Connection failed**: Check MySQL is running on port 3306  
**Access denied**: Verify MySQL root password  
**Database exists**: Drop with `DROP DATABASE edudb;` then recreate
