/**
 * Main Application Script
 * 
 * This script initializes the application and ties together the Firebase and OpenAI modules.
 * It also handles UI interactions not specific to authentication or API calls.
 */

// DOM Elements - Navigation
const navLinks = document.querySelectorAll('nav ul li a');

// Initialize the application
function initializeApp() {
  console.log('Initializing application...');
  
  // Set up navigation
  setupNavigation();
  
  // Check Firebase connection
  checkFirebaseConnection();
  
  // Handle page load - show default section
  showSection(window.location.hash || '#setup');
  
  console.log('Application initialized');
}

// Set up navigation
function setupNavigation() {
  // Add click event to navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Get the target section from the href attribute
      const targetSection = link.getAttribute('href');
      
      // Show the target section
      showSection(targetSection);
    });
  });
  
  // Handle hash change
  window.addEventListener('hashchange', () => {
    showSection(window.location.hash);
  });
}

// Show a specific section and hide others
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Show the target section
  const targetSection = document.querySelector(sectionId);
  if (targetSection) {
    targetSection.style.display = 'block';
    
    // Update active navigation link
    navLinks.forEach(link => {
      if (link.getAttribute('href') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Check Firebase connection
function checkFirebaseConnection() {
  // Reference to a Firebase service
  const connectedRef = firebase.database().ref('.info/connected');
  
  connectedRef.on('value', (snap) => {
    if (snap.val() === true) {
      console.log('Connected to Firebase');
    } else {
      console.log('Disconnected from Firebase');
    }
  });
}

// Add copy functionality to code snippets
function setupCodeSnippets() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-btn');
    copyButton.textContent = 'Copy';
    
    // Add button to parent (pre element)
    block.parentNode.classList.add('code-container');
    block.parentNode.appendChild(copyButton);
    
    // Add click event to copy button
    copyButton.addEventListener('click', () => {
      // Copy code to clipboard
      const code = block.textContent;
      navigator.clipboard.writeText(code).then(() => {
        // Show success message
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy code: ', err);
      });
    });
  });
}

// Handle demonstration setup
function setupDemonstration() {
  // This function can be expanded to include additional demo functionality
  console.log('Setting up demonstration features...');
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupCodeSnippets();
  setupDemonstration();
}); 