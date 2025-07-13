# To-Do List with AI Bug Detection Agent

A jQuery-based to-do list application enhanced with an autonomous AI-powered bug detection system.

## Features

### To-Do List Application
- Add new tasks
- Mark tasks as complete
- Remove tasks with animations
- Keyboard support (Enter to add tasks)
- Responsive design

### AI Bug Detection Agent 🤖
The autonomous bug detection system scans your codebase and identifies:

- **JavaScript Bugs**: Memory leaks, type coercion issues, undefined variables
- **Security Issues**: Potential XSS vulnerabilities, unsafe practices
- **Performance Problems**: Inefficient jQuery usage, animation performance
- **Accessibility Issues**: Missing ARIA labels, keyboard navigation problems
- **Code Quality**: Use of magic numbers, missing error handling
- **CSS Problems**: Browser compatibility issues, missing mobile support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Usage

#### Running the To-Do List
Open `index.html` in your browser to use the to-do list application.

#### AI Bug Detection

Run the complete analysis (ESLint + AI Agent):
```bash
npm run analyze
```

Run only the AI bug detection:
```bash
npm run bug-detect
```

Run only ESLint:
```bash
npm run lint
```

Run tests:
```bash
npm run test
```

## AI Bug Detection Features

### Automatic Detection Categories

1. **🚨 Bugs** - Critical issues that need immediate fixing
   - Type coercion problems (`==` vs `===`)
   - Potential XSS vulnerabilities
   - Undefined variable usage

2. **⚠️ Warnings** - Important issues that should be addressed
   - Memory leak patterns
   - Performance problems
   - Missing error handling
   - Accessibility violations

3. **💡 Suggestions** - Improvements and best practices
   - Code style improvements
   - Mobile UX enhancements
   - Performance optimizations

### Supported File Types
- **JavaScript** (.js): Detects jQuery issues, ES6 problems, security vulnerabilities
- **HTML** (.html): Finds accessibility issues, missing attributes
- **CSS** (.css): Identifies browser compatibility issues, animation problems

### Example Bug Detection Report

```
🤖 AI Bug Detection Agent Report
================================

🚨 BUGS FOUND:
1. main.js:15
   Issue: Use === instead of == for strict equality comparison
   Code: if (taskText == '') {
   Fix: Replace == with === to avoid type coercion issues

⚠️ WARNINGS:
1. main.js:18
   Issue: jQuery animations may cause performance issues
   Code: taskItem.animate({ opacity: 0 }, 300, function() {
   Suggestion: Consider using CSS transitions or requestAnimationFrame

💡 SUGGESTIONS:
1. main.js:4
   Issue: Consider using const for jQuery elements that won't be reassigned
   Code: let taskText = $('#new-task').val().trim();
   Improvement: Use const instead of let for immutable jQuery objects

📊 SUMMARY:
   Bugs: 1
   Warnings: 1
   Suggestions: 1
   Total Issues: 3
```

## Bug Detection Patterns

### JavaScript Patterns
- Event handler memory leaks
- Incorrect variable declarations
- Type coercion issues
- Missing error handling
- Performance anti-patterns
- Accessibility violations

### HTML Patterns
- Missing ARIA labels
- Unsafe external resources
- Form accessibility issues

### CSS Patterns
- Missing mobile support
- Browser compatibility issues
- Animation performance problems

## Architecture

```
bug-detector.js     # Main AI bug detection engine
test-runner.js      # Test suite for the bug detector
main.js            # To-do list functionality
index.html         # Application UI
style.css          # Styling and animations
.eslintrc.json     # ESLint configuration
```

## API Reference

### BugDetectionAgent Class

```javascript
const agent = new BugDetectionAgent();

// Scan individual file
await agent.scanFile('path/to/file.js');

// Scan entire directory
await agent.scanDirectory('./src');

// Generate report
const results = agent.generateReport();
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run the bug detection: `npm run analyze`
4. Fix any issues found
5. Add tests for new features
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Changelog

### v1.0.0
- Initial release with AI bug detection
- jQuery to-do list functionality
- ESLint integration
- Comprehensive test suite
- Autonomous bug scanning for JS, HTML, CSS files