const express = require('express');
const cors = require('cors');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// In-memory storage for canvas state
let canvasState = {
  width: 800,
  height: 600,
  elements: []
};

// Initialize canvas endpoint
app.post('/api/canvas/initialize', (req, res) => {
  const { width, height } = req.body;
  
  if (!width || !height || width <= 0 || height <= 0) {
    return res.status(400).json({ error: 'Invalid canvas dimensions' });
  }
  
  canvasState = {
    width: parseInt(width),
    height: parseInt(height),
    elements: []
  };
  
  res.json({ 
    message: 'Canvas initialized successfully',
    canvas: canvasState
  });
});

// Add element to canvas endpoint
app.post('/api/canvas/add-element', (req, res) => {
  const element = req.body;
  
  if (!element.type) {
    return res.status(400).json({ error: 'Element type is required' });
  }
  
  // Validate element based on type
  switch (element.type) {
    case 'rectangle':
      if (!element.x || !element.y || !element.width || !element.height) {
        return res.status(400).json({ error: 'Rectangle requires x, y, width, and height' });
      }
      break;
    case 'circle':
      if (!element.x || !element.y || !element.radius) {
        return res.status(400).json({ error: 'Circle requires x, y, and radius' });
      }
      break;
    case 'text':
      if (!element.x || !element.y || !element.text) {
        return res.status(400).json({ error: 'Text requires x, y, and text content' });
      }
      break;
    case 'image':
      if (!element.x || !element.y || !element.url) {
        return res.status(400).json({ error: 'Image requires x, y, and url' });
      }
      break;
    default:
      return res.status(400).json({ error: 'Invalid element type' });
  }
  
  canvasState.elements.push(element);
  
  res.json({ 
    message: 'Element added successfully',
    element: element,
    totalElements: canvasState.elements.length
  });
});

// Get canvas preview as image
app.get('/api/canvas/preview', async (req, res) => {
  try {
    const canvas = createCanvas(canvasState.width, canvasState.height);
    const ctx = canvas.getContext('2d');
    
    // Fill background with white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasState.width, canvasState.height);
    
    // Draw all elements
    for (const element of canvasState.elements) {
      await drawElement(ctx, element);
    }
    
    // Convert to PNG and send
    const buffer = canvas.toBuffer('image/png');
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

// Export canvas as PDF
app.post('/api/canvas/export-pdf', async (req, res) => {
  try {
    // Create canvas with current state
    const canvas = createCanvas(canvasState.width, canvasState.height);
    const ctx = canvas.getContext('2d');
    
    // Fill background with white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasState.width, canvasState.height);
    
    // Draw all elements
    for (const element of canvasState.elements) {
      await drawElement(ctx, element);
    }
    
    // Convert canvas to image buffer
    const imageBuffer = canvas.toBuffer('image/png');
    
    // Create PDF document with compression
    const doc = new PDFDocument({
      size: [canvasState.width, canvasState.height],
      compress: true, // Enable compression for size reduction
      autoFirstPage: false
    });
    
    // Add page
    doc.addPage({
      size: [canvasState.width, canvasState.height],
      margin: 0
    });
    
    // Add image to PDF
    doc.image(imageBuffer, 0, 0, {
      width: canvasState.width,
      height: canvasState.height
    });
    
    // Finalize PDF
    doc.end();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=canvas-export.pdf');
    
    // Pipe PDF to response
    doc.pipe(res);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
});

// Get current canvas state
app.get('/api/canvas/state', (req, res) => {
  res.json(canvasState);
});

// Clear canvas
app.post('/api/canvas/clear', (req, res) => {
  canvasState.elements = [];
  res.json({ 
    message: 'Canvas cleared successfully',
    canvas: canvasState
  });
});

// Helper function to draw elements on canvas
async function drawElement(ctx, element) {
  switch (element.type) {
    case 'rectangle':
      ctx.fillStyle = element.fillColor || '#000000';
      ctx.strokeStyle = element.strokeColor || '#000000';
      ctx.lineWidth = element.lineWidth || 1;
      
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
      ctx.lineWidth = element.lineWidth || 1;
      
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
        const image = await loadImage(element.url);
        const width = element.width || image.width;
        const height = element.height || image.height;
        ctx.drawImage(image, element.x, element.y, width, height);
      } catch (error) {
        console.error('Error loading image:', error);
      }
      break;
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the application`);
});
