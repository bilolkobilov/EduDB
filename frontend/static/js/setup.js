/**
 * Setup Page JavaScript
 * Handles database connection testing and automatic setup
 */

// State
let connectionTested = false;
let lastPasswordUsed = '';

// Elements
const passwordInput = document.getElementById('auto-password');
const testConnectionBtn = document.getElementById('test-connection-btn');
const createDatabaseBtn = document.getElementById('create-database-btn');
const connectionResult = document.getElementById('connection-result');
const setupProgress = document.getElementById('setup-progress');
const progressList = document.getElementById('progress-list');
const setupSuccess = document.getElementById('setup-success');
const helpToggle = document.getElementById('help-toggle');
const helpContent = document.getElementById('help-content');
const connectionStatus = document.getElementById('connection-status');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const statusDetail = document.getElementById('status-detail');
const refreshStatusBtn = document.getElementById('refresh-status-btn');

// Update connection status indicator
async function updateConnectionStatus(password = null) {
    // Update UI to checking state
    connectionStatus.className = 'mb-6 p-4 rounded-lg border-2 transition-all border-gray-300 bg-gray-50';
    statusDot.className = 'w-3 h-3 rounded-full mr-3 animate-pulse bg-gray-400';
    statusText.textContent = 'Checking connection...';
    statusDetail.textContent = 'Verifying MySQL connection status';
    
    try {
        // First, check if database already exists and is accessible
        const dbStatusResponse = await fetch('/api/check-database-status');
        const dbStatusData = await dbStatusResponse.json();
        
        if (dbStatusData.connected) {
            // Database exists and is accessible
            connectionStatus.className = 'mb-6 p-4 rounded-lg border-2 transition-all border-green-300 bg-green-50';
            statusDot.className = 'w-3 h-3 rounded-full mr-3 bg-green-500';
            statusText.textContent = '✓ MySQL Connected';
            statusDetail.textContent = `Database 'edudb' is ready with ${dbStatusData.table_count} tables`;
            return;
        }
        
        // If database doesn't exist, test connection with password if provided
        if (password) {
            const response = await fetch('/api/test-connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    host: 'localhost',
                    user: 'root',
                    password: password,
                    port: 3306
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Connected
                connectionStatus.className = 'mb-6 p-4 rounded-lg border-2 transition-all border-green-300 bg-green-50';
                statusDot.className = 'w-3 h-3 rounded-full mr-3 bg-green-500';
                statusText.textContent = '✓ MySQL Connected';
                statusDetail.textContent = 'MySQL server ready - database needs setup';
                
                connectionTested = true;
                lastPasswordUsed = password;
                createDatabaseBtn.disabled = false;
            } else {
                // Not connected
                connectionStatus.className = 'mb-6 p-4 rounded-lg border-2 transition-all border-red-300 bg-red-50';
                statusDot.className = 'w-3 h-3 rounded-full mr-3 bg-red-500';
                statusText.textContent = '✗ MySQL Not Connected';
                statusDetail.textContent = data.message;
                connectionTested = false;
                createDatabaseBtn.disabled = true;
            }
        } else {
            // No password provided and database doesn't exist
            connectionStatus.className = 'mb-6 p-4 rounded-lg border-2 transition-all border-yellow-300 bg-yellow-50';
            statusDot.className = 'w-3 h-3 rounded-full mr-3 bg-yellow-500';
            statusText.textContent = '⚠ Database Not Set Up';
            statusDetail.textContent = 'Enter MySQL password to test connection and create database';
            connectionTested = false;
            createDatabaseBtn.disabled = true;
        }
    } catch (error) {
        // Error state
        connectionStatus.className = 'mb-6 p-4 rounded-lg border-2 transition-all border-red-300 bg-red-50';
        statusDot.className = 'w-3 h-3 rounded-full mr-3 bg-red-500';
        statusText.textContent = '✗ Connection Error';
        statusDetail.textContent = 'Unable to reach MySQL server';
        connectionTested = false;
        createDatabaseBtn.disabled = true;
    }
}

// Check connection status on page load
updateConnectionStatus();

// Refresh status button
refreshStatusBtn.addEventListener('click', () => {
    updateConnectionStatus(lastPasswordUsed || passwordInput.value);
});

// Test database connection
testConnectionBtn.addEventListener('click', async () => {
    const password = passwordInput.value;
    
    if (!password) {
        showMessage(connectionResult, 'error', 'Please enter your MySQL root password');
        return;
    }
    
    // Show loading state
    testConnectionBtn.disabled = true;
    testConnectionBtn.innerHTML = '<div class="spinner inline-block"></div> Testing...';
    
    try {
        const response = await fetch('/api/test-connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                host: 'localhost',
                user: 'root',
                password: password,
                port: 3306
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(connectionResult, 'success', '✓ Connection successful!');
            connectionTested = true;
            lastPasswordUsed = password;
            createDatabaseBtn.disabled = false;
            await updateConnectionStatus(password);
        } else {
            showMessage(connectionResult, 'error', '✗ ' + data.message);
            connectionTested = false;
            createDatabaseBtn.disabled = true;
            await updateConnectionStatus(password);
        }
    } catch (error) {
        showMessage(connectionResult, 'error', '✗ Connection failed: ' + error.message);
        connectionTested = false;
        createDatabaseBtn.disabled = true;
        await updateConnectionStatus(password);
    } finally {
        testConnectionBtn.disabled = false;
        testConnectionBtn.textContent = 'Test Connection';
    }
});

// Create database automatically
createDatabaseBtn.addEventListener('click', async () => {
    if (!connectionTested) {
        showMessage(connectionResult, 'error', 'Please test connection first');
        return;
    }
    
    const password = passwordInput.value;
    
    // Show progress
    setupProgress.classList.remove('hidden');
    progressList.innerHTML = '';
    createDatabaseBtn.disabled = true;
    createDatabaseBtn.textContent = 'Creating Database...';
    
    const steps = [
        'Creating database edudb...',
        'Creating students table...',
        'Creating teachers table...',
        'Creating courses table...',
        'Creating enrollments table...',
        'Inserting sample data into students...',
        'Inserting sample data into teachers...',
        'Inserting sample data into courses...',
        'Inserting sample data into enrollments...',
        'Setup complete!'
    ];
    
    // Simulate progress (since we can't track individual SQL statements)
    for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        addProgressStep(steps[i]);
    }
    
    try {
        const response = await fetch('/api/create-database', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                host: 'localhost',
                user: 'root',
                password: password,
                port: 3306
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            setupSuccess.classList.remove('hidden');
        } else {
            showMessage(connectionResult, 'error', 'Setup failed: ' + data.message);
            setupProgress.classList.add('hidden');
        }
    } catch (error) {
        showMessage(connectionResult, 'error', 'Setup failed: ' + error.message);
        setupProgress.classList.add('hidden');
    } finally {
        createDatabaseBtn.textContent = 'Create Database Automatically';
    }
});

// Helper: Show message
function showMessage(element, type, message) {
    element.classList.remove('hidden');
    
    if (type === 'success') {
        element.className = 'mt-3 bg-green-50 border border-green-200 text-green-800 p-3 rounded text-sm';
    } else {
        element.className = 'mt-3 bg-red-50 border border-red-200 text-red-800 p-3 rounded text-sm';
    }
    
    element.textContent = message;
}

// Helper: Add progress step
function addProgressStep(step) {
    const div = document.createElement('div');
    div.className = 'flex items-center text-green-600';
    div.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
        </svg>
        <span>${step}</span>
    `;
    progressList.appendChild(div);
}

// Help toggle
helpToggle.addEventListener('click', () => {
    helpContent.classList.toggle('hidden');
    const svg = helpToggle.querySelector('svg');
    svg.classList.toggle('rotate-180');
});

// Copy button functionality
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span class="text-green-400">✓</span>';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        });
    });
});
