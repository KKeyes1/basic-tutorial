/**
 * Simple local development server for Firebase + OpenAI Demo
 * 
 * This file provides a simple HTTP server to test the application locally.
 * Run with: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 5000;

const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Default to index.html for root URL
  let filePath = req.url === '/' 
    ? path.join(__dirname, 'public', 'index.html') 
    : path.join(__dirname, 'public', req.url);
  
  // Get the file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Handle direct assets/ requests
  if (!fs.existsSync(filePath) && req.url.startsWith('/assets/')) {
    filePath = path.join(__dirname, 'public', req.url);
  }
  
  // Set the content type based on the file extension
  const contentType = contentTypes[extname] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found, try serving index.html (for SPA)
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`Press Ctrl+C to stop the server`);
}); 