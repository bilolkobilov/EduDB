/**
 * Exercises Page JavaScript
 * Handles quiz functionality, scoring, and certificate generation
 */

// State
let currentLevel = '';
let currentQuestionIndex = 0;
let questions = [];
let userAnswers = [];
let score = 0;
let hintsUsed = 0;
let progress = {
    beginner: { score: 0, completed: false },
    intermediate: { score: 0, completed: false },
    advanced: { score: 0, completed: false }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Level selection buttons
    document.querySelectorAll('.start-level-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const level = e.target.dataset.level;
            startLevel(level);
        });
    });
    
    // Quiz buttons
    document.getElementById('submit-answer-btn').addEventListener('click', submitAnswer);
    document.getElementById('hint-btn').addEventListener('click', showHint);
    document.getElementById('skip-btn').addEventListener('click', skipQuestion);
    
    // Results buttons
    document.getElementById('try-again-btn').addEventListener('click', () => {
        startLevel(currentLevel);
    });
    
    document.getElementById('next-level-btn').addEventListener('click', () => {
        const levels = ['beginner', 'intermediate', 'advanced'];
        const nextIndex = levels.indexOf(currentLevel) + 1;
        if (nextIndex < levels.length) {
            startLevel(levels[nextIndex]);
        }
    });
    
    document.getElementById('get-certificate-btn').addEventListener('click', () => {
        document.getElementById('certificate-modal').classList.remove('hidden');
    });
    
    // Certificate modal
    document.getElementById('cancel-certificate').addEventListener('click', () => {
        document.getElementById('certificate-modal').classList.add('hidden');
    });
    
    document.getElementById('generate-certificate').addEventListener('click', generateCertificate);
}

// Load progress from localStorage or API
function loadProgress() {
    const saved = localStorage.getItem('edudb_progress');
    if (saved) {
        progress = JSON.parse(saved);
        updateLevelButtons();
        displayScores();
    }
}

// Save progress
function saveProgress() {
    localStorage.setItem('edudb_progress', JSON.stringify(progress));
    updateLevelButtons();
    displayScores();
}

// Update level button states
function updateLevelButtons() {
    // Beginner always available
    document.querySelector('[data-level="beginner"]').disabled = false;
    
    // Intermediate unlocked if beginner >= 80%
    const intermediateBtn = document.getElementById('intermediate-btn');
    if (progress.beginner.score >= 12) {  // 12/15 = 80%
        intermediateBtn.disabled = false;
        intermediateBtn.textContent = 'Start Intermediate';
        intermediateBtn.classList.remove('bg-blue-400');
        intermediateBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
    }
    
    // Advanced unlocked if intermediate >= 80%
    const advancedBtn = document.getElementById('advanced-btn');
    if (progress.intermediate.score >= 12) {
        advancedBtn.disabled = false;
        advancedBtn.textContent = 'Start Advanced';
        advancedBtn.classList.remove('bg-purple-400');
        advancedBtn.classList.add('bg-purple-600', 'hover:bg-purple-700');
    }
}

// Display scores
function displayScores() {
    if (progress.beginner.score > 0) {
        const elem = document.getElementById('beginner-score');
        elem.classList.remove('hidden');
        elem.querySelector('span:last-child').textContent = `${progress.beginner.score}/15 (${Math.round(progress.beginner.score/15*100)}%)`;
    }
    
    if (progress.intermediate.score > 0) {
        const elem = document.getElementById('intermediate-score');
        elem.classList.remove('hidden');
        elem.querySelector('span:last-child').textContent = `${progress.intermediate.score}/15 (${Math.round(progress.intermediate.score/15*100)}%)`;
    }
    
    if (progress.advanced.score > 0) {
        const elem = document.getElementById('advanced-score');
        elem.classList.remove('hidden');
        elem.querySelector('span:last-child').textContent = `${progress.advanced.score}/15 (${Math.round(progress.advanced.score/15*100)}%)`;
    }
}

// Start a level
function startLevel(level) {
    currentLevel = level;
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    hintsUsed = 0;
    
    // Get questions for this level
    questions = EXERCISES[level];
    
    // Hide level selection, show quiz
    document.getElementById('level-selection').classList.add('hidden');
    document.getElementById('quiz-area').classList.remove('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    
    // Update quiz header
    document.getElementById('current-level').textContent = level.charAt(0).toUpperCase() + level.slice(1);
    document.getElementById('total-q').textContent = questions.length;
    document.getElementById('total-q-score').textContent = questions.length;
    
    // Generate progress tracker
    generateProgressTracker();
    
    // Load first question
    loadQuestion(0);
}

// Generate progress tracker dots
function generateProgressTracker() {
    const tracker = document.getElementById('progress-tracker');
    tracker.innerHTML = '';
    
    for (let i = 0; i < questions.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600';
        dot.textContent = i + 1;
        dot.id = `progress-dot-${i}`;
        tracker.appendChild(dot);
    }
}

// Load a question
function loadQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];
    hintsUsed = 0;
    
    // Update progress
    document.getElementById('current-q').textContent = index + 1;
    document.getElementById('quiz-progress').style.width = `${((index + 1) / questions.length) * 100}%`;
    document.getElementById('current-score').textContent = score;
    document.getElementById('percent-score').textContent = Math.round((score / questions.length) * 100);
    
    // Update progress dots
    document.querySelectorAll('#progress-tracker > div').forEach((dot, i) => {
        if (i < index) {
            // Past questions - show result
            if (userAnswers[i] && userAnswers[i].correct) {
                dot.className = 'w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white';
            } else if (userAnswers[i]) {
                dot.className = 'w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white';
            }
        } else if (i === index) {
            // Current question
            dot.className = 'w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white';
        } else {
            // Future questions
            dot.className = 'w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600';
        }
    });
    
    // Display question
    document.getElementById('question-text').textContent = question.question;
    
    // Clear feedback
    document.getElementById('feedback-area').classList.add('hidden');
    document.getElementById('feedback-area').innerHTML = '';
    
    // Reset hints
    document.getElementById('hints-remaining').textContent = '3';
    document.getElementById('hint-btn').disabled = false;
    
    // Generate answer area based on question type
    const answerArea = document.getElementById('answer-area');
    answerArea.innerHTML = '';
    
    if (question.type === 'multiple-choice') {
        question.options.forEach((option, i) => {
            const div = document.createElement('div');
            div.className = 'mb-3';
            div.innerHTML = `
                <label class="flex items-center p-4 border-2 border-gray-300 rounded cursor-pointer hover:border-blue-500 transition">
                    <input type="radio" name="answer" value="${i}" class="mr-3">
                    <span class="text-gray-800">${option}</span>
                </label>
            `;
            answerArea.appendChild(div);
        });
    } else if (question.type === 'fill-in-blank' || question.type === 'sql-query') {
        const textarea = document.createElement('textarea');
        textarea.id = 'answer-input';
        textarea.className = 'w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500';
        textarea.rows = question.type === 'sql-query' ? 6 : 3;
        textarea.placeholder = question.type === 'sql-query' ? 'Write your SQL query here...' : 'Enter your answer...';
        answerArea.appendChild(textarea);
    }
}

// Submit answer
function submitAnswer() {
    const question = questions[currentQuestionIndex];
    let userAnswer = null;
    let isCorrect = false;
    
    // Get user's answer
    if (question.type === 'multiple-choice') {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) {
            alert('Please select an answer');
            return;
        }
        userAnswer = parseInt(selected.value);
        isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === 'fill-in-blank') {
        userAnswer = document.getElementById('answer-input').value.trim();
        if (!userAnswer) {
            alert('Please enter an answer');
            return;
        }
        if (question.caseSensitive === false) {
            isCorrect = userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
        } else {
            isCorrect = userAnswer === question.correctAnswer;
        }
    } else if (question.type === 'sql-query') {
        userAnswer = document.getElementById('answer-input').value.trim();
        if (!userAnswer) {
            alert('Please write a SQL query');
            return;
        }
        // Validate SQL query - check if it contains required keywords
        isCorrect = validateSQLQuery(userAnswer, question);
    }
    
    // Update score
    if (isCorrect) {
        score++;
    }
    
    // Store answer
    userAnswers[currentQuestionIndex] = {
        answer: userAnswer,
        correct: isCorrect
    };
    
    // Show feedback
    showFeedback(isCorrect, question);
    
    // Update score display
    document.getElementById('current-score').textContent = score;
    document.getElementById('percent-score').textContent = Math.round((score / questions.length) * 100);
    
    // Disable submit button
    document.getElementById('submit-answer-btn').disabled = true;
    
    // Show next question button or finish
    const feedbackArea = document.getElementById('feedback-area');
    if (currentQuestionIndex < questions.length - 1) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'mt-4 w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition';
        nextBtn.textContent = 'Next Question →';
        nextBtn.addEventListener('click', () => {
            loadQuestion(currentQuestionIndex + 1);
            document.getElementById('submit-answer-btn').disabled = false;
        });
        feedbackArea.appendChild(nextBtn);
    } else {
        const finishBtn = document.createElement('button');
        finishBtn.className = 'mt-4 w-full bg-green-600 text-white font-semibold py-3 px-6 rounded hover:bg-green-700 transition';
        finishBtn.textContent = 'Finish Quiz';
        finishBtn.addEventListener('click', showResults);
        feedbackArea.appendChild(finishBtn);
    }
}

// Validate SQL query
function validateSQLQuery(userQuery, question) {
    const query = userQuery.toUpperCase();
    const keywords = question.keywords || [];
    
    // Check if all required keywords are present
    for (const keyword of keywords) {
        if (!query.includes(keyword.toUpperCase())) {
            return false;
        }
    }
    
    return true;
}

// Show feedback
function showFeedback(isCorrect, question) {
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.classList.remove('hidden');
    
    if (isCorrect) {
        feedbackArea.innerHTML = `
            <div class="bg-green-50 border border-green-200 rounded p-4">
                <div class="flex items-start">
                    <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <div>
                        <p class="font-bold text-green-800 mb-1">✓ Correct!</p>
                        <p class="text-sm text-green-700">${question.explanation}</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        feedbackArea.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded p-4">
                <div class="flex items-start">
                    <svg class="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                    </svg>
                    <div>
                        <p class="font-bold text-red-800 mb-1">✗ Incorrect</p>
                        <p class="text-sm text-red-700 mb-2">${question.explanation}</p>
                        ${question.type === 'fill-in-blank' ? `<p class="text-sm text-red-600">Correct answer: <strong>${question.correctAnswer}</strong></p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
}

// Show hint
function showHint() {
    const question = questions[currentQuestionIndex];
    if (hintsUsed >= 3 || !question.hints) {
        return;
    }
    
    const hint = question.hints[hintsUsed];
    hintsUsed++;
    
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.classList.remove('hidden');
    feedbackArea.innerHTML = `
        <div class="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p class="font-bold text-yellow-800 mb-1">💡 Hint ${hintsUsed}/3:</p>
            <p class="text-sm text-yellow-700">${hint}</p>
        </div>
    `;
    
    document.getElementById('hints-remaining').textContent = 3 - hintsUsed;
    
    if (hintsUsed >= 3) {
        document.getElementById('hint-btn').disabled = true;
    }
}

// Skip question
function skipQuestion() {
    userAnswers[currentQuestionIndex] = {
        answer: null,
        correct: false
    };
    
    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        showResults();
    }
}

// Show results
function showResults() {
    // Update progress
    progress[currentLevel].score = score;
    progress[currentLevel].completed = true;
    saveProgress();
    
    // Hide quiz, show results
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 80;
    
    // Update results screen
    document.getElementById('results-icon').textContent = passed ? '🎉' : '📚';
    document.getElementById('results-title').textContent = passed ? 
        `${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level Complete!` : 
        'Keep Practicing!';
    document.getElementById('final-score').textContent = `${score}/${questions.length}`;
    document.getElementById('final-percentage').textContent = `(${percentage}%)`;
    
    // Show appropriate message
    if (passed) {
        document.getElementById('pass-message').classList.remove('hidden');
        document.getElementById('fail-message').classList.add('hidden');
        
        // Show next level button or certificate button
        if (currentLevel === 'beginner') {
            document.getElementById('next-level-btn').classList.remove('hidden');
        } else if (currentLevel === 'intermediate') {
            document.getElementById('next-level-btn').classList.remove('hidden');
        } else if (currentLevel === 'advanced') {
            // All levels complete - show certificate button
            document.getElementById('get-certificate-btn').classList.remove('hidden');
        }
    } else {
        document.getElementById('pass-message').classList.add('hidden');
        document.getElementById('fail-message').classList.remove('hidden');
        document.getElementById('next-level-btn').classList.add('hidden');
        document.getElementById('get-certificate-btn').classList.add('hidden');
    }
}

// Generate certificate
async function generateCertificate() {
    const name = document.getElementById('certificate-name').value.trim();
    
    if (!name || name.length < 2) {
        alert('Please enter your full name');
        return;
    }
    
    try {
        const response = await fetch('/api/certificate/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_name: name,
                beginner_score: progress.beginner.score,
                intermediate_score: progress.intermediate.score,
                advanced_score: progress.advanced.score,
                total_time: 0
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Certificate generated! ID: ${result.certificate_id}\n\nNote: In a full implementation, this would download a PDF certificate.`);
            document.getElementById('certificate-modal').classList.add('hidden');
        } else {
            alert('Error generating certificate: ' + result.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Back to level selection
function backToLevelSelection() {
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('level-selection').classList.remove('hidden');
}
