# 🎨 Canvas Builder with PDF Export

A full-stack application for creating custom canvas drawings and exporting them as high-quality PDF files. Built with Node.js backend and vanilla JavaScript frontend, deployable on both traditional servers and GitHub Pages.

## 🌟 Features

- **Canvas Initialization**: Set up a canvas with customizable dimensions
- **Add Visual Elements**:
  - 📐 Rectangles with customizable colors
  - ⭕ Circles with customizable colors
  - 📝 Text with various fonts and sizes
  - 🖼️ Images from URLs
- **Live Preview**: Real-time canvas preview as you add elements
- **PDF Export**: Export your canvas as a high-quality, compressed PDF file
- **Dual Deployment**: Works with both Node.js backend and as a static site on GitHub Pages

## 🚀 Live Demo

Visit the live application: [https://sksinha2410.github.io/canvas-to-pdf/](https://sksinha2410.github.io/canvas-to-pdf/)

## 📸 Screenshots

![Canvas Builder Interface](https://github.com/user-attachments/assets/bb17526d-3918-4550-8ea8-3d60af752433)
*Main interface with canvas settings and element controls*

![Canvas with Elements](https://github.com/user-attachments/assets/7e2026df-b65e-4f38-9f19-156636bf510c)
*Canvas preview showing rectangle, circle, and text elements*

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Features in Detail](#features-in-detail)

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3 (with modern gradients and animations)
- Vanilla JavaScript
- HTML5 Canvas API
- jsPDF library for client-side PDF generation

### Backend (Optional - for server deployment)
- Node.js
- Express.js
- canvas (node-canvas) for server-side canvas manipulation
- PDFKit for PDF generation
- CORS for cross-origin requests

## 📦 Installation

### Option 1: Static Site (GitHub Pages)

No installation needed! Simply open `public/index.html` in a web browser or deploy to GitHub Pages.

### Option 2: Node.js Backend

1. Clone the repository:
```bash
git clone https://github.com/sksinha2410/canvas-to-pdf.git
cd canvas-to-pdf
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 💻 Usage

### Step 1: Initialize Canvas
1. Set your desired canvas dimensions (width and height in pixels)
2. Click "Initialize Canvas"

### Step 2: Add Elements
Choose from the available element types:

#### Rectangle
- Set position (X, Y coordinates)
- Set dimensions (width, height)
- Choose fill and stroke colors
- Click "Add Rectangle"

#### Circle
- Set center position (X, Y coordinates)
- Set radius
- Choose fill and stroke colors
- Click "Add Circle"

#### Text
- Set position (X, Y coordinates)
- Enter text content
- Choose font size and family
- Select text color
- Click "Add Text"

#### Image
- Set position (X, Y coordinates)
- Enter image URL (must be publicly accessible)
- Optionally set custom width and height
- Click "Add Image"

### Step 3: Preview
- Click "Refresh Preview" to see your current canvas
- The preview updates automatically after adding elements

### Step 4: Export
- Click "Export as PDF" to download your canvas as a PDF file
- The PDF is automatically compressed for optimal file size

### Step 5: Manage Canvas
- Click "Clear Canvas" to remove all elements and start over
- View canvas info panel for current dimensions and element count

## 📚 API Documentation

### Backend API Endpoints (when using Node.js server)

#### Initialize Canvas
```http
POST /api/canvas/initialize
Content-Type: application/json

{
  "width": 800,
  "height": 600
}
```

#### Add Element
```http
POST /api/canvas/add-element
Content-Type: application/json

// Rectangle
{
  "type": "rectangle",
  "x": 50,
  "y": 50,
  "width": 200,
  "height": 100,
  "fillColor": "#3498db",
  "strokeColor": "#2c3e50"
}

// Circle
{
  "type": "circle",
  "x": 150,
  "y": 150,
  "radius": 50,
  "fillColor": "#e74c3c",
  "strokeColor": "#c0392b"
}

// Text
{
  "type": "text",
  "x": 100,
  "y": 100,
  "text": "Hello, Canvas!",
  "font": "24px Arial",
  "color": "#2c3e50"
}

// Image
{
  "type": "image",
  "x": 100,
  "y": 100,
  "url": "https://example.com/image.png",
  "width": 200,
  "height": 150
}
```

#### Get Canvas Preview
```http
GET /api/canvas/preview
```
Returns: PNG image

#### Export as PDF
```http
POST /api/canvas/export-pdf
```
Returns: PDF file download

#### Get Canvas State
```http
GET /api/canvas/state
```
Returns: Current canvas configuration and elements

#### Clear Canvas
```http
POST /api/canvas/clear
```

## 🌐 Deployment

### GitHub Pages (Recommended)

The application is designed to work seamlessly on GitHub Pages with client-side rendering.

1. **Push your code to GitHub repository**

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select source branch (usually `main` or `master`)
   - Select folder: `/ (root)`
   - Save and wait for deployment

3. **Access your site at:**
   ```
   https://[username].github.io/[repository-name]/
   ```

4. **No build process required** - The application uses vanilla JavaScript and runs entirely in the browser

**Note:** The root directory contains `index.html`, `styles.css`, and `app.js` for GitHub Pages deployment. The `public/` directory contains the same files for local testing or server deployment.

### Vercel (Alternative)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

### Traditional Server

1. Set up Node.js on your server
2. Clone the repository
3. Install dependencies: `npm install`
4. Set PORT environment variable if needed
5. Start with process manager: `pm2 start server.js`

## 📁 Project Structure

```
canvas-to-pdf/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Styling
│   ├── app.js             # Client-side logic (for GitHub Pages)
│   └── script.js          # Backend API client (for Node.js deployment)
├── server.js              # Express server with API endpoints
├── package.json           # Dependencies and scripts
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## ✨ Features in Detail

### Canvas Manipulation
- **HTML5 Canvas API**: Utilizes native browser canvas for rendering
- **Layered Drawing**: Elements are drawn in the order they are added
- **Flexible Positioning**: Precise pixel-level control over element placement

### PDF Export with Compression
- **jsPDF Integration**: Client-side PDF generation for GitHub Pages deployment
- **PDFKit**: Server-side PDF generation with advanced features
- **Compression**: 
  - JPEG encoding at 85% quality (client-side)
  - Built-in compression enabled (server-side)
  - Optimized for file size while maintaining quality

### User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive Controls**: Tabbed interface for different element types
- **Real-time Feedback**: Status messages for all operations
- **Live Preview**: See your canvas update in real-time

### Image Support
- **URL-based Images**: Load images from any publicly accessible URL
- **CORS-friendly**: Handles cross-origin images appropriately
- **Flexible Sizing**: Auto-size or custom dimensions

## 🔧 Configuration

### Canvas Size Limits
- Minimum: 100x100 pixels
- Maximum: 2000x2000 pixels
- Recommended: 800x600 to 1920x1080 pixels

### Supported Image Formats
- PNG
- JPEG
- GIF
- SVG (with limitations)
- WebP (browser-dependent)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Created for demonstrating full-stack canvas manipulation and PDF export capabilities.

## 🙏 Acknowledgments

- jsPDF for client-side PDF generation
- node-canvas for server-side canvas manipulation
- PDFKit for server-side PDF generation
- Express.js for backend API framework