// Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Finger to pitch mapping (MIDI note numbers)
const fingerPitches = {
    leftPinky: 48,    // C3
    leftRing: 52,     // E3
    leftMiddle: 55,   // G3
    leftIndex: 60,    // C4
    rightIndex: 64,   // E4
    rightMiddle: 67,  // G4
    rightRing: 71,    // B4
    rightPinky: 74    // D5
};

// Key to finger mapping
const keyToFinger = {
    // Left hand
    '`': 'leftPinky', '1': 'leftPinky', '!': 'leftPinky', 'q': 'leftPinky', 'Q': 'leftPinky',
    'a': 'leftPinky', 'A': 'leftPinky', 'z': 'leftPinky', 'Z': 'leftPinky', 'Shift': 'leftPinky',
    
    '2': 'leftRing', '@': 'leftRing', 'w': 'leftRing', 'W': 'leftRing',
    's': 'leftRing', 'S': 'leftRing', 'x': 'leftRing', 'X': 'leftRing',
    
    '3': 'leftMiddle', '#': 'leftMiddle', 'e': 'leftMiddle', 'E': 'leftMiddle',
    'd': 'leftMiddle', 'D': 'leftMiddle', 'c': 'leftMiddle', 'C': 'leftMiddle',
    
    '4': 'leftIndex', '5': 'leftIndex', '$': 'leftIndex', '%': 'leftIndex',
    'r': 'leftIndex', 'R': 'leftIndex', 't': 'leftIndex', 'T': 'leftIndex',
    'f': 'leftIndex', 'F': 'leftIndex', 'g': 'leftIndex', 'G': 'leftIndex',
    'v': 'leftIndex', 'V': 'leftIndex', 'b': 'leftIndex', 'B': 'leftIndex',
    
    // Right hand
    '6': 'rightIndex', '7': 'rightIndex', '^': 'rightIndex', '&': 'rightIndex',
    'y': 'rightIndex', 'Y': 'rightIndex', 'u': 'rightIndex', 'U': 'rightIndex',
    'h': 'rightIndex', 'H': 'rightIndex', 'j': 'rightIndex', 'J': 'rightIndex',
    'n': 'rightIndex', 'N': 'rightIndex', 'm': 'rightIndex', 'M': 'rightIndex',
    
    '8': 'rightMiddle', '*': 'rightMiddle', 'i': 'rightMiddle', 'I': 'rightMiddle',
    'k': 'rightMiddle', 'K': 'rightMiddle', ',': 'rightMiddle', '<': 'rightMiddle',
    
    '9': 'rightRing', '(': 'rightRing', 'o': 'rightRing', 'O': 'rightRing',
    'l': 'rightRing', 'L': 'rightRing', '.': 'rightRing', '>': 'rightRing',
    
    '0': 'rightPinky', ')': 'rightPinky', '-': 'rightPinky', '_': 'rightPinky',
    '=': 'rightPinky', '+': 'rightPinky', 'p': 'rightPinky', 'P': 'rightPinky',
    '[': 'rightPinky', '{': 'rightPinky', ']': 'rightPinky', '}': 'rightPinky',
    '\\': 'rightPinky', '|': 'rightPinky', ';': 'rightPinky', ':': 'rightPinky',
    "'": 'rightPinky', '"': 'rightPinky', '/': 'rightPinky', '?': 'rightPinky',
    
    // Special keys
    'Meta': 'special', // Command key
    ' ': 'space', // Space bar
    '\n': 'rightPinky', // Enter/Return - edit to 'space' for silent return
};

// Coding string patterns
const codingPatterns = [
    // Function calls and parentheses
    'func()', 'getData()', 'map()', 'filter()', 'reduce()',
    // Array access
    'arr[0]', 'list[i]', 'data[key]', 'items[index]',
    // Object literals
    '{key}', '{x, y}', '{name}', '{id}',
    // Comparisons and operators
    'x == y', 'a != b', 'i <= n', 'x >= 0',
    'x + y', 'a - b', 'n * 2', 'x / y',
    // Assignments
    'x = 5', 'y = 10', 'sum = 0', 'i = 0',
    'x += 1', 'y -= 2', 'z *= 3', 'n /= 4',
    // Strings and quotes
    '"text"', "'name'", '`value`',
    // Semicolons and colons
    'x = 5;', 'y = 10;', 'key: value', 'id: 123',
    // Common variable patterns
    'let x', 'const y', 'var i', 'int n',
    // Logical operators
    'a && b', 'x || y', '!flag',
    // Bitwise
    'x & y', 'a | b', 'x ^ y',
    // Template literals
    '${x}', '${i}', '${id}',
    // Comments
    '// note', '/* */','# todo',
    // More complex
    'arr.map()', 'obj.key', 'this.id',
    'for (i)', 'if (x)', 'while (n)',
];

const rightPinkyPatterns = [
    // Focused on right pinky characters
    'x = 0;', 'y = 1;', 'sum = 0;', 'i = -1;',
    'arr[0]', 'list[i]', 'obj[key]', 'data[0]',
    '{x}', '{id}', '{key}', '{}',
    'x = -5', 'y = +10', 'n = 0', 'z = -1',
    'a = b;', 'x = y;', 'i = 0;', 'n = 1;',
    '"name"', "'id'", '"key"', "'val'",
    'key: val', 'id: 123', 'x: 0', 'y: -1',
    'arr = []', 'obj = {}', 'str = ""',
    'i++', 'i--', 'x += 1', 'y -= 1',
    '[0, 1]', '{a, b}', '(x, y)', 
    'x = "a"', 'y = 0', 'z = []', 's = ""',
];

// Game state
let currentMode = null;
let currentPosition = 0;
let currentBlock = ''; // Current 4-line block text
let correctCount = 0;
let mistakeCount = 0;
let isActive = false;
let shiftPressed = false;

// Play tone function
function playTone(finger, isCorrect = true) {
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    if (finger === 'special') {
        // Special tone for Command/Shift - subtle low cello-like bass
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        
        osc1.frequency.setValueAtTime(110, now); // Low A
        osc1.type = 'sine'; // Warm, round tone like a cello
        
        gain1.gain.setValueAtTime(0.12, now); // Quiet
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5); // Drawn out
        
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        
        osc1.start(now);
        osc1.stop(now + 0.5);
        return;
    }
    
    if (finger === 'space') {
        // Space bar - no sound (silent)
        return;
    }
    
    if (!isCorrect) {
        // Wrong key sound - harsh buzz with descending pitch
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        
        osc1.frequency.setValueAtTime(250, now);
        osc1.frequency.exponentialRampToValueAtTime(150, now + 0.2);
        osc1.type = 'sawtooth'; // Harsh, buzzy sound
        
        gain1.gain.setValueAtTime(0.25, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        
        osc1.start(now);
        osc1.stop(now + 0.2);
        return;
    }
    
    // Correct key - melodic tone
    const midiNote = fingerPitches[finger];
    const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
    
    // Determine waveform based on hand
    const isLeftHand = finger.startsWith('left');
    oscillator.type = isLeftHand ? 'sine' : 'triangle'; // Warm vs bright
    
    oscillator.frequency.setValueAtTime(frequency, now);
    
    // Envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.4);
}

// Generate next string
function generateNextString() {
    const patterns = currentMode === 'pinky' ? rightPinkyPatterns : codingPatterns;
    return patterns[Math.floor(Math.random() * patterns.length)];
}

// Generate a new 4-line block
function generateNewBlock() {
    const lines = [];
    const patternsPerLine = 5; // 5 patterns per line avoids wrap at full width
    
    for (let lineNum = 0; lineNum < 4; lineNum++) {
        let line = '';
        for (let i = 0; i < patternsPerLine; i++) {
            const nextPattern = generateNextString();
            line += (i > 0 ? ' ' : '') + nextPattern;
        }
        lines.push(line);
    }
    
    return lines.join('\n');
}

// Update display
function updateDisplay() {
    if (!isActive) {
        document.getElementById('prompt').textContent = 'Press Start';
        document.getElementById('nextStrings').textContent = '';
        return;
    }
    
    const typed = currentBlock.substring(0, currentPosition);
    const current = currentBlock[currentPosition] || '';
    const upcoming = currentBlock.substring(currentPosition + 1);
    
    // Create HTML with underline on current character only
    let promptHTML = '';
    
    if (typed) {
        promptHTML += `<span class="typed-chars">${escapeHtml(typed)}</span>`;
    }
    
    if (current) {
        promptHTML += `<span class="current-char">${escapeHtml(current)}</span>`;
    }
    
    if (upcoming) {
        promptHTML += `<span class="upcoming-chars">${escapeHtml(upcoming)}</span>`;
    }
    
    document.getElementById('prompt').innerHTML = promptHTML;
    
    document.getElementById('correct').textContent = correctCount;
    document.getElementById('mistakes').textContent = mistakeCount;
    
    const total = correctCount + mistakeCount;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 100;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// Helper to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start practice
function startPractice(mode) {
    currentMode = mode;
    isActive = true;
    currentPosition = 0;
    
    // Generate first 4-line block
    currentBlock = generateNewBlock();
    
    const modeText = mode === 'pinky' 
        ? '🎯 Right Pinky Drill Mode - Focus on: 0 ) - _ = + P [ { ] } \\ | ; : \' " / ?'
        : '💻 Coding Practice Mode - Mixed patterns with emphasis on right pinky';
    
    document.getElementById('modeInfo').textContent = modeText;
    document.getElementById('feedback').textContent = '';
    updateDisplay();
}

// Handle keypress
function handleKeyPress(event) {
    if (!isActive) return;
    
    const key = event.key;
    
    // Track shift state
    if (key === 'Shift') {
        shiftPressed = true;
        playTone('special', true);
        event.preventDefault();
        return;
    }
    
    // Check if we should ignore this key
    if (key === 'Tab' ||  key === 'Backspace' || key === 'CapsLock' ||
        key === 'Control' || key === 'Alt' || key === 'Option' ||
        key.startsWith('Arrow') || key === 'Escape') {
        return;
    }

    // Handle Enter key - only convert to newline if that's what's expected
    const expectedChar = currentBlock[currentPosition];
    let actualKey = key;

    if (key === 'Enter') {
        if (expectedChar === '\n') {
            actualKey = '\n'; // TRUE: Convert Enter to newline only if newline is expected
        } else {
            // FALSE: Wrong key - Enter pressed but newline not expected
            mistakeCount++;
            playTone('rightPinky', false);
            document.getElementById('feedback').textContent = `✗ Expected: "${expectedChar}"`;
            document.getElementById('feedback').className = 'feedback incorrect';
            updateDisplay();
            return; // ERROR and no action - stops execution here and circles back to await next handleKeyPress event
        }
    }
    
    // Handle Command/Meta key
    if (key === 'Meta') {
        playTone('special', true);
        event.preventDefault();
        return;
    }
    
    const finger = keyToFinger[actualKey];
    
    // If we don't track this key, ignore it
    if (!finger) return;
    
    event.preventDefault();
    
  // removed expectedChar - already declared above
    
    if (actualKey === expectedChar) {
        // Correct!
        correctCount++;
        playTone(finger, true);
        document.getElementById('feedback').textContent = '✓';
        document.getElementById('feedback').className = 'feedback correct';
        
        currentPosition++;
        
        // Check if we completed the block
        if (currentPosition >= currentBlock.length) {
            // Generate new block and reset position
            currentBlock = generateNewBlock();
            currentPosition = 0;
        }
        
    } else {
        // Wrong key
        mistakeCount++;
        playTone(finger, false);
        document.getElementById('feedback').textContent = `✗ Expected: "${expectedChar}"`;
        document.getElementById('feedback').className = 'feedback incorrect';
    }
    
    updateDisplay();
}

// Handle key release
function handleKeyUp(event) {
    if (event.key === 'Shift') {
        shiftPressed = false;
    }
}

// Event listeners
document.getElementById('startBtn').addEventListener('click', () => {
    startPractice('normal');
});

document.getElementById('pinkyBtn').addEventListener('click', () => {
    startPractice('pinky');
});

document.getElementById('resetBtn').addEventListener('click', () => {
    correctCount = 0;
    mistakeCount = 0;
    updateDisplay();
});

document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keyup', handleKeyUp);

// Initialize
updateDisplay();