/**
 * Module Content Data
 * Contains all 15 modules with explanations and interactive examples
 */

const MODULES = [
    {
        id: 1,
        title: "Database Basics",
        description: "Understanding databases, tables, rows, and columns",
        explanation: `
            <h3 class="text-xl font-bold mb-3">What is a Database?</h3>
            <p class="mb-3">A database is a collection of organized data that can be easily accessed, managed, and updated. Think of it like a digital filing cabinet where information is stored in a structured way.</p>
            
            <h4 class="font-bold mt-4 mb-2">Database vs Spreadsheet:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li>Databases handle much larger amounts of data</li>
                <li>Multiple users can access simultaneously</li>
                <li>Better security and data integrity</li>
                <li>More powerful querying capabilities</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Key Concepts:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>Table:</strong> Organized collection of data (like a spreadsheet)</li>
                <li><strong>Row (Record):</strong> Single entry of data</li>
                <li><strong>Column (Field):</strong> Attribute of the data</li>
                <li><strong>Primary Key:</strong> Unique identifier for each row</li>
            </ul>
            
            <p class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-600 text-sm">
                <strong>Real-world analogy:</strong> A database is like a filing cabinet, tables are folders inside it, rows are individual documents, and columns are different pieces of information on each document (name, date, etc.).
            </p>
        `,
        interactiveButtons: [
            {
                label: "View Students Table",
                action: "viewTable",
                table: "students"
            },
            {
                label: "View All Tables",
                action: "viewAllTables"
            }
        ]
    },
    {
        id: 2,
        title: "Connection & Setup",
        description: "Connecting Python to MySQL database",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Connecting Python to MySQL</h3>
            <p class="mb-3">To work with MySQL from Python, we use the <code class="bg-gray-100 px-2 py-1 rounded">mysql-connector-python</code> library. This allows us to execute SQL queries and retrieve results.</p>
            
            <h4 class="font-bold mt-4 mb-2">Connection Parameters:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>host:</strong> Where the database server is located (localhost for us)</li>
                <li><strong>user:</strong> MySQL username (root for us)</li>
                <li><strong>password:</strong> MySQL password</li>
                <li><strong>database:</strong> Which database to use (edudb)</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Why Connection Management Matters:</h4>
            <p class="mb-2">Properly managing database connections is crucial:</p>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li>Prevents resource leaks</li>
                <li>Improves application performance</li>
                <li>Ensures data integrity</li>
                <li>Avoids "too many connections" errors</li>
            </ul>
            
            <div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-600 text-sm">
                <strong>Important:</strong> Always close connections when you're done using them!
            </div>
        `,
        interactiveButtons: [
            {
                label: "Test Connection",
                action: "testConnection"
            },
            {
                label: "View Connection Code",
                action: "showConnectionCode"
            }
        ]
    },
    {
        id: 3,
        title: "Tables & Data Types",
        description: "Understanding table structure and data types",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Understanding Tables and Data Types</h3>
            <p class="mb-3">Tables are the foundation of relational databases. Each table stores a specific type of information with defined columns and data types.</p>
            
            <h4 class="font-bold mt-4 mb-2">Common Data Types:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>INT:</strong> Whole numbers (1, 42, 1000)</li>
                <li><strong>VARCHAR(n):</strong> Text with maximum length (names, emails)</li>
                <li><strong>DATE:</strong> Dates in YYYY-MM-DD format</li>
                <li><strong>DECIMAL(m,n):</strong> Decimal numbers (grades, prices)</li>
                <li><strong>TEXT:</strong> Long text content</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Important Constraints:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>PRIMARY KEY:</strong> Unique identifier for each row</li>
                <li><strong>AUTO_INCREMENT:</strong> Automatically generates unique numbers</li>
                <li><strong>NOT NULL:</strong> Field must have a value</li>
                <li><strong>UNIQUE:</strong> No duplicate values allowed</li>
                <li><strong>DEFAULT:</strong> Default value if none provided</li>
            </ul>
        `,
        interactiveButtons: [
            {
                label: "View Students Structure",
                action: "viewTableStructure",
                table: "students"
            },
            {
                label: "View Teachers Structure",
                action: "viewTableStructure",
                table: "teachers"
            }
        ]
    },
    {
        id: 4,
        title: "CRUD Operations",
        description: "Create, Read, Update, and Delete operations",
        explanation: `
            <h3 class="text-xl font-bold mb-3">CRUD Operations</h3>
            <p class="mb-3">CRUD stands for Create, Read, Update, Delete - the four basic operations for managing data in a database.</p>
            
            <h4 class="font-bold mt-4 mb-2">CREATE (INSERT):</h4>
            <p class="mb-2">Add new records to a table.</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">INSERT INTO students (name, email, enrollment_date, grade_level) VALUES ('John Doe', 'john@email.com', '2024-01-01', 10)</code>
            
            <h4 class="font-bold mt-4 mb-2">READ (SELECT):</h4>
            <p class="mb-2">Retrieve data from tables.</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">SELECT * FROM students</code>
            
            <h4 class="font-bold mt-4 mb-2">UPDATE:</h4>
            <p class="mb-2">Modify existing records.</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">UPDATE students SET grade_level = 11 WHERE id = 1</code>
            
            <h4 class="font-bold mt-4 mb-2">DELETE:</h4>
            <p class="mb-2">Remove records from table.</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">DELETE FROM students WHERE id = 1</code>
            
            <div class="mt-4 p-3 bg-red-50 border-l-4 border-red-600 text-sm">
                <strong>WARNING:</strong> Always use WHERE clause with UPDATE and DELETE, or you'll modify/delete ALL records!
            </div>
        `,
        interactiveButtons: [
            {
                label: "Use Table Buttons",
                action: "showMessage",
                message: "Click Edit, Delete, or Add buttons on any table to see CRUD operations in action!"
            }
        ]
    },
    {
        id: 5,
        title: "Filtering & Searching",
        description: "Using WHERE clause to filter data",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Finding Specific Data with WHERE</h3>
            <p class="mb-3">The WHERE clause filters records based on conditions. It's one of the most important SQL features.</p>
            
            <h4 class="font-bold mt-4 mb-2">Comparison Operators:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>=</strong> equals</li>
                <li><strong>!=</strong> or <strong>&lt;&gt;</strong> not equals</li>
                <li><strong>&gt;</strong> greater than</li>
                <li><strong>&lt;</strong> less than</li>
                <li><strong>&gt;=</strong> greater than or equal</li>
                <li><strong>&lt;=</strong> less than or equal</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Logical Operators:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>AND:</strong> Both conditions must be true</li>
                <li><strong>OR:</strong> At least one condition must be true</li>
                <li><strong>NOT:</strong> Negates a condition</li>
                <li><strong>IN:</strong> Matches any value in a list</li>
                <li><strong>BETWEEN:</strong> Checks if value is in a range</li>
                <li><strong>LIKE:</strong> Pattern matching with wildcards (%, _)</li>
            </ul>
            
            <p class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-600 text-sm">
                <strong>Tip:</strong> The % wildcard matches any sequence of characters. Use it for flexible searches!
            </p>
        `,
        interactiveButtons: [
            {
                label: "Students in Grade 10",
                action: "executeQuery",
                query: "SELECT * FROM students WHERE grade_level = 10"
            },
            {
                label: "Students in Grade 10 OR 11",
                action: "executeQuery",
                query: "SELECT * FROM students WHERE grade_level IN (10, 11)"
            },
            {
                label: "Names Starting with 'J'",
                action: "executeQuery",
                query: "SELECT * FROM students WHERE name LIKE 'J%'"
            }
        ]
    },
    {
        id: 6,
        title: "Sorting & Limiting",
        description: "Organizing query results with ORDER BY and LIMIT",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Organizing Query Results</h3>
            
            <h4 class="font-bold mt-4 mb-2">ORDER BY - Sorting Results:</h4>
            <p class="mb-2">Sort results in ascending or descending order.</p>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>ASC:</strong> Ascending (A-Z, 0-9, oldest-newest) - default</li>
                <li><strong>DESC:</strong> Descending (Z-A, 9-0, newest-oldest)</li>
            </ul>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">SELECT * FROM students ORDER BY name ASC</code>
            
            <h4 class="font-bold mt-4 mb-2">LIMIT - Restricting Results:</h4>
            <p class="mb-2">Control how many rows are returned.</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">SELECT * FROM students LIMIT 3</code>
            
            <h4 class="font-bold mt-4 mb-2">OFFSET - Pagination:</h4>
            <p class="mb-2">Skip a specified number of rows.</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">SELECT * FROM students LIMIT 3 OFFSET 3  -- Rows 4-6</code>
            
            <p class="mt-4 p-3 bg-green-50 border-l-4 border-green-600 text-sm">
                <strong>Use Case:</strong> Combine ORDER BY and LIMIT to get "Top 5" results!
            </p>
        `,
        interactiveButtons: [
            {
                label: "Sort by Name A-Z",
                action: "executeQuery",
                query: "SELECT * FROM students ORDER BY name ASC"
            },
            {
                label: "Sort by Grade (Highest First)",
                action: "executeQuery",
                query: "SELECT * FROM students ORDER BY grade_level DESC"
            },
            {
                label: "Top 3 Students",
                action: "executeQuery",
                query: "SELECT * FROM students LIMIT 3"
            }
        ]
    },
    {
        id: 7,
        title: "Relationships & Foreign Keys",
        description: "Connecting tables with foreign keys",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Connecting Tables with Foreign Keys</h3>
            <p class="mb-3">Foreign keys create relationships between tables, maintaining data integrity and avoiding redundancy.</p>
            
            <h4 class="font-bold mt-4 mb-2">What is a Foreign Key?</h4>
            <p class="mb-3">A field in one table that refers to the primary key in another table. It creates a link between the two tables.</p>
            
            <h4 class="font-bold mt-4 mb-2">Types of Relationships:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>One-to-Many:</strong> One teacher teaches many courses</li>
                <li><strong>Many-to-Many:</strong> Many students enroll in many courses (requires junction table)</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Our Database Relationships:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li>teachers → courses (one-to-many via teacher_id)</li>
                <li>students ↔ courses (many-to-many via enrollments)</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">ON DELETE CASCADE:</h4>
            <p class="mb-2">When a referenced record is deleted, related records are automatically deleted too. This prevents "orphaned" records.</p>
            
            <div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-600 text-sm">
                <strong>Important:</strong> Foreign keys enforce data integrity - you can't reference a record that doesn't exist!
            </div>
        `,
        interactiveButtons: [
            {
                label: "View Courses with Teachers",
                action: "executeQuery",
                query: "SELECT c.course_name, t.name as teacher_name FROM courses c JOIN teachers t ON c.teacher_id = t.id"
            }
        ]
    },
    {
        id: 8,
        title: "JOINS - Connecting Tables",
        description: "Combining data from multiple tables",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Combining Data from Multiple Tables</h3>
            <p class="mb-3">JOINs allow you to query data from multiple tables based on related columns.</p>
            
            <h4 class="font-bold mt-4 mb-2">Types of JOINS:</h4>
            
            <p class="mt-3"><strong>INNER JOIN:</strong> Returns only matching records from both tables</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3 text-sm">SELECT * FROM students INNER JOIN enrollments ON students.id = enrollments.student_id</code>
            
            <p class="mt-3"><strong>LEFT JOIN:</strong> Returns all records from left table, matched records from right</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3 text-sm">SELECT * FROM students LEFT JOIN enrollments ON students.id = enrollments.student_id</code>
            
            <p class="mt-3"><strong>RIGHT JOIN:</strong> Returns all records from right table, matched records from left</p>
            
            <p class="mt-3"><strong>CROSS JOIN:</strong> Returns all combinations (Cartesian product)</p>
            
            <div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-600 text-sm">
                <strong>Tip:</strong> INNER JOIN is most common. Use LEFT JOIN when you want all records from the main table regardless of matches.
            </div>
        `,
        interactiveButtons: [
            {
                label: "Students with Their Courses",
                action: "executeQuery",
                query: "SELECT s.name as student, c.course_name FROM students s INNER JOIN enrollments e ON s.id = e.student_id INNER JOIN courses c ON e.course_id = c.id"
            },
            {
                label: "All Students (Even Without Courses)",
                action: "executeQuery",
                query: "SELECT s.name as student, c.course_name FROM students s LEFT JOIN enrollments e ON s.id = e.student_id LEFT JOIN courses c ON e.course_id = c.id"
            }
        ]
    },
    {
        id: 9,
        title: "Aggregate Functions",
        description: "Calculating summary statistics",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Calculating Summary Statistics</h3>
            <p class="mb-3">Aggregate functions perform calculations on multiple rows and return a single value.</p>
            
            <h4 class="font-bold mt-4 mb-2">Common Aggregate Functions:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>COUNT():</strong> Counts rows</li>
                <li><strong>SUM():</strong> Adds up values</li>
                <li><strong>AVG():</strong> Calculates average</li>
                <li><strong>MIN():</strong> Finds minimum value</li>
                <li><strong>MAX():</strong> Finds maximum value</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">GROUP BY:</h4>
            <p class="mb-2">Groups rows with same values so you can apply aggregate functions to each group.</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">SELECT grade_level, COUNT(*) FROM students GROUP BY grade_level</code>
            
            <h4 class="font-bold mt-4 mb-2">HAVING:</h4>
            <p class="mb-2">Filters grouped results (WHERE filters before grouping, HAVING filters after).</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">SELECT grade_level, COUNT(*) FROM students GROUP BY grade_level HAVING COUNT(*) > 1</code>
        `,
        interactiveButtons: [
            {
                label: "Count Total Students",
                action: "executeQuery",
                query: "SELECT COUNT(*) as total_students FROM students"
            },
            {
                label: "Average Grade",
                action: "executeQuery",
                query: "SELECT AVG(grade) as avg_grade FROM enrollments WHERE grade IS NOT NULL"
            },
            {
                label: "Students Per Grade Level",
                action: "executeQuery",
                query: "SELECT grade_level, COUNT(*) as student_count FROM students GROUP BY grade_level"
            }
        ]
    },
    {
        id: 10,
        title: "Subqueries",
        description: "Queries within queries",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Queries Within Queries</h3>
            <p class="mb-3">A subquery is a query nested inside another query. The inner query executes first, and its result is used by the outer query.</p>
            
            <h4 class="font-bold mt-4 mb-2">Where to Use Subqueries:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li>In WHERE clause - filter based on another query's result</li>
                <li>In SELECT clause - calculate values per row</li>
                <li>In FROM clause - create temporary result sets</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Example - Students Above Average:</h4>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3 text-sm">SELECT name FROM students WHERE id IN (SELECT student_id FROM enrollments GROUP BY student_id HAVING AVG(grade) > (SELECT AVG(grade) FROM enrollments))</code>
            
            <p class="mt-4 p-3 bg-purple-50 border-l-4 border-purple-600 text-sm">
                <strong>Note:</strong> Subqueries can sometimes be replaced with JOINs for better performance.
            </p>
        `,
        interactiveButtons: [
            {
                label: "Show Example",
                action: "showMessage",
                message: "Subqueries are powerful! Practice them in the Exercises section."
            }
        ]
    },
    {
        id: 11,
        title: "Advanced Queries",
        description: "DISTINCT, string/date functions, CASE, UNION",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Advanced SQL Techniques</h3>
            
            <h4 class="font-bold mt-4 mb-2">DISTINCT - Remove Duplicates:</h4>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">SELECT DISTINCT grade_level FROM students</code>
            
            <h4 class="font-bold mt-4 mb-2">String Functions:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>CONCAT():</strong> Combine strings</li>
                <li><strong>UPPER()/LOWER():</strong> Change case</li>
                <li><strong>SUBSTRING():</strong> Extract part of string</li>
                <li><strong>LENGTH():</strong> Get string length</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Date Functions:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>NOW():</strong> Current date and time</li>
                <li><strong>CURDATE():</strong> Current date</li>
                <li><strong>DATEDIFF():</strong> Days between dates</li>
                <li><strong>DATE_FORMAT():</strong> Format dates</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">CASE - Conditional Logic:</h4>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3 text-sm">SELECT name, CASE WHEN grade >= 90 THEN 'A' WHEN grade >= 80 THEN 'B' ELSE 'C' END as letter_grade FROM enrollments</code>
        `,
        interactiveButtons: [
            {
                label: "Unique Grade Levels",
                action: "executeQuery",
                query: "SELECT DISTINCT grade_level FROM students ORDER BY grade_level"
            },
            {
                label: "Uppercase Names",
                action: "executeQuery",
                query: "SELECT UPPER(name) as name_upper FROM students"
            }
        ]
    },
    {
        id: 12,
        title: "Indexes & Performance",
        description: "Optimizing query speed with indexes",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Optimizing Query Speed</h3>
            <p class="mb-3">Indexes are database structures that improve query performance by allowing quick data lookup - like an index in a book!</p>
            
            <h4 class="font-bold mt-4 mb-2">How Indexes Work:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li>Speed up SELECT, WHERE, JOIN, ORDER BY operations</li>
                <li>Slow down INSERT, UPDATE, DELETE (index must be updated)</li>
                <li>Trade-off: Faster reads vs slower writes</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">When to Use Indexes:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li>Columns frequently used in WHERE clauses</li>
                <li>Columns used in JOIN conditions</li>
                <li>Foreign key columns</li>
                <li>Columns with high selectivity (many unique values)</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">EXPLAIN Command:</h4>
            <p class="mb-2">Shows how MySQL will execute your query and whether indexes are being used.</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">EXPLAIN SELECT * FROM students WHERE email = 'john@email.com'</code>
            
            <div class="mt-4 p-3 bg-green-50 border-l-4 border-green-600 text-sm">
                <strong>Tip:</strong> Primary keys and foreign keys are automatically indexed!
            </div>
        `,
        interactiveButtons: [
            {
                label: "Show Table Indexes",
                action: "executeQuery",
                query: "SHOW INDEX FROM students"
            }
        ]
    },
    {
        id: 13,
        title: "Transactions",
        description: "Ensuring data integrity with transactions",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Ensuring Data Integrity</h3>
            <p class="mb-3">A transaction is a group of SQL operations treated as a single unit. All operations succeed together, or all fail together.</p>
            
            <h4 class="font-bold mt-4 mb-2">ACID Properties:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>Atomicity:</strong> All or nothing</li>
                <li><strong>Consistency:</strong> Database rules maintained</li>
                <li><strong>Isolation:</strong> Transactions don't interfere with each other</li>
                <li><strong>Durability:</strong> Changes are permanent after commit</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Transaction Commands:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong>BEGIN:</strong> Start a transaction</li>
                <li><strong>COMMIT:</strong> Save all changes permanently</li>
                <li><strong>ROLLBACK:</strong> Cancel all changes since BEGIN</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Example Use Case:</h4>
            <p class="mb-2">Transferring money between accounts - both the debit and credit must succeed or both must fail!</p>
            
            <div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-600 text-sm">
                <strong>Real-world analogy:</strong> Like a bank transaction - the money must leave one account AND arrive in another, not just one or the other!
            </div>
        `,
        interactiveButtons: [
            {
                label: "Learn More",
                action: "showMessage",
                message: "Transactions are critical for data integrity. Practice them in real applications!"
            }
        ]
    },
    {
        id: 14,
        title: "Views",
        description: "Virtual tables for simplified queries",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Virtual Tables for Simplified Queries</h3>
            <p class="mb-3">A view is a saved SELECT query that acts like a virtual table. It doesn't store data itself - data comes from underlying tables.</p>
            
            <h4 class="font-bold mt-4 mb-2">Benefits of Views:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li>Simplify complex queries (write once, use many times)</li>
                <li>Security (hide sensitive columns)</li>
                <li>Consistency (everyone uses same query logic)</li>
                <li>Abstraction (hide complexity from users)</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Creating a View:</h4>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3 text-sm">CREATE VIEW student_summary AS SELECT id, name, email, grade_level FROM students</code>
            
            <h4 class="font-bold mt-4 mb-2">Using a View:</h4>
            <code class="block bg-gray-900 text-green-400 p-3 rounded mb-3">SELECT * FROM student_summary</code>
            
            <p class="mt-4 p-3 bg-purple-50 border-l-4 border-purple-600 text-sm">
                <strong>Note:</strong> Views always show current data from underlying tables.
            </div>
        `,
        interactiveButtons: [
            {
                label: "Learn More",
                action: "showMessage",
                message: "Views are powerful for organizing complex queries!"
            }
        ]
    },
    {
        id: 15,
        title: "Best Practices & Security",
        description: "Professional database development",
        explanation: `
            <h3 class="text-xl font-bold mb-3">Professional Database Development</h3>
            
            <h4 class="font-bold mt-4 mb-2">SQL Injection Prevention:</h4>
            <p class="mb-2 text-red-600 font-semibold">CRITICAL: #1 Database Security Threat!</p>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li><strong class="text-red-600">NEVER</strong> concatenate user input into SQL queries</li>
                <li><strong class="text-green-600">ALWAYS</strong> use parameterized queries (placeholders)</li>
            </ul>
            
            <div class="bg-red-50 border border-red-200 p-3 rounded mb-3">
                <p class="font-bold text-red-900 mb-1">❌ DANGEROUS:</p>
                <code class="text-sm">query = "SELECT * FROM students WHERE name = '" + user_input + "'"</code>
            </div>
            
            <div class="bg-green-50 border border-green-200 p-3 rounded mb-3">
                <p class="font-bold text-green-900 mb-1">✅ SAFE:</p>
                <code class="text-sm">query = "SELECT * FROM students WHERE name = %s"<br>cursor.execute(query, (user_input,))</code>
            </div>
            
            <h4 class="font-bold mt-4 mb-2">Password Security:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li>NEVER store passwords in plain text</li>
                <li>ALWAYS hash passwords (bcrypt, argon2)</li>
                <li>Add salt to prevent rainbow table attacks</li>
            </ul>
            
            <h4 class="font-bold mt-4 mb-2">Other Best Practices:</h4>
            <ul class="list-disc pl-6 mb-3 space-y-1">
                <li>Use consistent naming conventions (snake_case)</li>
                <li>Index frequently-queried columns</li>
                <li>Close database connections properly</li>
                <li>Regular backups (mysqldump)</li>
                <li>Use appropriate data types</li>
                <li>Document your database schema</li>
            </ul>
        `,
        interactiveButtons: [
            {
                label: "Review Complete",
                action: "showMessage",
                message: "Congratulations! You've completed all 15 modules. Now try the Exercises!"
            }
        ]
    }
];

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MODULES;
}
