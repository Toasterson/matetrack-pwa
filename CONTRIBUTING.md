# Contributing to MateTrack 🍻

Thank you for your interest in contributing to MateTrack! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Security](#security)

## Code of Conduct

This project follows a simple code of conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Keep discussions professional and on-topic

## Getting Started

### Prerequisites

- Git
- Docker (for containerized development)
- Node.js 14+ (for npm scripts, optional)
- A modern web browser
- Basic knowledge of HTML, CSS, JavaScript
- Understanding of PWA concepts (helpful but not required)

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/Toasterson/matetrack-pwa.git
   cd matetrack-pwa
   ```

2. **Set up development environment:**
   ```bash
   # Option 1: Using Docker
   docker build -t matetrack-dev .
   docker run -d -p 8080:80 --name matetrack-dev matetrack-dev
   
   # Option 2: Using Node.js
   npm install
   npm start
   
   # Option 3: Using Python
   cd public
   python -m http.server 8080
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8080`

## How to Contribute

### Types of Contributions

We welcome all types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- 🔧 **Performance optimizations**
- 🧪 **Test improvements**
- 🐳 **Docker/Kubernetes improvements**
- 📱 **Mobile/PWA enhancements**

### Contribution Workflow

1. **Check existing issues** to see if your idea/bug is already being discussed
2. **Create an issue** if one doesn't exist (optional for small fixes)
3. **Fork the repository** and create a feature branch
4. **Make your changes** following our coding standards
5. **Test your changes** thoroughly
6. **Submit a pull request** with a clear description

## Coding Standards

### HTML

- Use semantic HTML5 elements
- Ensure accessibility (ARIA labels, alt text, etc.)
- Maintain PWA manifest requirements
- Keep structure clean and readable

### CSS

- Use CSS custom properties for theming
- Follow mobile-first responsive design
- Maintain existing naming conventions
- Use modern CSS features (flexbox, grid)
- Comment complex styles

```css
/* Good example */
.expense-item {
    background: var(--card-background);
    border-radius: 12px;
    padding: 1rem;
    transition: transform 0.3s ease;
}

/* Use meaningful class names */
.btn-primary { /* Good */ }
.blue-button { /* Avoid */ }
```

### JavaScript

- Use modern ES6+ features
- Follow existing code patterns
- Keep functions small and focused
- Add comments for complex logic
- Use meaningful variable names

```javascript
// Good example
function addExpense(amount, description, category) {
    const expense = {
        id: Date.now(),
        amount: parseFloat(amount),
        description: description.trim(),
        category: category,
        timestamp: new Date().toISOString()
    };
    
    expenses.unshift(expense);
    saveToLocalStorage();
    updateUI();
}
```

### File Organization

- Keep related code together
- Use consistent naming conventions
- Add comments for complex sections
- Maintain separation of concerns

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- ✅ **Responsive Design**: Test on mobile, tablet, desktop
- ✅ **PWA Features**: Install app, test offline functionality
- ✅ **Cross-Browser**: Chrome, Firefox, Safari, Edge
- ✅ **Form Validation**: Test all form inputs and edge cases
- ✅ **Local Storage**: Add, edit, delete data persistence
- ✅ **Performance**: Check for smooth animations and fast loading

### Browser Testing

Test in these browsers:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest, especially on iOS)
- Edge (latest)

### PWA Testing

- Install the app on mobile device
- Test offline functionality
- Verify service worker updates
- Check manifest file validity

## Pull Request Process

### Before Submitting

1. **Sync your fork** with the latest upstream changes
2. **Test thoroughly** on multiple devices/browsers
3. **Update documentation** if needed
4. **Check for conflicts** with main branch

### PR Template

Use this template for your pull request:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (please describe)

## Testing Done
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile devices (iOS Safari, Android Chrome)
- [ ] PWA installation and offline functionality
- [ ] Form validation and edge cases
- [ ] Local storage persistence

## Screenshots
If applicable, add screenshots showing the changes

## Additional Notes
Any additional context or considerations
```

### Review Process

1. **Automatic checks** will run (if configured)
2. **Maintainer review** for code quality and compatibility
3. **Testing** on various devices/browsers
4. **Merge** after approval

## Issue Guidelines

### Bug Reports

Please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Device/browser information
- Screenshots if applicable
- Console errors if any

### Feature Requests

Please include:
- Problem you're trying to solve
- Proposed solution
- Use cases and benefits
- Alternative approaches considered
- Mockups or examples if helpful

### Good Issue Examples

**Good Bug Report:**
> **Title:** Quick grab buttons not working on iOS Safari
> 
> **Description:** When tapping quick grab buttons on iOS Safari, nothing happens...
> 
> **Steps to reproduce:** 1. Open app on iOS Safari 2. Add a drink 3. Go to Quick Grab tab...

**Good Feature Request:**
> **Title:** Add expense categories with custom colors
> 
> **Description:** It would be helpful to have custom colors for expense categories to make them easier to distinguish visually...

## Security

### Reporting Security Issues

- **DO NOT** open public issues for security vulnerabilities
- Email security concerns to the maintainers
- Provide detailed information about the vulnerability
- Allow time for fixes before public disclosure

### Security Best Practices

When contributing:
- Don't introduce XSS vulnerabilities
- Validate all user inputs
- Be careful with local storage data
- Follow PWA security guidelines
- Keep dependencies updated

## Development Tips

### Local Development

- Use browser dev tools extensively
- Test PWA features with Lighthouse
- Use device simulation for mobile testing
- Check network tab for performance issues

### Debugging

- Use browser console for JavaScript errors
- Check Application tab for PWA/storage issues
- Use responsive design mode for layout testing
- Test offline mode by disabling network

### Performance

- Keep bundle size small (no external dependencies currently)
- Optimize images and assets
- Test on slower devices/connections
- Monitor local storage usage

## Getting Help

### Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker Guide](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Web App Manifest](https://web.dev/add-manifest/)

### Community

- Open an issue for questions
- Check existing issues and discussions
- Review the README for basic setup

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- README mentions for major features

Thank you for contributing to MateTrack! 🎉