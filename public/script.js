// API Base URL - automatically detects environment
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://localhost:${window.location.port || 3000}`
    : window.location.origin;

let elementCount = 0;

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
async function initializeCanvas() {
    const width = document.getElementById('canvasWidth').value;
    const height = document.getElementById('canvasHeight').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/canvas/initialize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ width, height })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showStatus('Canvas initialized successfully!', 'success');
            updateCanvasInfo();
            refreshPreview();
        } else {
            showStatus(data.error || 'Failed to initialize canvas', 'error');
        }
    } catch (error) {
        showStatus('Error connecting to server: ' + error.message, 'error');
    }
}

// Add rectangle to canvas
async function addRectangle() {
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
    
    await addElement(element);
}

// Add circle to canvas
async function addCircle() {
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
    
    await addElement(element);
}

// Add text to canvas
async function addText() {
    const size = document.getElementById('text-size').value;
    const font = document.getElementById('text-font').value;
    
    const element = {
        type: 'text',
        x: parseInt(document.getElementById('text-x').value),
        y: parseInt(document.getElementById('text-y').value),
        text: document.getElementById('text-content').value,
        font: `${size}px ${font}`,
        color: document.getElementById('text-color').value
    };
    
    await addElement(element);
}

// Add image to canvas
async function addImage() {
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
    
    await addElement(element);
}

// Generic function to add element to canvas
async function addElement(element) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/canvas/add-element`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(element)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showStatus(`${element.type.charAt(0).toUpperCase() + element.type.slice(1)} added successfully!`, 'success');
            elementCount = data.totalElements;
            updateCanvasInfo();
            refreshPreview();
        } else {
            showStatus(data.error || 'Failed to add element', 'error');
        }
    } catch (error) {
        showStatus('Error connecting to server: ' + error.message, 'error');
    }
}

// Refresh canvas preview
async function refreshPreview() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/canvas/preview`);
        
        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            const preview = document.getElementById('canvas-preview');
            preview.src = imageUrl;
            preview.classList.add('visible');
            
            document.getElementById('preview-placeholder').style.display = 'none';
            showStatus('Preview updated!', 'info');
        } else {
            showStatus('Failed to generate preview', 'error');
        }
    } catch (error) {
        showStatus('Error loading preview: ' + error.message, 'error');
    }
}

// Clear all elements from canvas
async function clearCanvas() {
    if (!confirm('Are you sure you want to clear all elements?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/canvas/clear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showStatus('Canvas cleared!', 'success');
            elementCount = 0;
            updateCanvasInfo();
            refreshPreview();
        } else {
            showStatus(data.error || 'Failed to clear canvas', 'error');
        }
    } catch (error) {
        showStatus('Error connecting to server: ' + error.message, 'error');
    }
}

// Export canvas as PDF
async function exportPDF() {
    showStatus('Generating PDF... Please wait', 'info');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/canvas/export-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            // Create temporary download link
            const a = document.createElement('a');
            a.href = url;
            a.download = 'canvas-export.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            showStatus('PDF exported successfully!', 'success');
        } else {
            showStatus('Failed to export PDF', 'error');
        }
    } catch (error) {
        showStatus('Error exporting PDF: ' + error.message, 'error');
    }
}

// Update canvas info display
async function updateCanvasInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/canvas/state`);
        const data = await response.json();
        
        document.getElementById('info-dimensions').textContent = `${data.width} x ${data.height}`;
        document.getElementById('info-elements').textContent = data.elements.length;
    } catch (error) {
        console.error('Error updating canvas info:', error);
    }
}

// Show status message
function showStatus(message, type) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusDiv.classList.remove('success', 'error', 'info');
        statusDiv.style.display = 'none';
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCanvasInfo();
    showStatus('Ready! Initialize canvas to get started.', 'info');
});
