# 🍻 MateTrack - PWA Expense Tracker

A Progressive Web App (PWA) designed for tracking expenses at events. Perfect for keeping track of drinks, food, and other purchases while hanging out with friends or attending events.

## Features

- **💰 Expense Tracking**: Add and categorize your expenses with amounts and descriptions
- **🍺 Drink Inventory**: Manage a list of available drinks at your event with prices
- **⚡ Quick Grab**: One-tap logging for items you grab from the fridge
- **📱 Mobile-First**: Responsive design optimized for iOS and Android
- **🔄 Offline Capable**: Works without internet connection using local storage
- **📲 Installable**: Can be installed on mobile devices like a native app
- **🎨 Modern UI**: Beautiful gradient design with smooth animations

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **PWA Features**: Service Worker, Web App Manifest
- **Storage**: Local Storage (no backend required)
- **Container**: Docker with Chainguard nginx
- **Deployment**: Kubernetes ready

## Quick Start

### Option 1: Docker (Recommended)

1. **Clone and build:**
   ```bash
   git clone https://github.com/Toasterson/matetrack-pwa.git
   cd matetrack
   ./build-and-deploy.sh
   ```

2. **Choose option 1** to run locally at http://localhost:8080

### Option 2: Development Server

1. **Serve the files:**
   ```bash
   cd matetrack/public
   python -m http.server 8080
   # or
   npx serve -p 8080
   ```

2. **Open browser:** http://localhost:8080

## Installation as PWA

### On Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Look for the "Install App" banner or
3. Use browser menu → "Add to Home Screen"
4. The app will behave like a native mobile app

### On Desktop
1. Open in Chrome/Edge
2. Look for install icon in address bar
3. Click to install as desktop app

## Usage Guide

### Adding Expenses
1. Go to the **💰 Expenses** tab
2. Enter amount, description, and category
3. Tap "Add Expense"
4. View your total at the top and history below

### Managing Drinks
1. Go to the **🍺 Drinks** tab
2. Add drinks with name, price, and quantity
3. These will appear as quick-grab buttons

### Quick Grab Feature
1. Go to the **⚡ Quick Grab** tab
2. Tap any drink button to instantly log it
3. This automatically adds it as an expense too
4. Perfect for tracking fridge raids!

### Categories
- **Drinks**: Beverages, alcohol, soft drinks
- **Food**: Snacks, meals, groceries
- **Transport**: Uber, gas, parking
- **Entertainment**: Games, activities, tips
- **Other**: Everything else

## Deployment

### Docker Deployment

```bash
# Build the image
docker build -t matetrack:latest .

# Run locally
docker run -d -p 8080:8080 --name matetrack matetrack:latest

# Access at http://localhost:8080
```

### Kubernetes Deployment

```bash
# Deploy to Kubernetes
kubectl apply -f kubernetes.yaml

# Check status
kubectl get pods
kubectl get services

# Get external IP
kubectl get service matetrack-service
```

### Manual Deployment Steps

1. **Build the image:**
   ```bash
   docker build -t matetrack:latest .
   ```

2. **Tag for your registry:**
   ```bash
   docker tag matetrack:latest ghcr.io/toasterson/matetrack:latest
   docker push ghcr.io/toasterson/matetrack:latest
   ```

3. **Update kubernetes.yaml** with your image name

4. **Deploy:**
   ```bash
   kubectl apply -f kubernetes.yaml
   ```

## Configuration

### Environment Variables
The app runs entirely in the browser, so no server-side configuration is needed.

### Customization
- **Colors**: Edit CSS variables in `styles.css`
- **Categories**: Modify the category options in `index.html`
- **Currency**: Change `$` symbols in `app.js` and `index.html`

## Data Storage

- **Local Storage Only**: All data stays on your device
- **No Backend**: No server or database required
- **Privacy First**: Your expense data never leaves your device
- **Offline First**: Works without internet connection

## Security Features

- **CSP Headers**: Content Security Policy implemented
- **HTTPS Ready**: Secure headers configured
- **No External Dependencies**: All code is self-contained
- **Chainguard Base**: Minimal, secure container image

## PWA Compliance

✅ **Installable**: Web App Manifest configured  
✅ **Offline Capable**: Service Worker implemented  
✅ **Responsive**: Works on all screen sizes  
✅ **Fast**: Cached resources for quick loading  
✅ **Secure**: HTTPS required for installation  

## Browser Support

- **Chrome/Chromium**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11.3+)
- **Edge**: Full support
- **Samsung Internet**: Full support

## File Structure

```
matetrack/
├── public/
│   ├── index.html          # Main app interface
│   ├── styles.css          # Styling and responsive design
│   ├── app.js              # App logic and local storage
│   ├── sw.js               # Service worker for offline
│   ├── manifest.json       # PWA manifest
│   ├── favicon.svg         # App icon
│   └── icons/              # PWA icons (placeholder)
├── Dockerfile              # Container configuration
├── kubernetes.yaml         # K8s deployment manifests
├── build-and-deploy.sh     # Build and deployment script
└── README.md               # This file
```

## Development

### Adding Features
1. **Frontend**: Modify `app.js` for functionality
2. **Styling**: Update `styles.css` for appearance
3. **PWA**: Update `sw.js` for offline behavior

### Testing
- **Local Testing**: Use browser dev tools
- **PWA Testing**: Use Lighthouse audit
- **Mobile Testing**: Use browser device simulation

## Troubleshooting

### Common Issues

**App won't install as PWA:**
- Ensure you're using HTTPS (required for PWA)
- Check browser console for manifest errors
- Verify all required icons are present

**Service Worker not working:**
- Check browser console for SW errors
- Ensure SW is served over HTTPS
- Clear browser cache and reload

**Styles not loading:**
- Check browser console for CSS errors
- Verify file paths are correct
- Clear browser cache

**Data not persisting:**
- Check if Local Storage is enabled
- Verify browser privacy settings
- Check for storage quota limits

### Performance Tips
- **Clear old data**: Use the "Clear All Data" button periodically
- **Restart app**: Refresh browser if app becomes slow
- **Update browser**: Ensure latest browser version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices/browsers
5. Submit a pull request

## License

This project is open source. Feel free to use, modify, and distribute.

## Support

For issues, feature requests, or questions:
- Check the browser console for error messages
- Test in different browsers
- Verify PWA compliance with Lighthouse

---

**Happy expense tracking! 🍻💰**