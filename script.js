const passwordInput = document.getElementById('passwordInput');
const toggleVisibility = document.getElementById('toggleVisibility');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const analysisSection = document.getElementById('analysisSection');
const analysisLength = document.getElementById('analysisLength');
const analysisVariety = document.getElementById('analysisVariety');
const analysisCrackTime = document.getElementById('analysisCrackTime');
const analysisPatterns = document.getElementById('analysisPatterns');

let isPasswordVisible = false;

// Toggle password visibility
toggleVisibility.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';
    toggleVisibility.querySelector('.eye-icon').textContent = isPasswordVisible ? '🙈' : '👁️';
});

// Analyze password on input
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    analyzePassword(password);
});

// Password analysis function
function analyzePassword(password) {
    if (password.length === 0) {
        resetDisplay();
        return;
    }

    // Check requirements
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
        lengthStrong: password.length >= 12
    };

    // Calculate strength score
    const strength = calculateStrength(password, checks);
    
    // Update strength display
    updateStrengthDisplay(strength);
    
    // Update analysis section
    updateAnalysis(password, checks, strength);
}

function calculateStrength(password, checks) {
    let score = 0;
    const maxScore = 100;

    // Length scoring (0-30 points)
    if (password.length >= 12) score += 30;
    else if (password.length >= 8) score += 20;
    else if (password.length >= 6) score += 10;
    else score += password.length * 1.5;

    // Character variety (0-40 points)
    let varietyCount = 0;
    if (checks.uppercase) varietyCount++;
    if (checks.lowercase) varietyCount++;
    if (checks.number) varietyCount++;
    if (checks.special) varietyCount++;
    score += varietyCount * 10;

    // Length bonus (0-20 points)
    if (password.length > 16) score += 20;
    else if (password.length > 12) score += 15;
    else if (password.length > 8) score += 10;

    // Pattern penalties
    const commonPatterns = detectCommonPatterns(password);
    score -= commonPatterns.length * 5;

    // Entropy bonus (0-10 points)
    const entropy = calculateEntropy(password);
    score += Math.min(entropy / 10, 10);

    return Math.min(Math.max(score, 0), maxScore);
}

function calculateEntropy(password) {
    const charSets = {
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    let poolSize = 0;
    if (charSets.lowercase) poolSize += 26;
    if (charSets.uppercase) poolSize += 26;
    if (charSets.numbers) poolSize += 10;
    if (charSets.special) poolSize += 32; // Common special characters

    if (poolSize === 0) return 0;
    return password.length * Math.log2(poolSize);
}

function detectCommonPatterns(password) {
    const patterns = [];
    const lower = password.toLowerCase();

    // Common sequences
    const sequences = ['12345', 'abcde', 'qwerty', 'password', 'admin', 'letmein', 'welcome', 'monkey'];
    sequences.forEach(seq => {
        if (lower.includes(seq)) patterns.push(`Contains common sequence: "${seq}"`);
    });

    // Repeated characters
    if (/(.)\1{3,}/.test(password)) {
        patterns.push('Contains repeated characters');
    }

    // Keyboard patterns
    const keyboardRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    keyboardRows.forEach(row => {
        for (let i = 0; i <= row.length - 4; i++) {
            const pattern = row.substring(i, i + 4);
            if (lower.includes(pattern)) {
                patterns.push(`Contains keyboard pattern: "${pattern}"`);
                break;
            }
        }
    });

    // All same case
    if (password === password.toLowerCase() || password === password.toUpperCase()) {
        if (password.length > 1) {
            patterns.push('All characters are the same case');
        }
    }

    return patterns;
}

function updateStrengthDisplay(strength) {
    // Remove all strength classes
    strengthBar.className = 'strength-bar';
    strengthText.className = 'strength-text';

    let strengthLevel, strengthLabel;

    if (strength < 30) {
        strengthLevel = 'weak';
        strengthLabel = 'Weak';
    } else if (strength < 50) {
        strengthLevel = 'fair';
        strengthLabel = 'Fair';
    } else if (strength < 75) {
        strengthLevel = 'good';
        strengthLabel = 'Good';
    } else {
        strengthLevel = 'strong';
        strengthLabel = 'Strong';
    }

    strengthBar.classList.add(strengthLevel);
    strengthText.classList.add(strengthLevel);
    strengthText.textContent = strengthLabel;
}

function estimateCrackTime(password, entropy) {
    // Rough estimate: assuming 10^9 guesses per second (modern GPU)
    const guessesPerSecond = 1e9;
    const possibleCombinations = Math.pow(2, entropy);
    const seconds = possibleCombinations / guessesPerSecond;

    if (seconds < 1) return 'Instant';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
    return `${(seconds / 31536000000).toFixed(1)} billion years`;
}

function updateAnalysis(password, checks, strength) {
    analysisSection.style.display = 'block';

    // Length
    analysisLength.textContent = `${password.length} characters`;

    // Character variety
    let variety = [];
    if (checks.uppercase) variety.push('Uppercase');
    if (checks.lowercase) variety.push('Lowercase');
    if (checks.number) variety.push('Numbers');
    if (checks.special) variety.push('Special');
    analysisVariety.textContent = variety.length > 0 ? variety.join(', ') : 'Limited';

    // Crack time
    const entropy = calculateEntropy(password);
    analysisCrackTime.textContent = estimateCrackTime(password, entropy);

    // Patterns
    const patterns = detectCommonPatterns(password);
    if (patterns.length > 0) {
        analysisPatterns.textContent = patterns[0];
        analysisPatterns.style.color = '#ff6b6b';
    } else {
        analysisPatterns.textContent = 'No common patterns detected';
        analysisPatterns.style.color = '#51cf66';
    }
}

function resetDisplay() {
    strengthBar.className = 'strength-bar';
    strengthText.className = 'strength-text';
    strengthText.textContent = 'Enter a password';
    
    analysisSection.style.display = 'none';
}
