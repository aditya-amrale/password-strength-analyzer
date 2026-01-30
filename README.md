# Password Strength Analyzer

A modern, interactive web application that analyzes password strength in real-time with detailed feedback and visual indicators.

## Features

- **Real-time Analysis**: Instant feedback as you type your password
- **Visual Strength Indicator**: Color-coded strength meter (Weak, Fair, Good, Strong)
- **Requirement Checklist**: Shows which password requirements are met:
  - Minimum 8 characters
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters
  - Recommended 12+ characters
- **Detailed Analysis**:
  - Password length
  - Character variety breakdown
  - Estimated crack time
  - Common pattern detection
- **Password Visibility Toggle**: Show/hide password for easy verification
- **Modern UI**: Beautiful gradient design with smooth animations

## How to Use

1. Open `index.html` in your web browser
2. Type a password in the input field
3. View real-time strength analysis and feedback
4. Use the eye icon to toggle password visibility

## Technical Details

The analyzer evaluates passwords based on:
- **Length**: Longer passwords score higher
- **Character Variety**: Mix of uppercase, lowercase, numbers, and special characters
- **Entropy Calculation**: Measures password complexity
- **Pattern Detection**: Identifies common sequences, keyboard patterns, and weak structures

## Browser Compatibility

Works on all modern browsers (Chrome, Firefox, Safari, Edge).

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and animations
- `script.js` - Password analysis logic
