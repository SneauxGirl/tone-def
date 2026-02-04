# Tone Def

A coding-focused typing practice tool that provides musical feedback based on finger position. Strengthen your code typing technique with tonal feedback.

Created using Claude to meet my personal desire for code-centric typing practice with auditory feedback.

## Decisions along the way

- **Browser-based**: Keyboard practice requires a browser and keeps the project easy to mod
- **Note-Mapping**: Notes per finger rather than per key. Unique undertone for shift. Removed tone for space. Split right pinkie keys into two tones for more accurate feedback about r-l movement
- **Sound Preferences**: Lower resonance accent sounds provide less distraction from primary keystroke tones
- **Sound Mode**: open source sound libraries
- **Targeted Code and Pinkie Characters**: frequently unavailale on standard practice sites
- **Multi-Line Content**: first iteration revealed one character or phrase at a time. Absolutely not
- **Fixes**: Primarily sound balance, unmapped characters, and escaping characters that were not completely mapped

## Features

- **Tonal Feedback**: Different tones for left hand (warm, mellow) and right hand (bright, clear)
- **Finger-Mapped Pitches**: Each finger gets its own pitch (pinkies low, index fingers high)
- **Coding Practice Mode**: Focuses on common coding patterns with punctuation and symbols
- **Right Pinky Drill**: Extra practice for the most challenging keys: `0 ) - _ = + P [ { ] } \ | ; : ' " / ?`
- **Real-time Stats**: Track accuracy and mistakes as you practice
- **No Distractions**: Simple underline shows current character, tones are mild, and no distracting animations

## Sound Design

- **Left Hand** 🎹: Warm sine wave tones (like a soft pad)
- **Right Hand** 🔔: Bright triangle wave tones (like bells)
- **Shift Key and Command Key**: Subtle low cello-like bass undertone
- **Wrong Key**: Mild descending buzz (immediately recognizable)
- **Space**: Silent (for rhythm without distraction - no one needs work on the space key)

## Not Trained

- **Most Control Keys**: Ctrl, Opt, Alt, Home, End, Esc, Arrows, Page Up/Down, Caps Lock, Tab, Backspace/Delete

## How to Use

1. Open `index.html` in your web browser
2. Click "Start Practice" for general coding practice or "Right Pinky Drill" for focused practice
3. Type the characters shown on screen
4. Listen to the tonal feedback and watch your accuracy improve!

## File Structure

```
melodic-typing-trainer/
├── index.html      # Main HTML structure
├── style.css       # All styling
├── app.js          # Game logic and audio
└── README.md       # This file
```

## Customization Ideas

You can easily customize this project:

### Change Sound Design
In `app.js`, modify the `fingerPitches` object to change the musical scale:
```javascript
const fingerPitches = {
    leftPinky: 48,    // C3
    leftRing: 52,     // E3
    // ... etc
};
```

### Add More Practice Patterns
Add to the `codingPatterns` or `rightPinkyPatterns` arrays - don't forget escape syntax:
```javascript
const codingPatterns = [
    'your new pattern here',
    // ... existing patterns
];
```

### Adjust Styling - Colors, Fonts, Shapes, etc
Edit `style.css` to modify. The main colors are:
- Purple gradient: `#667eea` to `#764ba2`
- Correct feedback: `#305224` (deep sage)
- Incorrect feedback: `#bb522c` (terra cotta)

### Change Timing/Duration
Modify the audio envelope in the `playTone()` function:
```javascript
gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4); // Duration
```

## GitHub Setup

To push this to GitHub:

```bash
cd tone-def
git init
git add .
git commit -m "Initial commit: Tone-Def"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tone-def.git
git push -u origin main
```

## Deploy to GitHub Pages

1. Push to GitHub (see above)
2. Go to your repository settings
3. Navigate to Pages section
4. Set source to "main" branch
5. Your site will be live at: `https://YOUR-USERNAME.github.io/tone-def/`

## Browser Compatibility

Works best in modern browsers with Web Audio API support:
- Chrome/Edge (recommended)
- Firefox
- Safari

## License

Feel free to use, modify, and share!

## Contributing

Ideas for improvements:
- [ ] Add difficulty levels
- [ ] Track WPM (words per minute)
- [ ] Save progress/statistics
- [ ] Add more instrument sounds
- [ ] Custom pattern creator
- [ ] Leaderboard

Have fun and happy typing! 🎵⌨️
