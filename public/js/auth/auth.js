/**
 * Firebase Authentication Module
 * 
 * This module handles user authentication with Firebase.
 * It provides methods for:
 * 1. Logging in with Google Authentication
 * 2. Logging out
 * 3. Managing authentication state changes
 * 4. Updating the UI based on authentication state
 * 
 * IMPLEMENTATION GUIDE:
 * 1. Make sure Firebase is properly initialized in config.js before using this module
 * 2. Add login/logout buttons in your HTML with IDs 'login-btn' and 'logout-btn'
 * 3. Create elements for user profile display with IDs 'user-profile', 'user-avatar', and 'user-name'
 * 4. Initialize this module when your app loads
 */

// Create a namespace for our authentication functionality
const authModule = (function() {
    // Private variables
    let currentUser = null;
    let authStateChangeListeners = [];
    
    /**
     * Initialize the Firebase auth provider for Google
     * @return {firebase.auth.GoogleAuthProvider} The configured provider
     */
    const initGoogleProvider = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        // Add additional OAuth scopes if needed
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        provider.setCustomParameters({
            'prompt': 'select_account' // Force account selection even if already logged in
        });
        return provider;
    };
    
    /**
     * Update UI elements based on auth state
     * @param {firebase.User} user - The current user or null if signed out
     */
    const updateUI = (user) => {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userProfile = document.getElementById('user-profile');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        
        if (user) {
            // User is signed in
            if (loginBtn) loginBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            if (userProfile) userProfile.classList.remove('hidden');
            
            // Update user info display
            if (userAvatar) userAvatar.src = user.photoURL || 'assets/default-avatar.png';
            if (userName) userName.textContent = user.displayName || 'User';
            
            // Store user in Firestore if needed
            storeUserProfile(user);
        } else {
            // User is signed out
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
            if (userProfile) userProfile.classList.add('hidden');
        }
        
        // Call all registered auth state change listeners
        authStateChangeListeners.forEach(listener => {
            try {
                listener(user);
            } catch (error) {
                console.error('Error in auth state change listener:', error);
            }
        });
    };
    
    /**
     * Store user profile in Firestore
     * This creates or updates the user document in Firestore
     * @param {firebase.User} user - The user to store
     */
    const storeUserProfile = (user) => {
        if (!user || !user.uid) return;
        
        // Reference to the user's document
        const userRef = firebase.firestore().collection('users').doc(user.uid);
        
        // User data to store
        const userData = {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Set with merge option to update existing document or create new one
        userRef.set(userData, { merge: true })
            .then(() => {
                console.log('User profile stored in Firestore');
            })
            .catch(error => {
                console.error('Error storing user profile:', error);
            });
    };
    
    /**
     * Handle errors that might occur during authentication
     * @param {Error} error - The error object
     * @return {string} A user-friendly error message
     */
    const handleAuthError = (error) => {
        console.error('Authentication error:', error);
        
        // Map common Firebase auth errors to user-friendly messages
        switch (error.code) {
            case 'auth/account-exists-with-different-credential':
                return 'An account already exists with the same email address but different sign-in credentials.';
            case 'auth/cancelled-popup-request':
                return 'The authentication request was cancelled.';
            case 'auth/popup-blocked':
                return 'The authentication popup was blocked by the browser. Please allow popups for this site.';
            case 'auth/popup-closed-by-user':
                return 'The authentication popup was closed before completing the sign-in.';
            case 'auth/user-disabled':
                return 'This user account has been disabled.';
            case 'auth/user-not-found':
                return 'User not found. Please check your credentials.';
            case 'auth/user-token-expired':
                return 'Your authentication session has expired. Please sign in again.';
            default:
                return error.message || 'An error occurred during authentication. Please try again.';
        }
    };
    
    // Public API
    return {
        /**
         * Initialize the authentication module
         * Sets up auth state observer and prepares UI
         */
        init: function() {
            console.log('Initializing authentication module...');
            
            // Set up authentication state observer
            firebase.auth().onAuthStateChanged(user => {
                console.log('Auth state changed:', user ? 'User signed in' : 'User signed out');
                currentUser = user;
                updateUI(user);
            });
            
            // Set up event listeners for auth buttons
            const loginBtn = document.getElementById('login-btn');
            const logoutBtn = document.getElementById('logout-btn');
            
            if (loginBtn) {
                loginBtn.addEventListener('click', () => {
                    this.signInWithGoogle();
                });
            }
            
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    this.signOut();
                });
            }
            
            console.log('Authentication module initialized');
        },
        
        /**
         * Sign in with Google
         * Opens a popup to authenticate with Google
         */
        signInWithGoogle: function() {
            const provider = initGoogleProvider();
            
            // Show loading state if needed
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                loginBtn.textContent = 'Signing in...';
                loginBtn.disabled = true;
            }
            
            firebase.auth().signInWithPopup(provider)
                .then(result => {
                    // This gives you a Google Access Token
                    // const token = result.credential.accessToken;
                    const user = result.user;
                    console.log('Successfully signed in user:', user.displayName);
                })
                .catch(error => {
                    const errorMessage = handleAuthError(error);
                    console.error('Sign-in error:', errorMessage);
                    
                    // Display error to user - you could add a UI element for this
                    alert(errorMessage);
                })
                .finally(() => {
                    // Reset button state
                    if (loginBtn) {
                        loginBtn.textContent = 'Login with Google';
                        loginBtn.disabled = false;
                    }
                });
        },
        
        /**
         * Sign out the current user
         */
        signOut: function() {
            firebase.auth().signOut()
                .then(() => {
                    console.log('User signed out successfully');
                })
                .catch(error => {
                    console.error('Error signing out:', error);
                });
        },
        
        /**
         * Get the current authenticated user
         * @return {firebase.User|null} The current user or null if not signed in
         */
        getCurrentUser: function() {
            return currentUser;
        },
        
        /**
         * Check if a user is currently signed in
         * @return {boolean} Whether a user is signed in
         */
        isUserSignedIn: function() {
            return !!currentUser;
        },
        
        /**
         * Register a listener for auth state changes
         * @param {Function} listener - The callback function that takes the user object
         */
        onAuthStateChanged: function(listener) {
            if (typeof listener === 'function') {
                authStateChangeListeners.push(listener);
                
                // Call the listener immediately with the current state
                listener(currentUser);
            }
        },
        
        /**
         * Remove a previously registered auth state change listener
         * @param {Function} listener - The callback function to remove
         */
        removeAuthStateListener: function(listener) {
            const index = authStateChangeListeners.indexOf(listener);
            if (index !== -1) {
                authStateChangeListeners.splice(index, 1);
            }
        }
    };
})();

// Expose the auth module to the global scope
window.authModule = authModule;

/**
 * AUTH IMPLEMENTATION CHECKLIST:
 * 
 * 1. Firebase Configuration:
 *    ✓ Initialize Firebase in config.js
 *    ✓ Enable Google Authentication in Firebase Console
 * 
 * 2. HTML Structure:
 *    ✓ Add login button with id="login-btn"
 *    ✓ Add logout button with id="logout-btn"
 *    ✓ Add user profile container with id="user-profile"
 *    ✓ Add user avatar image with id="user-avatar"
 *    ✓ Add user name element with id="user-name"
 * 
 * 3. Initialize Auth:
 *    ✓ Call authModule.init() when your app loads
 * 
 * 4. Handling Auth State:
 *    ✓ Use authModule.onAuthStateChanged() to respond to login/logout
 * 
 * 5. Security Rules:
 *    ✓ Update Firestore security rules to restrict data access
 *    ✓ Validate user authentication in your app logic
 * 
 * ADDITIONAL AUTH PROVIDERS:
 * To add more authentication providers (e.g., Email/Password, GitHub, etc.),
 * you would need to:
 * 
 * 1. Enable the provider in Firebase Console
 * 2. Create additional sign-in methods similar to signInWithGoogle
 * 3. Add UI elements for the new sign-in methods
 * 
 * ADVANCED FEATURES:
 * - Email verification
 * - Password reset
 * - Account linking
 * - Custom claims and user roles
 * 
 * SECURITY BEST PRACTICES:
 * - Always use security rules to protect your data
 * - Validate authentication on both client and server
 * - Use Firebase App Check in production
 * - Implement proper error handling
 * - Consider adding multi-factor authentication for sensitive applications
 */

// Example initialization code to include in your main.js or app.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication module
    authModule.init();
}); 