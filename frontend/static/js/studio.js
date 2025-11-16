/**
 * Studio Page JavaScript
 * Handles all interactive database learning functionality
 */

// State
let currentModule = 1;
let currentTable = 'students';
let tableData = {};
let currentRecord = null;

// Load initial data
document.addEventListener('DOMContentLoaded', () => {
    loadModule(1);
    loadTableData('students');
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Content tabs (Database Basics, Python, SQL, Output)
    document.querySelectorAll('.content-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchContentTab(tab.dataset.tab);
        });
    });
    
    // Close live coding button
    document.getElementById('close-live-coding').addEventListener('click', () => {
        closeLiveCoding();
    });
    
    // Table tabs
    document.querySelectorAll('.table-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const table = tab.dataset.table;
            switchTable(table);
        });
    });
    
    // Module navigation
    document.getElementById('prev-module').addEventListener('click', () => {
        if (currentModule > 1) {
            loadModule(currentModule - 1);
        }
    });
    
    document.getElementById('next-module').addEventListener('click', () => {
        if (currentModule < 15) {
            loadModule(currentModule + 1);
        }
    });
    
    // Action buttons
    document.getElementById('add-record-btn').addEventListener('click', () => {
        openAddRecordModal();
    });
    
    document.getElementById('reset-db-btn').addEventListener('click', () => {
        resetDatabase();
    });
    
    // Modal buttons
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-save').addEventListener('click', saveRecord);
    
    // Copy buttons
    document.querySelector('.copy-code-btn').addEventListener('click', () => {
        copyToClipboard(document.querySelector('#python-code code').textContent);
    });
    
    document.querySelector('.copy-sql-btn').addEventListener('click', () => {
        copyToClipboard(document.querySelector('#sql-query code').textContent);
    });
}

// Switch content tab
function switchContentTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.content-tab').forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active', 'border-b-2', 'border-purple-600', 'text-purple-600');
            tab.classList.remove('text-gray-600');
        } else {
            tab.classList.remove('active', 'border-b-2', 'border-purple-600', 'text-purple-600');
            tab.classList.add('text-gray-600');
        }
    });
    
    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `tab-${tabName}`) {
            content.classList.remove('hidden');
            content.classList.add('active');
        } else {
            content.classList.add('hidden');
            content.classList.remove('active');
        }
    });
}

// Close live coding display (hide X button and switch back to Database Basics)
function closeLiveCoding() {
    // Hide close button
    document.getElementById('close-live-coding').classList.add('hidden');
    
    // Hide operation labels
    document.getElementById('python-operation-label').classList.add('hidden');
    document.getElementById('sql-operation-label').classList.add('hidden');
    
    // Switch back to Database Basics tab
    switchContentTab('explanation');
}

// Load module content
function loadModule(moduleId) {
    currentModule = moduleId;
    const module = MODULES[moduleId - 1];
    
    // Update progress
    document.getElementById('current-module-title').textContent = 
        `Module ${moduleId} of 15: ${module.title}`;
    document.getElementById('progress-bar').style.width = `${(moduleId / 15) * 100}%`;
    
    // Update explanation
    document.getElementById('explanation-title').textContent = module.title;
    document.getElementById('explanation-content').innerHTML = module.explanation;
    
    // Update navigation buttons
    document.getElementById('prev-module').disabled = moduleId === 1;
    document.getElementById('next-module').disabled = moduleId === 15;
    
    // Add interactive buttons if available
    if (module.interactiveButtons && module.interactiveButtons.length > 0) {
        const buttonsHTML = module.interactiveButtons.map(btn => `
            <button class="module-action-btn bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition mr-2 mb-2"
                    data-action="${btn.action}"
                    data-table="${btn.table || ''}"
                    data-query="${btn.query || ''}"
                    data-message="${btn.message || ''}">
                ${btn.label}
            </button>
        `).join('');
        
        document.getElementById('explanation-content').innerHTML += `
            <div class="mt-4 pt-4 border-t">
                <h4 class="font-bold mb-2">Try It:</h4>
                ${buttonsHTML}
            </div>
        `;
        
        // Add event listeners to new buttons
        document.querySelectorAll('.module-action-btn').forEach(btn => {
            btn.addEventListener('click', handleModuleAction);
        });
    }
}

// Handle module interactive actions
async function handleModuleAction(e) {
    const action = e.target.dataset.action;
    const table = e.target.dataset.table;
    const query = e.target.dataset.query;
    const message = e.target.dataset.message;
    
    switch(action) {
        case 'viewTable':
            switchTable(table);
            break;
        case 'viewAllTables':
            showAllTables();
            break;
        case 'testConnection':
            await testConnection();
            break;
        case 'showConnectionCode':
            showConnectionCode();
            break;
        case 'viewTableStructure':
            await viewTableStructure(table);
            break;
        case 'executeQuery':
            await executeCustomQuery(query);
            break;
        case 'showMessage':
            showToast('info', message);
            break;
    }
}

// Switch table
async function switchTable(tableName) {
    currentTable = tableName;
    
    // Update tab styling
    document.querySelectorAll('.table-tab').forEach(tab => {
        if (tab.dataset.table === tableName) {
            tab.classList.add('active', 'border-b-2', 'border-blue-600', 'text-blue-600');
            tab.classList.remove('text-gray-600');
        } else {
            tab.classList.remove('active', 'border-b-2', 'border-blue-600', 'text-blue-600');
            tab.classList.add('text-gray-600');
        }
    });
    
    await loadTableData(tableName);
}

// Load table data
async function loadTableData(tableName, skipCodeUpdate = false) {
    const container = document.getElementById('table-container');
    container.innerHTML = '<div class="text-center py-8"><div class="spinner mx-auto mb-3"></div><p class="text-gray-500">Loading...</p></div>';
    
    try {
        const response = await fetch(`/api/tables/${tableName}`);
        const data = await response.json();
        
        if (data.success) {
            tableData[tableName] = data.data;
            renderTable(tableName, data.data);
            
            // Only update code if skipCodeUpdate is false (not in live coding mode)
            if (!skipCodeUpdate) {
                // Show SQL query
                showSQL(`SELECT * FROM ${tableName};`);
                showPythonCode('SELECT', tableName);
                
                // Show result
                document.getElementById('output-result').innerHTML = `
                    <div class="bg-green-50 border border-green-200 p-3 rounded">
                        <p class="text-green-800 font-semibold">✓ Query executed successfully</p>
                        <p class="text-sm text-gray-600 mt-1">Retrieved ${data.data.length} records from ${tableName} table</p>
                    </div>
                `;
            }
        } else {
            // Check if database is missing
            if (data.database_missing) {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 mx-auto text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Database Not Setup</h3>
                        <p class="text-gray-600 mb-4">The database hasn't been created yet.</p>
                        <a href="/setup" class="inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition">
                            Go to Setup Page
                        </a>
                    </div>
                `;
            } else {
                container.innerHTML = `<p class="text-red-600">Error loading table: ${data.error}</p>`;
            }
        }
    } catch (error) {
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-red-600 mb-4">Error: ${error.message}</p>
                <a href="/setup" class="inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition">
                    Setup Database
                </a>
            </div>
        `;
    }
}

// Render table
function renderTable(tableName, data) {
    if (!data || data.length === 0) {
        document.getElementById('table-container').innerHTML = 
            '<p class="text-gray-500 text-center py-8">No records found</p>';
        return;
    }
    
    const columns = Object.keys(data[0]);
    const columnWidths = columns.map(col => {
        const maxWidth = Math.max(
            col.length,
            ...data.map(row => String(row[col] || '').length)
        );
        return Math.min(maxWidth * 8 + 20, 200);
    });
    
    let html = `
        <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
                <thead class="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                        ${columns.map((col, i) => `
                            <th class="px-3 py-2 text-left font-semibold text-gray-700" style="min-width: ${columnWidths[i]}px">
                                ${col}
                            </th>
                        `).join('')}
                        <th class="px-3 py-2 text-center font-semibold text-gray-700" style="min-width: 120px">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.forEach(row => {
        html += '<tr class="border-b hover:bg-gray-50 table-row">';
        columns.forEach(col => {
            let value = row[col];
            if (value === null) {
                value = '<span class="text-gray-400 italic">NULL</span>';
            } else if (typeof value === 'string' && value.length > 30) {
                value = value.substring(0, 30) + '...';
            }
            html += `<td class="px-3 py-2">${value}</td>`;
        });
        html += `
            <td class="px-3 py-2 text-center">
                <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 mr-1"
                        data-id="${row.id}">
                    Edit
                </button>
                <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        data-id="${row.id}">
                    Delete
                </button>
            </td>
        `;
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    
    document.getElementById('table-container').innerHTML = html;
    
    // Add event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            openEditModal(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            deleteRecord(id);
        });
    });
}

// Open edit modal
function openEditModal(id) {
    const record = tableData[currentTable].find(r => r.id === id);
    if (!record) return;
    
    currentRecord = record;
    document.getElementById('modal-title').textContent = `Edit ${currentTable.slice(0, -1)}`;
    
    const fields = Object.keys(record).filter(key => key !== 'id');
    let formHTML = '';
    
    fields.forEach(field => {
        formHTML += `
            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-1">${field}:</label>
                <input type="text" 
                       id="field-${field}" 
                       value="${record[field] || ''}"
                       class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
            </div>
        `;
    });
    
    document.getElementById('modal-body').innerHTML = formHTML;
    document.getElementById('record-modal').classList.remove('hidden');
}

// Open add record modal
function openAddRecordModal() {
    currentRecord = null;
    document.getElementById('modal-title').textContent = `Add New ${currentTable.slice(0, -1)}`;
    
    // Get template fields from first record or define defaults
    const sampleRecord = tableData[currentTable][0];
    const fields = Object.keys(sampleRecord).filter(key => key !== 'id');
    
    let formHTML = '';
    fields.forEach(field => {
        formHTML += `
            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-1">${field}:</label>
                <input type="text" 
                       id="field-${field}" 
                       placeholder="Enter ${field}"
                       class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
            </div>
        `;
    });
    
    document.getElementById('modal-body').innerHTML = formHTML;
    document.getElementById('record-modal').classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('record-modal').classList.add('hidden');
    currentRecord = null;
}

// Save record (edit or add)
async function saveRecord() {
    const fields = document.querySelectorAll('#modal-body input');
    const data = {};
    
    fields.forEach(field => {
        const fieldName = field.id.replace('field-', '');
        let value = field.value.trim();
        
        // Convert empty strings to null
        if (value === '') {
            value = null;
        }
        // Try to parse numbers
        else if (!isNaN(value) && value !== '') {
            value = parseFloat(value);
        }
        
        data[fieldName] = value;
    });
    
    try {
        let response;
        if (currentRecord) {
            // Update existing record
            response = await fetch(`/api/tables/${currentTable}/${currentRecord.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            if (result.success) {
                showToast('success', 'Record updated successfully!');
                
                // Show code without auto-switching, just update content and show close button
                showCodeForOperation('UPDATE', currentTable, data, currentRecord.id);
            } else {
                showToast('error', 'Update failed: ' + result.error);
            }
        } else {
            // Insert new record
            response = await fetch(`/api/tables/${currentTable}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            if (result.success) {
                showToast('success', `New record added! ID: ${result.id}`);
                
                // Show code without auto-switching, just update content and show close button
                showCodeForOperation('INSERT', currentTable, data);
            } else {
                showToast('error', 'Insert failed: ' + result.error);
            }
        }
        
        closeModal();
        await loadTableData(currentTable, true); // Skip code update to preserve live coding
    } catch (error) {
        showToast('error', 'Error: ' + error.message);
    }
}

// Delete record
async function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this record? This cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/tables/${currentTable}/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
            showToast('success', 'Record deleted successfully');
            
            // Show code without auto-switching, just update content and show close button
            showCodeForOperation('DELETE', currentTable, null, id);
            
            await loadTableData(currentTable, true); // Skip code update to preserve live coding
        } else {
            showToast('error', 'Delete failed: ' + result.error);
        }
    } catch (error) {
        showToast('error', 'Error: ' + error.message);
    }
}

// Reset database
async function resetDatabase() {
    if (!confirm('Reset database to original sample data? This will delete all changes!')) {
        return;
    }
    
    try {
        const response = await fetch('/api/reset-database', {
            method: 'POST'
        });
        
        const result = await response.json();
        if (result.success) {
            showToast('success', 'Database reset successfully!');
            await loadTableData(currentTable);
        } else {
            showToast('error', 'Reset failed: ' + result.message);
        }
    } catch (error) {
        showToast('error', 'Error: ' + error.message);
    }
}

// Execute custom query (for module demonstrations)
async function executeCustomQuery(query) {
    try {
        const response = await fetch('/api/execute-query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        if (result.success) {
            showSQL(query);
            showPythonCode('SELECT', 'custom', null, null, query);
            
            // Display results
            if (result.data.length > 0) {
                const columns = Object.keys(result.data[0]);
                let html = '<div class="overflow-x-auto"><table class="min-w-full text-sm border">';
                html += '<thead class="bg-gray-100"><tr>';
                columns.forEach(col => {
                    html += `<th class="px-3 py-2 text-left font-semibold border">${col}</th>`;
                });
                html += '</tr></thead><tbody>';
                
                result.data.forEach(row => {
                    html += '<tr>';
                    columns.forEach(col => {
                        html += `<td class="px-3 py-2 border">${row[col] !== null ? row[col] : '<span class="text-gray-400 italic">NULL</span>'}</td>`;
                    });
                    html += '</tr>';
                });
                
                html += '</tbody></table></div>';
                document.getElementById('output-result').innerHTML = html;
            } else {
                document.getElementById('output-result').innerHTML = 
                    '<p class="text-gray-500">Query returned no results</p>';
            }
            
            showToast('success', 'Query executed successfully');
        } else {
            showToast('error', 'Query failed: ' + result.error);
        }
    } catch (error) {
        showToast('error', 'Error: ' + error.message);
    }
}

// Show code for operation without auto-switching tabs
function showCodeForOperation(operation, table, data = null, id = null) {
    // Generate and show SQL and Python code
    const sqlQuery = generateSQL(operation, table, data, id);
    showSQL(sqlQuery);
    showPythonCode(operation, table, data, id);
    
    // Create operation label text
    const operationNames = {
        'INSERT': 'Add New Record',
        'UPDATE': 'Edit Record',
        'DELETE': 'Delete Record',
        'SELECT': 'View Records'
    };
    const labelText = `Code for: ${operationNames[operation] || operation} in ${table}`;
    
    // Show operation labels
    document.getElementById('python-operation-label').textContent = labelText;
    document.getElementById('python-operation-label').classList.remove('hidden');
    document.getElementById('sql-operation-label').textContent = labelText;
    document.getElementById('sql-operation-label').classList.remove('hidden');
    
    // Show the close button
    document.getElementById('close-live-coding').classList.remove('hidden');
    
    // Auto-switch to SQL tab to show the live coding
    switchContentTab('sql');
}

// Generate SQL query string
function generateSQL(operation, table, data = null, id = null) {
    switch(operation) {
        case 'SELECT':
            return `SELECT * FROM ${table};`;
        case 'INSERT':
            const insertFields = Object.keys(data).join(', ');
            const insertValues = Object.values(data).map(v => 
                v === null ? 'NULL' : (typeof v === 'string' ? `'${v}'` : v)
            ).join(', ');
            return `INSERT INTO ${table} (${insertFields}) VALUES (${insertValues});`;
        case 'UPDATE':
            const setClause = Object.keys(data).map(k => 
                `${k} = ${data[k] === null ? 'NULL' : (typeof data[k] === 'string' ? `'${data[k]}'` : data[k])}`
            ).join(', ');
            return `UPDATE ${table} SET ${setClause} WHERE id = ${id};`;
        case 'DELETE':
            return `DELETE FROM ${table} WHERE id = ${id};`;
        default:
            return '';
    }
}

// Show Python code
function showPythonCode(operation, table, data = null, id = null, customQuery = null) {
    let code = `import mysql.connector

# Connect to database
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='your_password',
    database='edudb'
)
cursor = connection.cursor(dictionary=True)

`;

    if (customQuery) {
        code += `# Execute custom query
query = "${customQuery}"
cursor.execute(query)
results = cursor.fetchall()

for row in results:
    print(row)
`;
    } else {
        switch(operation) {
            case 'SELECT':
                code += `# Retrieve all records from ${table}
query = "SELECT * FROM ${table}"
cursor.execute(query)
results = cursor.fetchall()

for row in results:
    print(row)
`;
                break;
            case 'INSERT':
                const insertFields = Object.keys(data).join(', ');
                const placeholders = Object.keys(data).map(() => '%s').join(', ');
                code += `# Insert new record into ${table}
query = "INSERT INTO ${table} (${insertFields}) VALUES (${placeholders})"
values = (${Object.values(data).map(v => `'${v}'`).join(', ')})
cursor.execute(query, values)
connection.commit()

print(f"Record inserted with ID: {cursor.lastrowid}")
`;
                break;
            case 'UPDATE':
                const setClause = Object.keys(data).map(k => `${k} = %s`).join(', ');
                code += `# Update record in ${table}
query = "UPDATE ${table} SET ${setClause} WHERE id = %s"
values = (${Object.values(data).map(v => `'${v}'`).join(', ')}, ${id})
cursor.execute(query, values)
connection.commit()

print(f"{cursor.rowcount} record(s) updated")
`;
                break;
            case 'DELETE':
                code += `# Delete record from ${table}
query = "DELETE FROM ${table} WHERE id = %s"
cursor.execute(query, (${id},))
connection.commit()

print(f"{cursor.rowcount} record(s) deleted")
`;
                break;
        }
    }

    code += `
# Close connection
cursor.close()
connection.close()`;

    document.querySelector('#python-code code').textContent = code;
    hljs.highlightElement(document.querySelector('#python-code code'));
}

// Show SQL query
function showSQL(query) {
    document.querySelector('#sql-query code').textContent = query;
    hljs.highlightElement(document.querySelector('#sql-query code'));
}

// Show toast notification
function showToast(type, message) {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-message');
    
    let iconHTML = '';
    let bgColor = '';
    
    if (type === 'success') {
        iconHTML = '<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>';
        bgColor = 'bg-green-50 border border-green-200';
    } else if (type === 'error') {
        iconHTML = '<svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/></svg>';
        bgColor = 'bg-red-50 border border-red-200';
    } else {
        iconHTML = '<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/></svg>';
        bgColor = 'bg-blue-50 border border-blue-200';
    }
    
    icon.innerHTML = iconHTML;
    msg.textContent = message;
    toast.className = `fixed top-20 right-6 shadow-lg rounded-lg p-4 z-50 toast max-w-sm ${bgColor}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('success', 'Copied to clipboard!');
    }).catch(err => {
        showToast('error', 'Failed to copy');
    });
}

// Test connection
async function testConnection() {
    showToast('info', 'Testing connection...');
    // Simulated connection test
    setTimeout(() => {
        showToast('success', 'Connection successful!');
        showPythonCode('SELECT', 'students');
    }, 1000);
}

// Show connection code
function showConnectionCode() {
    const code = `import mysql.connector

# Create connection
connection = mysql.connector.connect(
    host='localhost',
    port=3306,
    user='root',
    password='your_password',
    database='edudb'
)

# Test if connected
if connection.is_connected():
    print("Successfully connected to MySQL!")
    db_info = connection.get_server_info()
    print(f"MySQL Server version: {db_info}")
    
# Always close the connection
connection.close()
print("Connection closed")`;
    
    document.querySelector('#python-code code').textContent = code;
    hljs.highlightElement(document.querySelector('#python-code code'));
    
    showSQL('-- Connection test - No SQL query needed');
    
    document.getElementById('output-result').innerHTML = `
        <div class="bg-green-50 border border-green-200 p-3 rounded">
            <p class="text-green-800 font-semibold">✓ Connection Details</p>
            <ul class="text-sm text-gray-700 mt-2 space-y-1">
                <li><strong>Host:</strong> localhost</li>
                <li><strong>Port:</strong> 3306</li>
                <li><strong>Database:</strong> edudb</li>
                <li><strong>Status:</strong> Connected</li>
            </ul>
        </div>
    `;
}

// View table structure
async function viewTableStructure(tableName) {
    showSQL(`DESCRIBE ${tableName};`);
    showPythonCode('SELECT', tableName);
    
    // Simulated structure view
    document.getElementById('output-result').innerHTML = `
        <div class="text-sm">
            <h4 class="font-bold mb-2">${tableName} Table Structure:</h4>
            <p class="text-gray-600">Use the table tabs above to see the actual data structure.</p>
        </div>
    `;
    showToast('info', `Viewing ${tableName} structure`);
}

// Show all tables
function showAllTables() {
    showSQL('SHOW TABLES;');
    
    const code = `import mysql.connector

connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='your_password',
    database='edudb'
)
cursor = connection.cursor()

# Show all tables
cursor.execute("SHOW TABLES")
tables = cursor.fetchall()

print("Tables in edudb:")
for table in tables:
    print(f"  - {table[0]}")

cursor.close()
connection.close()`;
    
    document.querySelector('#python-code code').textContent = code;
    hljs.highlightElement(document.querySelector('#python-code code'));
    
    document.getElementById('output-result').innerHTML = `
        <div>
            <h4 class="font-bold mb-2">Tables in edudb:</h4>
            <ul class="list-disc pl-6 space-y-1">
                <li>students</li>
                <li>teachers</li>
                <li>courses</li>
                <li>enrollments</li>
            </ul>
        </div>
    `;
}
