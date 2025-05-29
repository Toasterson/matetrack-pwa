# 🍻 MateTrack - PWA Expense Tracker

A Progressive Web App (PWA) designed for tracking expenses at events. Perfect for keeping track of drinks, food, and other purchases while hanging out with friends or attending events.

## Features

- **💰 Expense Tracking**: Add and categorize your expenses with amounts and descriptions
- **💳 Register Balance**: Track payments vs all expenses to see what you owe/credit
- **🍺 Drink Inventory**: Manage a list of available drinks at your event with prices
- **⚡ Quick Grab**: One-tap logging for items you grab from the fridge
- **📊 Smart Balance**: See if you owe money or have credit for all your expenses
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
4. View your register balance at the top and history below

### Register Payments
1. Go to the **💳 Register** tab
2. Enter amount you paid to the event organizer/register
3. Add optional note (e.g., "Initial payment", "Top up fund")
4. View your balance: register payments vs all expenses
5. **Green balance** = you have credit, **Red balance** = you owe money
6. Perfect for tracking what you still need to pay or if you're overpaid

### Managing Drinks
1. Go to the **🍺 Drinks** tab
2. Add drinks with name, price, and quantity
3. These will appear as quick-grab buttons

### Quick Grab Feature
1. Go to the **⚡ Quick Grab** tab
2. Tap any drink button to instantly log it
3. This automatically adds it as an expense too
4. Perfect for tracking fridge raids!

### Register Payments
1. Go to the **💳 Register** tab
2. Enter amount you paid to the event organizer
3. Add optional note (e.g., "For drinks fund", "Group dinner")
4. View summary showing register vs personal expenses
5. Perfect for tracking shared costs and contributions

### Categories
- **Drinks**: Beverages, alcohol, soft drinks
- **Food**: Snacks, meals, groceries
- **Transport**: Uber, gas, parking
- **Entertainment**: Games, activities, tips
- **Other**: Everything else

## Deployment

### Quick Local Deployment

```bash
# Using the automated script
./build-and-deploy.sh
```

### Docker Deployment

```bash
# Build the image
docker build -t matetrack:latest .

# Run locally
docker run -d -p 8080:8080 --name matetrack matetrack:latest

# Access at http://localhost:8080
```

### Helm Chart Deployment (Recommended)

Deploy using the included Helm chart with Chainguard-based container:

```bash
# Install from OCI registry
helm install matetrack oci://ghcr.io/toasterson/matetrack-pwa/helm/matetrack

# Or with custom values
helm install matetrack oci://ghcr.io/toasterson/matetrack-pwa/helm/matetrack \
  --set ingress.hosts[0].host=matetrack.example.com \
  --set ingress.tls[0].hosts[0]=matetrack.example.com
```

The Helm chart includes:
- Chainguard distroless nginx container for security
- Ingress with TLS termination
- Horizontal Pod Autoscaling support
- Security contexts and resource limits
- Health checks and monitoring

See `helm/matetrack/README.md` for detailed configuration options.

### Flux CD GitOps Deployment

For automated GitOps deployment using Flux CD:

```bash
# Apply Flux configuration
kubectl apply -f flux/

# Or using Flux CLI
flux create source git matetrack-pwa \
  --url=https://github.com/Toasterson/matetrack-pwa \
  --branch=main

flux create kustomization matetrack-pwa \
  --source=matetrack-pwa \
  --path="./flux" \
  --prune=true
```

The Flux configuration deploys to:
- **Namespace**: `projects`
- **Domain**: `matetrack.wegmueller.it`
- **Auto-updates**: Tracks chart versions `>=0.1.0`

See `flux/README.md` for detailed GitOps setup instructions.

### Legacy Kubernetes Deployment

```bash
# Deploy to Kubernetes (legacy method)
kubectl apply -f kubernetes.yaml

# Check status
kubectl get pods
kubectl get services

# Get external IP
kubectl get service matetrack-service
```

### CI/CD Pipeline

The project includes automated GitHub Actions workflow that:

1. **Builds container images**: Standard and Chainguard variants
2. **Publishes to GHCR**: `ghcr.io/toasterson/matetrack-pwa`
3. **Packages Helm chart**: Automatically versioned
4. **Publishes Helm chart**: To OCI registry at `/helm` suffix
5. **Multi-architecture**: Supports AMD64 and ARM64

Triggered on:
- Push to `main` or `develop` branches
- Git tags (for releases)
- Pull requests (build only)

### Manual Deployment Steps

1. **Build the image:**
   ```bash
   docker build -f Dockerfile.chainguard -t matetrack:chainguard .
   ```

2. **Tag for your registry:**
   ```bash
   docker tag matetrack:chainguard ghcr.io/toasterson/matetrack-pwa:chainguard
   docker push ghcr.io/toasterson/matetrack-pwa:chainguard
   ```

3. **Package and publish Helm chart:**
   ```bash
   helm package helm/matetrack
   helm push matetrack-*.tgz oci://ghcr.io/toasterson/matetrack-pwa/helm
   ```

4. **Deploy using Helm:**
   ```bash
   helm install matetrack oci://ghcr.io/toasterson/matetrack-pwa/helm/matetrack
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

### Application Security
- **CSP Headers**: Content Security Policy implemented
- **HTTPS Ready**: Secure headers configured
- **No External Dependencies**: All code is self-contained
- **Privacy First**: All data stays local, no server tracking

### Container Security (Chainguard Base)
- **Distroless Image**: Minimal attack surface with Chainguard nginx
- **Non-root User**: Runs as user ID 65532 (nonroot)
- **Read-only Filesystem**: Container filesystem is read-only
- **Dropped Capabilities**: All Linux capabilities dropped
- **Security Contexts**: Pod and container security policies enforced

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
├── helm/
│   └── matetrack/          # Helm chart for Kubernetes deployment
│       ├── Chart.yaml      # Chart metadata
│       ├── values.yaml     # Default configuration values
│       ├── templates/      # Kubernetes manifests templates
│       └── README.md       # Helm chart documentation
├── flux/                   # Flux CD GitOps configuration
│   ├── namespace.yaml      # Kubernetes namespace
│   ├── helmrepository.yaml # Helm OCI repository source
│   ├── helmrelease.yaml    # Helm release definition
│   ├── kustomization.yaml  # Kustomization configuration
│   └── README.md           # Flux deployment guide
├── .github/
│   └── workflows/
│       └── docker-build.yml # CI/CD pipeline for containers and Helm
├── Dockerfile              # Standard container configuration
├── Dockerfile.chainguard   # Chainguard-based container (security hardened)
├── kubernetes.yaml         # Legacy K8s deployment manifests
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