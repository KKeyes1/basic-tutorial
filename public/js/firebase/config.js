/**
 * Firebase Configuration
 * 
 * This file contains the Firebase configuration and initialization.
 * Replace the placeholder values with your own Firebase project details.
 */

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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