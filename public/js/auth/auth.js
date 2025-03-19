/**
 * Firebase Authentication Module
 * 
 * Handles user authentication using Firebase Auth.
 * Includes login, logout, and user state management.
 */

// Get Firebase auth from the firebase services
const auth = window.firebaseServices.auth;
const db = window.firebaseServices.db;

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userProfile = document.getElementById('user-profile');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const authNotice = document.getElementById('auth-notice');
const demoContainer = document.getElementById('demo-container');

// Authentication state handler
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    userProfile.classList.remove('hidden');
    
    // Set user info
    userName.textContent = user.displayName || user.email;
    userAvatar.src = user.photoURL || 'assets/default-avatar.png';
    
    // Show demo container and hide auth notice
    authNotice.classList.add('hidden');
    demoContainer.classList.remove('hidden');
    
    // Save user to Firestore if needed (for first time users)
    saveUserToFirestore(user);
    
    // Load user's saved prompts
    loadSavedPrompts();
    
    console.log('User is signed in:', user.uid);
  } else {
    // User is signed out
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    userProfile.classList.add('hidden');
    
    // Hide demo container and show auth notice
    authNotice.classList.remove('hidden');
    demoContainer.classList.add('hidden');
    
    console.log('User is signed out');
  }
});

// Login with Google
loginBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  auth.signInWithPopup(provider)
    .then(result => {
      // Success, user is logged in
      console.log('Logged in successfully');
    })
    .catch(error => {
      // Handle errors
      console.error('Login error:', error.message);
      alert(`Login failed: ${error.message}`);
    });
});

// Logout
logoutBtn.addEventListener('click', () => {
  auth.signOut()
    .then(() => {
      // Sign-out successful
      console.log('Signed out successfully');
    })
    .catch(error => {
      // An error happened
      console.error('Logout error:', error);
      alert(`Logout failed: ${error.message}`);
    });
});

// Save user data to Firestore
function saveUserToFirestore(user) {
  const userRef = db.collection('users').doc(user.uid);
  
  // Check if user exists before adding
  userRef.get().then(doc => {
    if (!doc.exists) {
      // New user, create document
      userRef.set({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        console.log('New user saved to Firestore');
      }).catch(error => {
        console.error('Error saving user data:', error);
      });
    } else {
      // Existing user, update last login
      userRef.update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        console.log('User login timestamp updated');
      }).catch(error => {
        console.error('Error updating user data:', error);
      });
    }
  });
}

// Load user's saved prompts from Firestore
function loadSavedPrompts() {
  const user = auth.currentUser;
  if (!user) return;
  
  const savedPromptsList = document.getElementById('saved-prompts-list');
  savedPromptsList.innerHTML = '';
  
  db.collection('users').doc(user.uid).collection('prompts')
    .orderBy('timestamp', 'desc')
    .limit(10)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        savedPromptsList.innerHTML = '<p>No saved prompts yet. Start a conversation to save prompts.</p>';
        return;
      }
      
      querySnapshot.forEach(doc => {
        const promptData = doc.data();
        const promptCard = document.createElement('div');
        promptCard.className = 'saved-prompt-card';
        promptCard.textContent = promptData.text.substring(0, 100) + (promptData.text.length > 100 ? '...' : '');
        
        // Add click event to load the prompt
        promptCard.addEventListener('click', () => {
          document.getElementById('prompt-input').value = promptData.text;
        });
        
        savedPromptsList.appendChild(promptCard);
      });
    })
    .catch(error => {
      console.error('Error loading saved prompts:', error);
      savedPromptsList.innerHTML = '<p>Error loading saved prompts.</p>';
    });
}

// Export auth functions
window.authModule = {
  getCurrentUser: () => auth.currentUser,
  isUserLoggedIn: () => !!auth.currentUser,
  loadSavedPrompts
}; 