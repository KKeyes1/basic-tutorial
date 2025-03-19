/**
 * Firebase Configuration
 * 
 * This file contains the Firebase configuration and initialization.
 * Replace the placeholder values with your own Firebase project details.
 */

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw7xBvGo25u32YxB2CBn6ctHgyfuEzsFY",
  authDomain: "tutorial-a5216.firebaseapp.com",
  projectId: "tutorial-a5216",
  storageBucket: "tutorial-a5216.firebasestorage.app",
  messagingSenderId: "948135132959",
  appId: "1:948135132959:web:d943e2ae7b101ac32a7a2a",
  measurementId: "G-WQTMP8P7EG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable Firestore offline persistence when supported
firebase.firestore().enablePersistence({ synchronizeTabs: true })
  .catch(err => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required for persistence
      console.log('Persistence not supported in this browser');
    }
  });

// Export Firebase services
window.firebaseServices = {
  auth,
  db
};

// Initialize authentication and API modules when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Firebase initialized successfully');
  
  // Initialize authentication module if available
  if (window.authModule && typeof window.authModule.init === 'function') {
    window.authModule.init();
  }
  
  // Initialize OpenAI module if available
  if (window.openaiModule && typeof window.openaiModule.init === 'function') {
    window.openaiModule.init();
  }
}); 