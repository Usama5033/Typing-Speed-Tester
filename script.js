// --- New Modal DOM Elements ---
const welcomeModal = document.getElementById('welcome-modal');
const userForm = document.getElementById('user-form');
const startTestBtn = document.getElementById('start-test-btn');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const mainApp = document.getElementById('main-app');
const welcomeMessage = document.getElementById('welcome-message');

// --- Results Modal DOM Elements ---
const resultsModal = document.getElementById('results-modal');
const resultNameEl = document.getElementById('result-name');
const resultWpmEl = document.getElementById('result-wpm');
const resultAccuracyEl = document.getElementById('result-accuracy');
const testAgainBtn = document.getElementById('test-again-btn');
const downloadResultBtn = document.getElementById('download-result-btn'); 

// --- Existing DOM Elements ---
const textToTypeEl = document.getElementById('text-to-type');
const textInputEl = document.getElementById('text-input');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');
const submitBtn = document.getElementById('submit-btn'); // <-- NEW
const timeSelectEl = document.getElementById('time-select');
const paragraphSelectEl = document.getElementById('paragraph-select');

// --- Sample Texts (Expanded List) ---
const paragraphs = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. Typing it quickly and accurately is a good measure of your skills. Practice makes perfect, so keep trying to improve your speed.", // 0
    "Technology has revolutionized the way we live and work. From smartphones to artificial intelligence, we are surrounded by innovation. Staying updated with the latest trends is crucial for personal and professional growth.", // 1
    "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take arms against a sea of troubles And by opposing end them.", // 2
    "The world is full of amazing places to explore. From the high peaks of the Himalayas to the deep blue of the Great Barrier Reef, adventure awaits. Traveling broadens your horizons and creates lasting memories.", // 3
    "Programming is the art of telling a computer what to do. It involves logic, creativity, and a lot of problem-solving. Learning to code opens up a world of possibilities and career opportunities in the tech industry.", // 4
    "The sun dipped below the horizon, painting the sky in hues of orange and purple. A gentle breeze rustled the leaves of the trees, and the first stars of the evening began to appear. It was a perfect end to a long day.", // 5
    "History is not just a collection of dates and facts. It is the story of humanity, our triumphs, our failures, and our enduring spirit. By understanding our past, we can better navigate the complexities of the present.", // 6
    "A balanced diet and regular exercise are the cornerstones of a healthy lifestyle. Eating a variety of fruits, vegetables, and whole grains provides essential nutrients, while physical activity strengthens the body and mind.", // 7
    "Music has a unique power to evoke emotions and connect people. Whether it's the complex structure of a symphony or the simple melody of a folk song, music transcends language and cultural barriers.", // 8
    "Climate change is one of the most pressing issues of our time. Rising global temperatures, extreme weather events, and melting ice caps are all signs that we need to take urgent action to protect our planet for future generations.", // 9
    "The art of gardening is a patient one. It teaches us about the cycles of life, the importance of nurturing, and the joy of reaping what you sow. A small patch of green can be a sanctuary for the mind.", // 10
    "Cryptography is the practice and study of techniques for secure communication in the presence of third parties. Modern cryptography intersects the disciplines of mathematics, computer science, and electrical engineering.", // 11
    "The steam engine was a pivotal invention of the Industrial Revolution. It mechanized an enormous range of tasks, from pumping water out of mines to powering the first locomotives and factories, forever changing society.", // 12
    "Beyond the familiar planets, our solar system is filled with countless asteroids, comets, and dwarf planets. Exploring these distant objects helps us understand the origins of our celestial neighborhood and the potential for life elsewhere.", // 13
    "A great novel can transport you to another time and place. It allows you to live a different life, to see the world through another's eyes, and to explore complex ideas and emotions in a deeply personal way.", // 14
    "The internet has connected the world in ways previously unimaginable. Information is now instantly accessible, and communication can happen in real-time across the globe. However, it also presents new challenges in privacy and misinformation.", // 15
    "Mount Everest, the world's highest peak, continues to draw climbers from all over the globe. The journey to the summit is perilous, testing the limits of human endurance against extreme cold, high winds, and low oxygen levels.", // 16
    "Cooking is a form of creative expression. Combining different ingredients, spices, and techniques allows you to create unique flavors and dishes. It's a skill that can be both practical and deeply rewarding.", // 17
    "The human brain is an incredibly complex organ. It controls our thoughts, emotions, memories, and every movement we make. Neuroscientists are still working to unravel many of its mysteries.", // 18
    "In the world of finance, 'bear' and 'bull' markets describe the general direction of stock prices. A bull market is characterized by rising prices and optimism, while a bear market sees falling prices and pessimism.", // 19
    "Artificial neural networks are computational models inspired by the human brain. They are a key component of deep learning, a subfield of machine learning that has led to breakthroughs in image recognition, natural language processing, and more.", // 20
    "Learning a new language opens up more than just communication; it provides a new perspective on culture, thought, and a different way of seeing the world. It is a challenging but immensely rewarding endeavor.", // 21
    "Public speaking is a common fear, but it's a critical skill for success in many fields. Preparation, practice, and understanding your audience are key to delivering a confident and effective presentation.", // 22
    "Chess is a game of strategy and foresight. Each piece moves in a unique way, and players must anticipate their opponent's moves several steps ahead. It. It is a true test of tactical and positional understanding.", // 23
    "Volcanoes are a powerful and awe-inspiring force of nature. When they erupt, they can create new land and enrich the soil, but they also pose a significant threat to nearby communities. Studying them helps us predict and prepare for these events." // 24
    // You can add up to 100 or more paragraphs here.
];

// --- State Variables ---
let timer;
let selectedTime = 60; // Default time
let totalTime = selectedTime;
let timeRemaining = totalTime;
let testInProgress = false;
let testFinished = false;
let charElements = []; // Array of all <span> elements for each character
let userName = ''; // <-- Store user's name globally
let userEmail = ''; // <-- Store user's email globally

// --- NEW: Chart State ---
let wpmHistory = [];
let chartLabels = [];
let currentCorrectChars = 0;
let myChart = null; // To store the chart instance

/**
 * 1. Load a new paragraph into the text area
 */
function loadNewParagraph() {
    // Stop any existing timer
    clearInterval(timer);

    // --- NEW: Reset chart ---
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
    wpmHistory = [];
    chartLabels = [];
    currentCorrectChars = 0;

    // Enable settings controls
    setSettingsDisabled(false);

    // --- NEW: Set button visibility ---
    restartBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');

    // Reset state
    testInProgress = false;
    testFinished = false;
    totalTime = selectedTime;
    timeRemaining = totalTime;
    
    // Reset UI
    timerEl.textContent = formatTime(timeRemaining);
    wpmEl.textContent = '0';
    accuracyEl.textContent = '0%';
    textInputEl.value = '';

    // Get selected paragraph
    const selectedIndex = parseInt(paragraphSelectEl.value, 10);
    let paragraph;

    if (selectedIndex === -1) {
        // Get a random paragraph
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        paragraph = paragraphs[randomIndex];
    } else {
        paragraph = paragraphs[selectedIndex];
    }
    
    // Clear old text
    textToTypeEl.innerHTML = '';
    
    // Create a <span> for each character
    charElements = paragraph.split('').map(char => {
        const span = document.createElement('span');
        span.innerText = char;
        span.className = 'text-slate-400'; // Default color for untyped text
        textToTypeEl.appendChild(span);
        return span;
    });
    
    // Add the initial cursor to the first character
    if (charElements.length > 0) {
        charElements[0].classList.add('cursor');
    }

    // Focus the input to start
    focusInput();
}

/**
 * 2. Handle user typing in the input field
 */
function handleTyping(event) {
    if (testFinished) return;

    const userInput = textInputEl.value;
    const userInputLength = userInput.length;

    // Start the timer on the first keypress
    if (!testInProgress && userInputLength > 0) {
        startTimer();
    }

    let correctChars = 0;

    // Loop through each character span
    charElements.forEach((charSpan, index) => {
        const char = charSpan.innerText;
        
        // Remove all styling
        charSpan.classList.remove('text-green-400', 'text-red-500', 'text-slate-400', 'cursor', 'blink-pause');
        
        if (index < userInputLength) {
            // This character has been typed
            if (userInput[index] === char) {
                charSpan.classList.add('text-green-400');
                correctChars++;
            } else {
                charSpan.classList.add('text-red-500');
                // Use underline for incorrect whitespace
                if (char === ' ') {
                    charSpan.style.textDecoration = 'underline';
                    charSpan.style.textDecorationColor = '#ef4444'; // red-500
                }
            }
        } else if (index === userInputLength) {
            // This is the current character (cursor)
            charSpan.classList.add('cursor');
            charSpan.classList.add('text-slate-300'); // Ensure cursor char is visible
        } else {
            // This character has not been typed yet
            charSpan.classList.add('text-slate-400');
        }
    });

    // --- NEW: Store current correct chars for chart ---
    currentCorrectChars = correctChars;

    // If user finishes the text before time is up
    if (userInputLength === charElements.length) {
        endTest();
    }
}

/**
 * 3. Start the countdown timer
 */
function startTimer() {
    testInProgress = true;
    // Disable settings controls during test
    setSettingsDisabled(true);

    // --- NEW: Swap button visibility ---
    restartBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
    
    timer = setInterval(() => {
        timeRemaining--;
        timerEl.textContent = formatTime(timeRemaining);

        // --- NEW: Chart logic ---
        const timeElapsed = totalTime - timeRemaining;
        const timeElapsedInMinutes = timeElapsed / 60;
        
        // Avoid division by zero at the very start
        if (timeElapsedInMinutes > 0) {
            const currentWPM = (currentCorrectChars / 5) / timeElapsedInMinutes;
            wpmHistory.push(Math.round(currentWPM));
            chartLabels.push(`${timeElapsed}s`);
        }
        // --- End Chart logic ---

        if (timeRemaining === 0) {
            endTest();
        }
    }, 1000);
}

/**
 * 4. End the test (time's up or text finished)
 */
function endTest() {
    if (testFinished) return; // Prevent double-triggering
    
    clearInterval(timer);
    testInProgress = false;
    testFinished = true;
    textInputEl.blur(); // Remove focus from input
    
    // Re-enable settings controls
    setSettingsDisabled(false);

    // --- NEW: Swap button visibility ---
    restartBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');

    // Remove final cursor
    const cursorChar = document.querySelector('.cursor');
    if (cursorChar) {
        cursorChar.classList.remove('cursor');
    }
    
    // --- NEW: Show the results modal ---
    // Get results from calculation
    const results = calculateResults();
    // Show modal with results
    showResults(results);
}

/**
 * 5. Calculate WPM and Accuracy
 */
function calculateResults() {
    const userInput = textInputEl.value;
    const userInputLength = userInput.length;
    
    if (userInputLength === 0) {
        const results = { netWPM: 0, accuracy: 0, rawWPM: 0, correctChars: 0, incorrectChars: 0 };
        wpmEl.textContent = results.netWPM;
        accuracyEl.textContent = `${results.accuracy}%`;
        return results;
    }

    let correctChars = 0;
    for (let i = 0; i < userInputLength; i++) {
        if (userInput[i] === charElements[i].innerText) {
            correctChars++;
        }
    }
    
    // Calculate WPM
    // (Total characters / 5) / (Time in minutes)
    const timeElapsedInMinutes = (totalTime - timeRemaining) / 60;
    
    if (timeElapsedInMinutes === 0) {
         const results = { netWPM: 0, accuracy: 0, rawWPM: 0, correctChars: 0, incorrectChars: 0 };
        wpmEl.textContent = results.netWPM;
        accuracyEl.textContent = `${results.accuracy}%`;
        return results;
    }
    
    // Net WPM (adjusted for errors)
    const netWPM = (correctChars / 5) / timeElapsedInMinutes;
    // Raw WPM (based on all typed chars)
    const rawWPM = (userInputLength / 5) / timeElapsedInMinutes;

    // Calculate Accuracy
    const accuracy = (correctChars / userInputLength) * 100;
    const incorrectChars = userInputLength - correctChars;

    // Update main UI
    wpmEl.textContent = Math.round(netWPM);
    accuracyEl.textContent = `${Math.round(accuracy)}%`;

    // Return all data for the modal
    return {
        netWPM: Math.round(netWPM),
        accuracy: Math.round(accuracy),
        rawWPM: Math.round(rawWPM),
        correctChars: correctChars,
        incorrectChars: incorrectChars
    };
}

/**
 * 6. NEW: Show the final results modal
 */
function showResults(results) {
    // Populate modal
    resultNameEl.textContent = userName; // Use the stored name
    resultWpmEl.textContent = results.netWPM;
    resultAccuracyEl.textContent = `${results.accuracy}%`;

    // NEW: Populate detailed stats
    document.getElementById('result-raw-wpm').textContent = results.rawWPM;
    document.getElementById('result-duration').textContent = formatTime(totalTime - timeRemaining); // Show actual time elapsed
    document.getElementById('result-correct').textContent = results.correctChars;
    document.getElementById('result-incorrect').textContent = results.incorrectChars;

    // NEW: Generate feedback
    const feedbackEl = document.getElementById('result-feedback');
    let feedback = '';
    // --- UPDATED FEEDBACK LOGIC ---
    if (results.netWPM < 25) {
        feedback = "Your pace is developing. Focus on accuracy first, and speed will follow! Keep practicing.";
    } else if (results.netWPM < 35) {
        feedback = "Your speed is good, but you can improve it more to enhance your skill. Try to be more consistent.";
    } else if (results.netWPM < 50) {
        feedback = "Good job! You're at an average-to-proficient speed. Consistent practice will help you break 50 WPM.";
    } else if (results.netWPM < 70) {
        feedback = "Nice work! You're a proficient and fast typist. Keep pushing to improve your consistency.";
    } else {
        feedback = "Excellent! You are a very fast and effective typist. Well done!";
    }
    // --- END UPDATED FEEDBACK LOGIC ---
    feedbackEl.textContent = feedback;

    // --- NEW: Render Progress Chart ---
    renderProgressChart();

    // Show the modal
    resultsModal.classList.remove('hidden');
}

/**
 * 6.5. NEW: Render the progress chart
 */
function renderProgressChart() {
    if (myChart) {
        myChart.destroy();
    }
    
    const ctx = document.getElementById('progress-chart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'WPM',
                data: wpmHistory,
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // bg-blue-600 with opacity
                borderColor: 'rgba(59, 130, 246, 1)', // bg-blue-600
                borderWidth: 2,
                fill: true,
                tension: 0.1, // Smooths the line
                pointBackgroundColor: 'rgba(59, 130, 246, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Words Per Minute',
                        color: '#cbd5e1' // slate-300
                    },
                    ticks: {
                        color: '#94a3b8' // slate-400
                    },
                    grid: {
                        color: '#334155' // slate-700
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time (seconds)',
                        color: '#cbd5e1' // slate-300
                    },
                    ticks: {
                        color: '#94a3b8', // slate-400
                        maxTicksLimit: 10 // Don't show all 60 labels
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide the legend
                },
                tooltip: {
                    backgroundColor: '#0f172a', // slate-900
                    titleColor: '#e2e8f0', // slate-200
                    bodyColor: '#cbd5e1' // slate-300
                }
            }
        }
    });
}

/**
 * 7. Helper to focus the hidden input
 */
function focusInput() {
    textInputEl.focus();
    // When focusing, make the cursor solid for a moment
    const cursorChar = document.querySelector('.cursor');
    if (cursorChar) {
        cursorChar.classList.add('blink-pause');
        setTimeout(() => {
            cursorChar.classList.remove('blink-pause');
        }, 500);
    }
}

/**
 * 8. Populate the paragraph selection dropdown
 */
function populateParagraphSelect() {
    paragraphs.forEach((paragraph, index) => {
        const option = document.createElement('option');
        option.value = index;
        // Show first 40 chars as a preview
        option.text = `Paragraph ${index + 1}: ${paragraph.substring(0, 40)}...`;
        paragraphSelectEl.appendChild(option);
    });
}

/**
 * 9. Enable/Disable settings controls
 */
function setSettingsDisabled(isDisabled) {
    timeSelectEl.disabled = isDisabled;
    paragraphSelectEl.disabled = isDisabled;
}

/**
 * 10. Format time from seconds to mm:ss
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // Pad seconds with a zero if less than 10
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// --- Event Listeners ---
textInputEl.addEventListener('input', handleTyping);
restartBtn.addEventListener('click', loadNewParagraph);
submitBtn.addEventListener('click', endTest); // <-- NEW

// Listeners for new settings
timeSelectEl.addEventListener('change', () => {
    selectedTime = parseInt(timeSelectEl.value, 10);
    loadNewParagraph(); // Restart test with new time
});

paragraphSelectEl.addEventListener('change', loadNewParagraph);

// --- New Modal Logic ---
userForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting
    userName = nameInput.value.trim(); // <-- Store the name globally
    userEmail = emailInput.value.trim(); // <-- Store the email globally

    // Simple validation
    if (userName === '' || userEmail === '') {
        if (userName === '') {
            nameInput.focus();
        } else if (userEmail === '') {
            emailInput.focus();
        }
        // In a real app, you'd show a more prominent error
        console.log("Please fill out all fields.");
        return; 
    }

    // Hide modal
    welcomeModal.classList.add('hidden');
    
    // Show main app
    mainApp.classList.remove('hidden');

    // Personalize welcome message
    welcomeMessage.textContent = `Welcome, ${userName}! Test your typing speed and accuracy.`;

    // --- Initial Load (Moved here) ---
    populateParagraphSelect();
    loadNewParagraph();
});

// --- Results Modal Listener ---
testAgainBtn.addEventListener('click', () => {
    resultsModal.classList.add('hidden'); // Hide the results
    loadNewParagraph(); // Start a new test
});

// --- Download Results Listener ---
downloadResultBtn.addEventListener('click', () => {
    const resultsContent = document.getElementById('results-content');
    // NEW: Get the button container
    const resultsButtons = document.getElementById('results-buttons');
    
    // Add a temporary loading state
    downloadResultBtn.textContent = 'Downloading...';
    downloadResultBtn.disabled = true;

    // NEW: Hide the buttons before taking screenshot
    resultsButtons.style.display = 'none';

    html2canvas(resultsContent, {
        // Set the background color for the canvas
        backgroundColor: '#1e293b', // This is bg-slate-800
        useCORS: true 
    }).then(canvas => {
        // Create an image URL
        const imageData = canvas.toDataURL('image/png');
        
        // Create a temporary link to trigger the download
        const link = document.createElement('a');
        link.href = imageData;
        // Create a dynamic filename
        const safeUserName = userName.replace(/\s/g, '_') || 'user';
        link.download = `typing-test-results-${safeUserName}.png`;
        
        // Trigger download
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);

        // Reset button state
        downloadResultBtn.textContent = 'Download Results';
        downloadResultBtn.disabled = false;

        // NEW: Show the buttons again by resetting the style
        resultsButtons.style.display = '';

    }).catch(err => {
        console.error('Error generating image:', err);
        // Reset button state even on error
        downloadResultBtn.textContent = 'Download Results';
        downloadResultBtn.disabled = false;

        // NEW: Show the buttons again even on error
        resultsButtons.style.display = '';
    });
});