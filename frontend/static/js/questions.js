/**
 * Exercise Questions Database
 * Contains all 45 questions across 3 difficulty levels
 */

const EXERCISES = {
    beginner: [
        {
            id: 1,
            question: "Which SQL command is used to retrieve data from a database?",
            type: "multiple-choice",
            options: ["GET", "SELECT", "RETRIEVE", "FETCH"],
            correctAnswer: 1,
            explanation: "SELECT is the fundamental command for retrieving data from tables.",
            hints: [
                "Think about the CRUD operations we learned. What's the 'R' command?",
                "This command is one of the most commonly used in SQL, starts with 'S'.",
                "The answer is SELECT."
            ]
        },
        {
            id: 2,
            question: "What does the WHERE clause do in a SQL query?",
            type: "multiple-choice",
            options: ["Sorts the results", "Filters records based on conditions", "Joins two tables", "Groups similar records"],
            correctAnswer: 1,
            explanation: "WHERE filters records to show only those that meet your conditions.",
            hints: [
                "Think about how you would find specific records.",
                "It's used to narrow down results based on criteria.",
                "The answer is: Filters records based on conditions."
            ]
        },
        {
            id: 3,
            question: "Complete this SQL query to get all students from the students table: SELECT * ____ students;",
            type: "fill-in-blank",
            correctAnswer: "FROM",
            caseSensitive: false,
            explanation: "FROM specifies which table to retrieve data from.",
            hints: [
                "This keyword specifies the source table.",
                "It comes after SELECT and before the table name.",
                "The answer is FROM."
            ]
        },
        {
            id: 4,
            question: "What does the asterisk (*) mean in: SELECT * FROM courses?",
            type: "multiple-choice",
            options: ["Multiply all values", "Select all columns", "Select all rows", "Delete all data"],
            correctAnswer: 1,
            explanation: "The asterisk (*) is a wildcard that means 'all columns'.",
            hints: ["It's a wildcard symbol.", "Think about what you're selecting.", "It means 'all columns'."]
        },
        {
            id: 5,
            question: "Given this query: SELECT COUNT(*) FROM students; And knowing there are 5 students in the table, what will be the output?",
            type: "multiple-choice",
            options: ["All student names", "The number 5", "TRUE", "5 rows of student data"],
            correctAnswer: 1,
            explanation: "COUNT(*) returns a single number - the count of rows.",
            hints: ["COUNT is an aggregate function.", "It returns a number, not rows.", "The answer is: The number 5."]
        },
        {
            id: 6,
            question: "Which SQL command adds new data to a table?",
            type: "multiple-choice",
            options: ["ADD", "INSERT", "CREATE", "PUT"],
            correctAnswer: 1,
            explanation: "INSERT adds new records to a table.",
            hints: ["It's the 'C' in CRUD.", "Think about adding data.", "The answer is INSERT."]
        },
        {
            id: 7,
            question: "What does UPDATE do?",
            type: "multiple-choice",
            options: ["Adds new records", "Deletes records", "Modifies existing records", "Creates new tables"],
            correctAnswer: 2,
            explanation: "UPDATE modifies existing data in tables.",
            hints: ["It's the 'U' in CRUD.", "Think about changing existing data.", "The answer is: Modifies existing records."]
        },
        {
            id: 8,
            question: "Which clause is CRITICAL to include with DELETE to avoid deleting all records?",
            type: "multiple-choice",
            options: ["FROM", "SET", "WHERE", "GROUP BY"],
            correctAnswer: 2,
            explanation: "Always use WHERE with DELETE! Without it, you'll delete EVERYTHING.",
            hints: ["It filters which records to delete.", "Without it, all records are deleted!", "The answer is WHERE."]
        },
        {
            id: 9,
            question: "What does ORDER BY do?",
            type: "multiple-choice",
            options: ["Filters records", "Sorts results", "Counts records", "Joins tables"],
            correctAnswer: 1,
            explanation: "ORDER BY sorts results in ascending or descending order.",
            hints: ["It organizes the output.", "Think about sorting.", "The answer is: Sorts results."]
        },
        {
            id: 10,
            question: "Which keyword limits the number of results returned?",
            type: "multiple-choice",
            options: ["STOP", "MAX", "LIMIT", "TOP"],
            correctAnswer: 2,
            explanation: "LIMIT restricts the number of rows returned.",
            hints: ["It controls how many rows you get.", "Very commonly used.", "The answer is LIMIT."]
        },
        {
            id: 11,
            question: "Complete: SELECT name FROM students ORDER BY name ___; (to sort A-Z)",
            type: "fill-in-blank",
            correctAnswer: "ASC",
            caseSensitive: false,
            explanation: "ASC means ascending order (A-Z, 0-9, oldest-newest).",
            hints: ["It's the opposite of DESC.", "Think ascending.", "The answer is ASC."]
        },
        {
            id: 12,
            question: "What does NULL mean in a database?",
            type: "multiple-choice",
            options: ["Zero", "Empty string \"\"", "No value / unknown", "False"],
            correctAnswer: 2,
            explanation: "NULL means 'no value' or 'unknown'. Different from zero or empty string.",
            hints: ["It's not zero or empty.", "It represents absence of value.", "The answer is: No value / unknown."]
        },
        {
            id: 13,
            question: "Which operator checks if a value is NULL?",
            type: "multiple-choice",
            options: ["= NULL", "== NULL", "IS NULL", "NULL?"],
            correctAnswer: 2,
            explanation: "You must use IS NULL, not = NULL.",
            hints: ["You can't use = with NULL.", "It's a special operator.", "The answer is IS NULL."]
        },
        {
            id: 14,
            question: "What does the LIKE operator do?",
            type: "multiple-choice",
            options: ["Adds records", "Joins tables", "Searches for patterns in text", "Counts matching records"],
            correctAnswer: 2,
            explanation: "LIKE searches for patterns using wildcards like % and _.",
            hints: ["It's for text matching.", "Uses wildcards.", "The answer is: Searches for patterns in text."]
        },
        {
            id: 15,
            question: "In LIKE patterns, what does the % wildcard match?",
            type: "multiple-choice",
            options: ["Exactly one character", "Any number of characters (including zero)", "Numbers only", "Uppercase letters"],
            correctAnswer: 1,
            explanation: "% matches any sequence of characters. Example: 'J%' matches 'John', 'Jane', 'J', etc.",
            hints: ["It's very flexible.", "Can match nothing or many characters.", "The answer is: Any number of characters."]
        }
    ],
    intermediate: [
        {
            id: 1,
            question: "Which type of JOIN returns all records from the left table and matching records from the right table?",
            type: "multiple-choice",
            options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
            correctAnswer: 1,
            explanation: "LEFT JOIN includes all rows from the left table, with NULL for non-matching rows from the right.",
            hints: ["Think about which table is prioritized.", "Left table gets all rows.", "The answer is LEFT JOIN."]
        },
        {
            id: 2,
            question: "Write a query to find all students in grade 10 or grade 11, sorted by name alphabetically.",
            type: "sql-query",
            correctAnswer: "SELECT * FROM students WHERE grade_level IN (10, 11) ORDER BY name",
            keywords: ["SELECT", "students", "WHERE", "grade_level", "IN", "10", "11", "ORDER BY", "name"],
            explanation: "Use IN operator for multiple values and ORDER BY for sorting.",
            hints: [
                "Use WHERE with IN operator for multiple grades.",
                "Don't forget ORDER BY name at the end.",
                "SELECT * FROM students WHERE grade_level IN (10, 11) ORDER BY name;"
            ]
        },
        {
            id: 3,
            question: "What is a Foreign Key?",
            type: "multiple-choice",
            options: [
                "The primary key of the same table",
                "A unique identifier within a table",
                "A field that references the primary key of another table",
                "An encrypted password field"
            ],
            correctAnswer: 2,
            explanation: "Foreign keys create relationships between tables by referencing primary keys.",
            hints: ["It connects tables.", "References another table's primary key.", "The answer is: A field that references the primary key of another table."]
        },
        {
            id: 4,
            question: "Write a query to find the average grade across all enrollments (excluding NULL grades).",
            type: "sql-query",
            correctAnswer: "SELECT AVG(grade) FROM enrollments WHERE grade IS NOT NULL",
            keywords: ["SELECT", "AVG", "grade", "enrollments", "WHERE", "IS NOT NULL"],
            explanation: "AVG() calculates average, WHERE grade IS NOT NULL excludes ungraded enrollments.",
            hints: [
                "Use AVG() aggregate function.",
                "Filter out NULLs with WHERE grade IS NOT NULL.",
                "SELECT AVG(grade) FROM enrollments WHERE grade IS NOT NULL;"
            ]
        },
        {
            id: 5,
            question: "Which aggregate function would you use to find the highest grade?",
            type: "multiple-choice",
            options: ["TOP(grade)", "MAX(grade)", "HIGHEST(grade)", "BEST(grade)"],
            correctAnswer: 1,
            explanation: "MAX() finds the maximum value in a column.",
            hints: ["It's one of the standard aggregate functions.", "Opposite of MIN().", "The answer is MAX(grade)."]
        },
        {
            id: 6,
            question: "Write a query to count how many students are in each grade level. Show grade_level and count.",
            type: "sql-query",
            correctAnswer: "SELECT grade_level, COUNT(*) FROM students GROUP BY grade_level",
            keywords: ["SELECT", "grade_level", "COUNT", "students", "GROUP BY"],
            explanation: "GROUP BY creates groups, COUNT counts students per group.",
            hints: [
                "Use GROUP BY grade_level.",
                "COUNT(*) counts rows in each group.",
                "SELECT grade_level, COUNT(*) FROM students GROUP BY grade_level;"
            ]
        },
        {
            id: 7,
            question: "What's wrong with this query? SELECT students.name, AVG(enrollments.grade) FROM students INNER JOIN enrollments ON students.id = enrollments.student_id;",
            type: "multiple-choice",
            options: ["Nothing, it's correct", "Missing WHERE clause", "Missing GROUP BY clause", "Wrong JOIN type"],
            correctAnswer: 2,
            explanation: "When using aggregate function with non-aggregated columns, you must GROUP BY those columns.",
            hints: ["Mixing aggregate and non-aggregate columns.", "Need to group by name.", "The answer is: Missing GROUP BY clause."]
        },
        {
            id: 8,
            question: "What does HAVING do that WHERE cannot?",
            type: "multiple-choice",
            options: [
                "Filter rows before grouping",
                "Filter grouped results using aggregate functions",
                "Join tables",
                "Sort results"
            ],
            correctAnswer: 1,
            explanation: "HAVING filters groups after aggregation, WHERE filters individual rows before grouping.",
            hints: ["It works with GROUP BY.", "Filters after aggregation.", "The answer is: Filter grouped results using aggregate functions."]
        },
        {
            id: 9,
            question: "Write a query to show student names and their enrolled course names. Use INNER JOIN.",
            type: "sql-query",
            correctAnswer: "SELECT s.name, c.course_name FROM students s INNER JOIN enrollments e ON s.id = e.student_id INNER JOIN courses c ON e.course_id = c.id",
            keywords: ["SELECT", "name", "course_name", "students", "enrollments", "courses", "INNER JOIN", "ON"],
            explanation: "Join three tables: students → enrollments → courses using foreign keys.",
            hints: [
                "Need to join three tables.",
                "students.id = enrollments.student_id and courses.id = enrollments.course_id",
                "Use table aliases for readability."
            ]
        },
        {
            id: 10,
            question: "What does a subquery do?",
            type: "multiple-choice",
            options: [
                "Runs after the main query completes",
                "A query nested inside another query",
                "Backs up the database",
                "Deletes old data"
            ],
            correctAnswer: 1,
            explanation: "A subquery is a query inside another query, executed first to provide results for the outer query.",
            hints: ["It's nested.", "Inner query provides data to outer query.", "The answer is: A query nested inside another query."]
        },
        {
            id: 11,
            question: "Write a query to find courses with more than 2 enrolled students. Show course_name and student count.",
            type: "sql-query",
            correctAnswer: "SELECT c.course_name, COUNT(e.id) FROM courses c INNER JOIN enrollments e ON c.id = e.course_id GROUP BY c.id, c.course_name HAVING COUNT(e.id) > 2",
            keywords: ["SELECT", "course_name", "COUNT", "courses", "enrollments", "INNER JOIN", "GROUP BY", "HAVING"],
            explanation: "Group by course, count enrollments, use HAVING to filter counts.",
            hints: [
                "JOIN courses and enrollments.",
                "GROUP BY course, use HAVING for count filter.",
                "HAVING COUNT(e.id) > 2"
            ]
        },
        {
            id: 12,
            question: "What's the security problem with this code? query = 'SELECT * FROM students WHERE name = ' + user_input",
            type: "multiple-choice",
            options: [
                "Missing semicolon",
                "SQL injection vulnerability",
                "Wrong table name",
                "Missing import statement"
            ],
            correctAnswer: 1,
            explanation: "String concatenation with user input allows SQL injection. Always use parameterized queries!",
            hints: ["User input is concatenated directly.", "Allows malicious SQL.", "The answer is: SQL injection vulnerability."]
        },
        {
            id: 13,
            question: "What does the DISTINCT keyword do?",
            type: "multiple-choice",
            options: [
                "Deletes duplicate records",
                "Shows only unique values in results",
                "Counts unique values",
                "Sorts results alphabetically"
            ],
            correctAnswer: 1,
            explanation: "DISTINCT removes duplicate rows from query results.",
            hints: ["Removes duplicates.", "In query results, not in table.", "The answer is: Shows only unique values in results."]
        },
        {
            id: 14,
            question: "Write a query to find all students who have no enrollments. Use LEFT JOIN.",
            type: "sql-query",
            correctAnswer: "SELECT s.name FROM students s LEFT JOIN enrollments e ON s.id = e.student_id WHERE e.id IS NULL",
            keywords: ["SELECT", "name", "students", "LEFT JOIN", "enrollments", "WHERE", "IS NULL"],
            explanation: "LEFT JOIN includes all students, WHERE IS NULL finds those without enrollments.",
            hints: [
                "LEFT JOIN to include all students.",
                "Check for NULL in enrollments table.",
                "WHERE e.id IS NULL finds students without enrollments."
            ]
        },
        {
            id: 15,
            question: "In a transaction, what does ROLLBACK do?",
            type: "multiple-choice",
            options: [
                "Saves all changes permanently",
                "Cancels all changes since BEGIN",
                "Deletes the database",
                "Creates a backup"
            ],
            correctAnswer: 1,
            explanation: "ROLLBACK undoes all changes made during the transaction.",
            hints: ["Reverses changes.", "Like an undo button.", "The answer is: Cancels all changes since BEGIN."]
        }
    ],
    advanced: [
        {
            id: 1,
            question: "Write a query showing each teacher's name, course count, and average grade of all students in their courses. Only include teachers with courses that have enrolled students. Sort by average grade descending.",
            type: "sql-query",
            correctAnswer: "SELECT t.name, COUNT(DISTINCT c.id) as course_count, AVG(e.grade) as avg_grade FROM teachers t INNER JOIN courses c ON t.id = c.teacher_id INNER JOIN enrollments e ON c.id = e.course_id WHERE e.grade IS NOT NULL GROUP BY t.id, t.name ORDER BY avg_grade DESC",
            keywords: ["SELECT", "teachers", "courses", "enrollments", "INNER JOIN", "COUNT", "AVG", "GROUP BY", "ORDER BY", "DESC"],
            explanation: "Join three tables, use aggregate functions with GROUP BY, filter NULL grades, sort by average.",
            hints: [
                "Join teachers → courses → enrollments.",
                "Use COUNT(DISTINCT c.id) and AVG(e.grade).",
                "GROUP BY t.id, t.name and ORDER BY avg_grade DESC."
            ]
        },
        {
            id: 2,
            question: "You need to transfer a student from one course to another. Which SQL feature ensures both operations succeed together or both fail?",
            type: "multiple-choice",
            options: ["Foreign Keys", "Indexes", "Transactions", "Views"],
            correctAnswer: 2,
            explanation: "Use transactions! BEGIN, DELETE old enrollment, INSERT new enrollment, then COMMIT or ROLLBACK.",
            hints: ["All-or-nothing operations.", "ACID properties.", "The answer is: Transactions."]
        },
        {
            id: 3,
            question: "You frequently search for students by email. The students table has 100,000 records. What should you do?",
            type: "multiple-choice",
            options: [
                "Use SELECT * instead of specific columns",
                "Create an index on the email column",
                "Delete old records",
                "Use LIMIT 10"
            ],
            correctAnswer: 1,
            explanation: "Creating an index dramatically improves search performance on frequently-queried columns.",
            hints: ["Speeds up searches.", "Common for frequently-queried columns.", "The answer is: Create an index on the email column."]
        },
        {
            id: 4,
            question: "Write a query to find students whose average grade is higher than the overall average. Show student name and their average.",
            type: "sql-query",
            correctAnswer: "SELECT s.name, AVG(e.grade) as student_avg FROM students s INNER JOIN enrollments e ON s.id = e.student_id WHERE e.grade IS NOT NULL GROUP BY s.id, s.name HAVING AVG(e.grade) > (SELECT AVG(grade) FROM enrollments WHERE grade IS NOT NULL)",
            keywords: ["SELECT", "AVG", "students", "enrollments", "GROUP BY", "HAVING", "subquery"],
            explanation: "Subquery calculates overall average, HAVING compares each student's average to it.",
            hints: [
                "Use a subquery in HAVING clause.",
                "Subquery: (SELECT AVG(grade) FROM enrollments WHERE grade IS NOT NULL)",
                "HAVING AVG(e.grade) > (subquery)"
            ]
        },
        {
            id: 5,
            question: "A table has millions of rows. Which query is more efficient for finding names starting with 'John'?",
            type: "multiple-choice",
            options: [
                "WHERE name LIKE '%John%'",
                "WHERE name LIKE 'John%'",
                "WHERE name = 'John'",
                "They're equally efficient"
            ],
            correctAnswer: 1,
            explanation: "'John%' can use an index. '%John%' cannot and must scan all rows.",
            hints: ["Leading wildcard prevents index use.", "Trailing wildcard can use index.", "The answer is: WHERE name LIKE 'John%'"]
        },
        {
            id: 6,
            question: "Write a query to find pairs of students in the same grade. Show both names and grade. Avoid duplicate pairs.",
            type: "sql-query",
            correctAnswer: "SELECT s1.name as student1, s2.name as student2, s1.grade_level FROM students s1 INNER JOIN students s2 ON s1.grade_level = s2.grade_level WHERE s1.id < s2.id ORDER BY s1.grade_level",
            keywords: ["SELECT", "students", "INNER JOIN", "ON", "WHERE", "self-join"],
            explanation: "Self-join using table aliases. WHERE s1.id < s2.id prevents duplicate pairs.",
            hints: [
                "Self-join: join students to itself with aliases.",
                "ON s1.grade_level = s2.grade_level",
                "WHERE s1.id < s2.id avoids duplicates."
            ]
        },
        {
            id: 7,
            question: "Why does this query error? SELECT students.name, courses.course_name FROM students INNER JOIN courses ON students.id = courses.student_id;",
            type: "multiple-choice",
            options: [
                "Missing WHERE clause",
                "Wrong JOIN condition (students and courses aren't directly related)",
                "Should use LEFT JOIN",
                "Syntax error"
            ],
            correctAnswer: 1,
            explanation: "Students and courses connect through enrollments table (many-to-many relationship).",
            hints: ["Tables aren't directly related.", "Need enrollments as junction table.", "The answer is: Wrong JOIN condition."]
        },
        {
            id: 8,
            question: "User enters: ' OR '1'='1 as search input. What happens with string concatenation instead of parameterized queries?",
            type: "multiple-choice",
            options: [
                "Nothing, it's fine",
                "Syntax error",
                "SQL injection - query returns all records",
                "Database crashes"
            ],
            correctAnswer: 2,
            explanation: "The condition '1'='1' is always true, returning all records. This is SQL injection!",
            hints: ["Malicious input alters query logic.", "'1'='1' is always true.", "The answer is: SQL injection - query returns all records."]
        },
        {
            id: 9,
            question: "Write a query to find teachers who have at least one course with enrolled students. Use EXISTS.",
            type: "sql-query",
            correctAnswer: "SELECT name FROM teachers WHERE EXISTS (SELECT 1 FROM courses INNER JOIN enrollments ON courses.id = enrollments.course_id WHERE courses.teacher_id = teachers.id)",
            keywords: ["SELECT", "teachers", "EXISTS", "courses", "enrollments", "WHERE"],
            explanation: "EXISTS checks if subquery returns any rows. Correlated subquery links to outer query.",
            hints: [
                "Use EXISTS with a correlated subquery.",
                "Subquery joins courses and enrollments.",
                "WHERE courses.teacher_id = teachers.id correlates to outer query."
            ]
        },
        {
            id: 10,
            question: "You have a slow query. What should you do FIRST to diagnose the problem?",
            type: "multiple-choice",
            options: [
                "Add more indexes everywhere",
                "Use EXPLAIN to see the execution plan",
                "Rewrite with subqueries",
                "Delete old data"
            ],
            correctAnswer: 1,
            explanation: "Always EXPLAIN first! It shows how MySQL executes the query and where bottlenecks are.",
            hints: ["Analyze before optimizing.", "Shows execution plan.", "The answer is: Use EXPLAIN."]
        },
        {
            id: 11,
            question: "Write a query showing enrollments with student name, course name, grade, and a status column ('Excellent' if >= 90, 'Good' if >= 75, 'Needs Improvement' if < 75, 'Not Graded' if NULL).",
            type: "sql-query",
            correctAnswer: "SELECT s.name, c.course_name, e.grade, CASE WHEN e.grade IS NULL THEN 'Not Graded' WHEN e.grade >= 90 THEN 'Excellent' WHEN e.grade >= 75 THEN 'Good' ELSE 'Needs Improvement' END as status FROM enrollments e INNER JOIN students s ON e.student_id = s.id INNER JOIN courses c ON e.course_id = c.id",
            keywords: ["SELECT", "CASE", "WHEN", "THEN", "END", "students", "courses", "enrollments", "INNER JOIN"],
            explanation: "CASE creates conditional logic. Check IS NULL first, then thresholds.",
            hints: [
                "Use CASE WHEN ... THEN ... END.",
                "Check IS NULL first in CASE statement.",
                "Join three tables for complete data."
            ]
        },
        {
            id: 12,
            question: "Enrollments table has foreign keys on both student_id and course_id. Most queries join to both tables. What index would help most?",
            type: "multiple-choice",
            options: [
                "Index on grade column",
                "Index on enrollment_date",
                "Composite index on (student_id, course_id)",
                "No index needed"
            ],
            correctAnswer: 2,
            explanation: "Composite index on both foreign keys optimizes queries using both in joins.",
            hints: ["Both columns used in joins.", "Composite index covers both.", "The answer is: Composite index on (student_id, course_id)."]
        },
        {
            id: 13,
            question: "Write a query combining all names (students and teachers) with their role ('Student' or 'Teacher'). Sort by name.",
            type: "sql-query",
            correctAnswer: "SELECT name, 'Student' AS role FROM students UNION SELECT name, 'Teacher' AS role FROM teachers ORDER BY name",
            keywords: ["SELECT", "UNION", "ORDER BY", "students", "teachers"],
            explanation: "UNION combines results from both tables. ORDER BY applies to final result.",
            hints: [
                "Use UNION to combine two SELECT statements.",
                "Add role column with literal values.",
                "ORDER BY goes at the end, outside UNION."
            ]
        },
        {
            id: 14,
            question: "Database crashes during a transaction before COMMIT. What happens to inserted data?",
            type: "multiple-choice",
            options: [
                "Data remains in database",
                "Data is automatically committed",
                "Data is lost (rolled back automatically)",
                "Database is corrupted"
            ],
            correctAnswer: 2,
            explanation: "Uncommitted transactions are automatically rolled back on crash. This is ACID Atomicity.",
            hints: ["ACID properties protect data.", "No COMMIT = no permanent changes.", "The answer is: Data is lost (rolled back automatically)."]
        },
        {
            id: 15,
            question: "Create a grade report: students with courses, grades, and difference from course average. Show 'Pending' if no grade yet.",
            type: "sql-query",
            correctAnswer: "SELECT s.name, c.course_name, CASE WHEN e.grade IS NULL THEN 'Pending' ELSE CAST(e.grade AS CHAR) END as grade, CASE WHEN e.grade IS NULL THEN 'N/A' ELSE CONCAT(ROUND(e.grade - (SELECT AVG(grade) FROM enrollments e2 WHERE e2.course_id = e.course_id AND e2.grade IS NOT NULL), 2), ' points') END as diff_from_avg FROM students s LEFT JOIN enrollments e ON s.id = e.student_id LEFT JOIN courses c ON e.course_id = c.id ORDER BY s.name",
            keywords: ["SELECT", "CASE", "LEFT JOIN", "subquery", "AVG", "CONCAT", "ROUND"],
            explanation: "Complex query using LEFT JOIN, CASE, correlated subquery for course average, and proper NULL handling.",
            hints: [
                "Use LEFT JOIN to include all students.",
                "CASE for conditional display.",
                "Correlated subquery: (SELECT AVG(grade) FROM enrollments WHERE course_id = e.course_id)"
            ]
        }
    ]
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXERCISES;
}
