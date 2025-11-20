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
let startTime = null;
let timerInterval = null;
let isAnswerSubmitted = false;
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
    document.getElementById('exit-quiz-btn')?.addEventListener('click', exitQuiz);
    
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
    isAnswerSubmitted = false;
    
    // Get questions for this level
    questions = EXERCISES[level];
    
    // Start timer
    startTime = Date.now();
    startTimer();
    
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
    updateProgressCounts();
    
    // Load first question
    loadQuestion(0);
}

// Start timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Exit quiz
function exitQuiz() {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
        if (timerInterval) clearInterval(timerInterval);
        document.getElementById('quiz-area').classList.add('hidden');
        document.getElementById('level-selection').classList.remove('hidden');
    }
}

// Generate progress tracker dots
function generateProgressTracker() {
    const tracker = document.getElementById('progress-tracker');
    tracker.innerHTML = '';
    
    for (let i = 0; i < questions.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer hover:scale-110 transition-transform';
        dot.textContent = i + 1;
        dot.id = `progress-dot-${i}`;
        dot.title = `Question ${i + 1}`;
        tracker.appendChild(dot);
    }
}

// Update progress counts
function updateProgressCounts() {
    const correct = userAnswers.filter(a => a && a.correct).length;
    const incorrect = userAnswers.filter(a => a && !a.correct).length;
    const remaining = questions.length - userAnswers.length;
    
    document.getElementById('correct-count').textContent = correct;
    document.getElementById('incorrect-count').textContent = incorrect;
    document.getElementById('remaining-count').textContent = remaining;
}

// Load a question
function loadQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];
    hintsUsed = 0;
    isAnswerSubmitted = false;
    
    // Update progress
    document.getElementById('current-q').textContent = index + 1;
    document.getElementById('q-number').textContent = index + 1;
    document.getElementById('quiz-progress').style.width = `${((index + 1) / questions.length) * 100}%`;
    document.getElementById('current-score').textContent = score;
    
    // Update progress dots
    document.querySelectorAll('#progress-tracker > div').forEach((dot, i) => {
        if (i < index) {
            // Past questions - show result
            if (userAnswers[i] && userAnswers[i].correct) {
                dot.className = 'w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:scale-110 transition-transform';
            } else if (userAnswers[i]) {
                dot.className = 'w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:scale-110 transition-transform';
            }
        } else if (i === index) {
            // Current question
            dot.className = 'w-8 h-8 rounded-full bg-blue-500 ring-4 ring-blue-200 flex items-center justify-center text-xs font-bold text-white animate-pulse';
        } else {
            // Future questions
            dot.className = 'w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer hover:scale-110 transition-transform';
        }
    });
    
    // Display question
    document.getElementById('question-text').textContent = question.question;
    
    // Clear feedback and show submit button
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.classList.add('hidden');
    feedbackArea.innerHTML = '';
    
    // Reset buttons
    const submitBtn = document.getElementById('submit-answer-btn');
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    document.getElementById('hints-remaining').textContent = '3';
    document.getElementById('hint-btn').disabled = false;
    document.getElementById('skip-btn').disabled = false;
    
    // Generate answer area based on question type
    const answerArea = document.getElementById('answer-area');
    answerArea.innerHTML = '';
    
    if (question.type === 'multiple-choice') {
        question.options.forEach((option, i) => {
            const div = document.createElement('div');
            div.className = 'answer-option';
            div.innerHTML = `
                <label class="flex items-start p-5 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                    <input type="radio" name="answer" value="${i}" class="mt-1 mr-4 w-5 h-5 text-blue-600">
                    <span class="text-gray-800 text-lg flex-1 group-hover:text-blue-900">${option}</span>
                </label>
            `;
            answerArea.appendChild(div);
            
            // Add click listener to label for better UX
            div.querySelector('label').addEventListener('click', () => {
                document.querySelectorAll('.answer-option label').forEach(l => {
                    l.classList.remove('border-blue-500', 'bg-blue-50');
                    l.classList.add('border-gray-200');
                });
                div.querySelector('label').classList.add('border-blue-500', 'bg-blue-50');
                div.querySelector('label').classList.remove('border-gray-200');
            });
        });
    } else if (question.type === 'fill-in-blank' || question.type === 'sql-query') {
        const textarea = document.createElement('textarea');
        textarea.id = 'answer-input';
        textarea.className = 'w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono';
        textarea.rows = question.type === 'sql-query' ? 8 : 4;
        textarea.placeholder = question.type === 'sql-query' ? 'Write your SQL query here...' : 'Enter your answer...';
        answerArea.appendChild(textarea);
        
        // Focus on textarea
        setTimeout(() => textarea.focus(), 100);
    }
    
    // Update counts
    updateProgressCounts();
}

// Submit answer
function submitAnswer() {
    if (isAnswerSubmitted) return;
    
    const question = questions[currentQuestionIndex];
    let userAnswer = null;
    let isCorrect = false;
    
    // Get user's answer
    if (question.type === 'multiple-choice') {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) {
            showToast('Please select an answer', 'warning');
            return;
        }
        userAnswer = parseInt(selected.value);
        isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === 'fill-in-blank') {
        userAnswer = document.getElementById('answer-input').value.trim();
        if (!userAnswer) {
            showToast('Please enter an answer', 'warning');
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
            showToast('Please write a SQL query', 'warning');
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
    
    isAnswerSubmitted = true;
    
    // Show feedback
    showFeedback(isCorrect, question);
    
    // Update score display
    document.getElementById('current-score').textContent = score;
    updateProgressCounts();
    
    // Disable submit button and inputs
    const submitBtn = document.getElementById('submit-answer-btn');
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    document.getElementById('hint-btn').disabled = true;
    document.getElementById('skip-btn').disabled = true;
    
    // Disable answer inputs
    document.querySelectorAll('input[name="answer"], #answer-input').forEach(input => {
        input.disabled = true;
    });
    
    // Auto-advance after 2.5 seconds
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            loadQuestion(currentQuestionIndex + 1);
        } else {
            showResults();
        }
    }, 2500);
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
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6 shadow-lg animate-slideIn">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                    </div>
                    <div class="ml-4 flex-1">
                        <h4 class="text-xl font-bold text-green-800 mb-2">✓ Correct! Well done!</h4>
                        <p class="text-green-700 leading-relaxed">${question.explanation}</p>
                        <div class="mt-3 flex items-center text-sm text-green-600">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                            </svg>
                            <span>Moving to next question...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        feedbackArea.innerHTML = `
            <div class="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg p-6 shadow-lg animate-slideIn">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                        </svg>
                    </div>
                    <div class="ml-4 flex-1">
                        <h4 class="text-xl font-bold text-red-800 mb-2">✗ Not quite right</h4>
                        <p class="text-red-700 leading-relaxed mb-3">${question.explanation}</p>
                        ${question.type === 'fill-in-blank' || question.type === 'sql-query' ? 
                            `<div class="bg-white bg-opacity-70 rounded p-3 mt-2">
                                <p class="text-sm text-red-600 font-semibold mb-1">Correct answer:</p>
                                <p class="text-red-900 font-mono">${question.correctAnswer}</p>
                            </div>` : ''}
                        <div class="mt-3 flex items-center text-sm text-red-600">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                            </svg>
                            <span>Moving to next question...</span>
                        </div>
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
        <div class="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 rounded-lg p-6 shadow-lg">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <svg class="w-7 h-7 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <h4 class="font-bold text-yellow-800 mb-2">💡 Hint ${hintsUsed}/3:</h4>
                    <p class="text-yellow-700 leading-relaxed">${hint}</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('hints-remaining').textContent = 3 - hintsUsed;
    
    if (hintsUsed >= 3) {
        document.getElementById('hint-btn').disabled = true;
    }
}

// Skip question
function skipQuestion() {
    if (isAnswerSubmitted) return;
    
    userAnswers[currentQuestionIndex] = {
        answer: null,
        correct: false
    };
    
    isAnswerSubmitted = true;
    updateProgressCounts();
    
    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        showResults();
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-xl text-white font-semibold animate-slideIn`;
    
    if (type === 'warning') {
        toast.classList.add('bg-yellow-500');
    } else if (type === 'error') {
        toast.classList.add('bg-red-500');
    } else {
        toast.classList.add('bg-blue-500');
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Show results
function showResults() {
    // Stop timer
    if (timerInterval) clearInterval(timerInterval);
    
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
