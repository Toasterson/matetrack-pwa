const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
    // Create a simple icon programmatically
    for (const size of sizes) {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        
        // Rounded rectangle background
        const radius = size * 0.1;
        ctx.beginPath();
        ctx.roundRect(0, 0, size, size, radius);
        ctx.fill();
        
        // Beer mug icon
        const centerX = size / 2;
        const centerY = size / 2;
        const mugWidth = size * 0.25;
        const mugHeight = size * 0.35;
        
        // Mug body
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(centerX - mugWidth/2, centerY - mugHeight/2, mugWidth, mugHeight);
        
        // Foam on top
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - mugHeight/2, mugWidth/2, size * 0.05, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Handle
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = size * 0.02;
        ctx.beginPath();
        ctx.arc(centerX + mugWidth/2 + size * 0.03, centerY, size * 0.06, -Math.PI/2, Math.PI/2, false);
        ctx.stroke();
        
        // Dollar sign
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(centerX + size * 0.25, centerY - size * 0.25, size * 0.08, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${size * 0.08}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('$', centerX + size * 0.25, centerY - size * 0.22);
        
        // App name
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${size * 0.06}px Arial`;
        ctx.fillText('MateTrack', centerX, centerY + size * 0.35);
        
        // Save the icon
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(`public/icons/icon-${size}x${size}.png`, buffer);
        console.log(`Generated icon-${size}x${size}.png`);
    }
    
    console.log('All icons generated successfully!');
}

// Polyfill for roundRect if needed
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

generateIcons().catch(console.error);