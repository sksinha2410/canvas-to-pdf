// Client-side canvas state
let canvasState = {
    width: 800,
    height: 600,
    elements: []
};

let canvas = null;
let ctx = null;

// Initialize canvas on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    showStatus('Canvas ready! Add elements to get started.', 'info');
});

// Switch between element type tabs
function switchTab(type) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update forms
    document.querySelectorAll('.element-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${type}-form`).classList.add('active');
}

// Initialize canvas with custom dimensions
function initializeCanvas() {
    const width = parseInt(document.getElementById('canvasWidth').value);
    const height = parseInt(document.getElementById('canvasHeight').value);
    
    if (!width || !height || width <= 0 || height <= 0) {
        showStatus('Invalid canvas dimensions', 'error');
        return;
    }
    
    canvasState.width = width;
    canvasState.height = height;
    canvasState.elements = [];
    
    // Create canvas element if it doesn't exist
    if (!canvas) {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
    }
    
    canvas.width = width;
    canvas.height = height;
    
    showStatus('Canvas initialized successfully!', 'success');
    updateCanvasInfo();
    refreshPreview();
}

// Add rectangle to canvas
function addRectangle() {
    const element = {
        type: 'rectangle',
        x: parseInt(document.getElementById('rect-x').value),
        y: parseInt(document.getElementById('rect-y').value),
        width: parseInt(document.getElementById('rect-width').value),
        height: parseInt(document.getElementById('rect-height').value),
        fillColor: document.getElementById('rect-fill').value,
        strokeColor: document.getElementById('rect-stroke').value,
        fill: true,
        stroke: true
    };
    
    addElement(element);
}

// Add circle to canvas
function addCircle() {
    const element = {
        type: 'circle',
        x: parseInt(document.getElementById('circle-x').value),
        y: parseInt(document.getElementById('circle-y').value),
        radius: parseInt(document.getElementById('circle-radius').value),
        fillColor: document.getElementById('circle-fill').value,
        strokeColor: document.getElementById('circle-stroke').value,
        fill: true,
        stroke: true
    };
    
    addElement(element);
}

// Add text to canvas
function addText() {
    const size = document.getElementById('text-size').value;
    const font = document.getElementById('text-font').value;
    const text = document.getElementById('text-content').value;
    
    if (!text) {
        showStatus('Please enter text content', 'error');
        return;
    }
    
    const element = {
        type: 'text',
        x: parseInt(document.getElementById('text-x').value),
        y: parseInt(document.getElementById('text-y').value),
        text: text,
        font: `${size}px ${font}`,
        color: document.getElementById('text-color').value
    };
    
    addElement(element);
}

// Add image to canvas
function addImage() {
    const url = document.getElementById('image-url').value;
    const width = document.getElementById('image-width').value;
    const height = document.getElementById('image-height').value;
    
    if (!url) {
        showStatus('Please enter an image URL', 'error');
        return;
    }
    
    const element = {
        type: 'image',
        x: parseInt(document.getElementById('image-x').value),
        y: parseInt(document.getElementById('image-y').value),
        url: url
    };
    
    if (width) element.width = parseInt(width);
    if (height) element.height = parseInt(height);
    
    addElement(element);
}

// Generic function to add element to canvas
function addElement(element) {
    canvasState.elements.push(element);
    
    showStatus(`${element.type.charAt(0).toUpperCase() + element.type.slice(1)} added successfully!`, 'success');
    updateCanvasInfo();
    refreshPreview();
}

// Refresh canvas preview
async function refreshPreview() {
    if (!canvas || !ctx) {
        return;
    }
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasState.width, canvasState.height);
    
    // Draw all elements
    for (const element of canvasState.elements) {
        await drawElement(ctx, element);
    }
    
    // Update preview image
    const preview = document.getElementById('canvas-preview');
    preview.src = canvas.toDataURL('image/png');
    preview.classList.add('visible');
    
    document.getElementById('preview-placeholder').style.display = 'none';
}

// Draw element on canvas
async function drawElement(ctx, element) {
    switch (element.type) {
        case 'rectangle':
            ctx.fillStyle = element.fillColor || '#000000';
            ctx.strokeStyle = element.strokeColor || '#000000';
            ctx.lineWidth = element.lineWidth || 2;
            
            if (element.fill !== false) {
                ctx.fillRect(element.x, element.y, element.width, element.height);
            }
            if (element.stroke !== false) {
                ctx.strokeRect(element.x, element.y, element.width, element.height);
            }
            break;
            
        case 'circle':
            ctx.fillStyle = element.fillColor || '#000000';
            ctx.strokeStyle = element.strokeColor || '#000000';
            ctx.lineWidth = element.lineWidth || 2;
            
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
            
            if (element.fill !== false) {
                ctx.fill();
            }
            if (element.stroke !== false) {
                ctx.stroke();
            }
            break;
            
        case 'text':
            ctx.fillStyle = element.color || '#000000';
            ctx.font = element.font || '16px Arial';
            ctx.textAlign = element.align || 'left';
            ctx.textBaseline = element.baseline || 'top';
            
            ctx.fillText(element.text, element.x, element.y);
            break;
            
        case 'image':
            try {
                const img = await loadImageAsync(element.url);
                const width = element.width || img.width;
                const height = element.height || img.height;
                ctx.drawImage(img, element.x, element.y, width, height);
            } catch (error) {
                console.error('Error loading image:', error);
                showStatus('Failed to load image: ' + element.url, 'error');
            }
            break;
    }
}

// Helper function to load image asynchronously
function loadImageAsync(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

// Clear all elements from canvas
function clearCanvas() {
    if (canvasState.elements.length === 0) {
        showStatus('Canvas is already empty', 'info');
        return;
    }
    
    if (!confirm('Are you sure you want to clear all elements?')) {
        return;
    }
    
    canvasState.elements = [];
    showStatus('Canvas cleared!', 'success');
    updateCanvasInfo();
    refreshPreview();
}

// Export canvas as PDF using jsPDF
async function exportPDF() {
    showStatus('Generating PDF... Please wait', 'info');
    
    try {
        // Check if jsPDF is loaded
        if (typeof window.jspdf === 'undefined') {
            showStatus('PDF library not loaded. Please refresh the page.', 'error');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        
        // Refresh canvas to ensure it's up to date
        await refreshPreview();
        
        // Calculate PDF dimensions (convert pixels to mm, assuming 96 DPI)
        const pxToMm = 0.264583;
        const pdfWidth = canvasState.width * pxToMm;
        const pdfHeight = canvasState.height * pxToMm;
        
        // Create PDF with custom dimensions
        const pdf = new jsPDF({
            orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
            unit: 'mm',
            format: [pdfWidth, pdfHeight],
            compress: true // Enable compression for smaller file size
        });
        
        // Get canvas as image data
        const imgData = canvas.toDataURL('image/jpeg', 0.85); // Use JPEG with 85% quality for compression
        
        // Add image to PDF
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        
        // Save PDF
        pdf.save('canvas-export.pdf');
        
        showStatus('PDF exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showStatus('Error exporting PDF: ' + error.message, 'error');
    }
}

// Update canvas info display
function updateCanvasInfo() {
    document.getElementById('info-dimensions').textContent = `${canvasState.width} x ${canvasState.height}`;
    document.getElementById('info-elements').textContent = canvasState.elements.length;
}

// Show status message
function showStatus(message, type) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    
    // Auto-hide after 5 seconds for success and info messages
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}
