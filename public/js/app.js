/**
 * Main Application Script
 * 
 * This script initializes the application and ties together the Firebase and OpenAI modules.
 * It also handles UI interactions not specific to authentication or API calls.
 */

// Application Main JavaScript
// This file orchestrates the entire application's functionality
// Follow the step-by-step comments to understand the implementation

// ----- STEP 1: INITIALIZATION -----
// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    
    // Initialize navigation
    initNavigation();
    
    // Listen for auth state changes
    // This will handle login/logout UI updates automatically
    onAuthStateChanged();
    
    // Initialize event listeners for the demo section
    initDemoFeatures();
});

// ----- STEP 2: NAVIGATION -----
// Handle navigation between different sections of the tutorial
function initNavigation() {
    // This demonstrates simple spa-like navigation without a router
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('.page-section');
    
    // Add click listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target section id from the href attribute
            const targetId = link.getAttribute('href').substring(1);
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show the target section
            document.getElementById(targetId).classList.remove('hidden');
            
            // Update active link
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            link.classList.add('active');
            
            // Update URL without page reload (for better UX)
            history.pushState(null, '', `#${targetId}`);
        });
    });
    
    // Handle initial navigation based on URL hash
    const initialSection = window.location.hash.substring(1);
    if (initialSection && document.getElementById(initialSection)) {
        // Show the section from URL hash
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(initialSection).classList.remove('hidden');
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${initialSection}`) {
                link.classList.add('active');
            }
        });
    } else {
        // Default to the first section if no hash or invalid hash
        sections.forEach((section, index) => {
            if (index !== 0) {
                section.classList.add('hidden');
            }
        });
        navLinks[0].classList.add('active');
    }
}

// ----- STEP 3: AUTHENTICATION STATE HANDLING -----
// Listen for authentication state changes and update UI accordingly
function onAuthStateChanged() {
    // This should use Firebase's onAuthStateChanged listener
    // For detailed implementation, see auth.js
    
    // IMPORTANT: This relies on the auth module being properly implemented
    // If you haven't completed the Firebase Authentication section yet,
    // this function will not work correctly.
    
    firebase.auth().onAuthStateChanged(user => {
        const authContainer = document.getElementById('auth-container');
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userProfile = document.getElementById('user-profile');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const authNotice = document.getElementById('auth-notice');
        const demoContainer = document.getElementById('demo-container');
        
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.displayName);
            
            // Update UI for authenticated user
            if (loginBtn) loginBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            if (userProfile) userProfile.classList.remove('hidden');
            
            // Display user info
            if (userAvatar) userAvatar.src = user.photoURL || 'assets/default-avatar.png';
            if (userName) userName.textContent = user.displayName || 'User';
            
            // Show demo content, hide auth notice
            if (authNotice) authNotice.classList.add('hidden');
            if (demoContainer) demoContainer.classList.remove('hidden');
            
            // Load user's saved prompts from Firestore
            loadSavedPrompts(user.uid);
            
            // Check for OpenAI API key in session storage
            checkApiKey();
        } else {
            // User is signed out
            console.log('User is signed out');
            
            // Update UI for unauthenticated user
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
            if (userProfile) userProfile.classList.add('hidden');
            
            // Show auth notice, hide demo content
            if (authNotice) authNotice.classList.remove('hidden');
            if (demoContainer) demoContainer.classList.add('hidden');
            
            // Clear the messages container when logged out
            const messagesContainer = document.getElementById('messages-container');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
            
            // Clear saved prompts display
            const savedPromptsList = document.getElementById('saved-prompts-list');
            if (savedPromptsList) {
                savedPromptsList.innerHTML = '';
            }
        }
    });
}

// ----- STEP 4: DEMO FEATURES INITIALIZATION -----
// Initialize all interactive features in the demo section
function initDemoFeatures() {
    // Initialize OpenAI API key handling
    initApiKeyFeature();
    
    // Initialize chat interface
    initChatInterface();
}

// ----- STEP 5: OPENAI API KEY MANAGEMENT -----
// Handle saving and validating the OpenAI API key
function initApiKeyFeature() {
    const apiKeyInput = document.getElementById('api-key');
    const saveKeyBtn = document.getElementById('save-key-btn');
    const clearKeyBtn = document.getElementById('clear-key-btn');
    const apiKeyStatus = document.getElementById('api-key-status');
    
    // Check initial key state when component loads
    checkApiKey();
    
    // Listen for save key button clicks
    if (saveKeyBtn) {
        saveKeyBtn.addEventListener('click', () => {
            const apiKey = apiKeyInput.value.trim();
            
            // Basic validation - should be improved in a real app
            if (apiKey.length < 30 || !apiKey.startsWith('sk-')) {
                showApiKeyError('Invalid API key format. OpenAI API keys should start with "sk-" and be at least 30 characters.');
                return;
            }
            
            // Save key to session storage
            // IMPORTANT: This is NOT secure for production!
            // In a real app, you should use a backend service
            sessionStorage.setItem('openai_api_key', apiKey);
            
            // Update UI
            showApiKeySuccess('API key saved for this session');
            apiKeyInput.value = '';
            
            // Update status flag
            checkApiKey();
        });
    }
    
    // Listen for clear key button clicks
    if (clearKeyBtn) {
        clearKeyBtn.addEventListener('click', () => {
            // Remove key from session storage
            sessionStorage.removeItem('openai_api_key');
            
            // Update UI
            showApiKeySuccess('API key removed');
            
            // Update status flag
            checkApiKey();
        });
    }
}

// Check if API key exists in session storage and update UI
function checkApiKey() {
    const apiKey = sessionStorage.getItem('openai_api_key');
    const apiKeyStatus = document.getElementById('api-key-status');
    const clearKeyBtn = document.getElementById('clear-key-btn');
    const apiKeyInput = document.getElementById('api-key');
    const chatContainer = document.getElementById('chat-container');
    
    if (apiKey) {
        // Key exists
        if (apiKeyStatus) {
            apiKeyStatus.textContent = 'API key is configured for this session';
            apiKeyStatus.className = 'success';
        }
        
        // Show clear button, enable chat
        if (clearKeyBtn) clearKeyBtn.classList.remove('hidden');
        if (chatContainer) chatContainer.classList.remove('hidden');
    } else {
        // No key found
        if (apiKeyStatus) {
            apiKeyStatus.textContent = 'Please enter your OpenAI API key';
            apiKeyStatus.className = '';
        }
        
        // Hide clear button, disable chat
        if (clearKeyBtn) clearKeyBtn.classList.add('hidden');
        if (chatContainer) chatContainer.classList.add('hidden');
    }
}

// Show API key error message
function showApiKeyError(message) {
    const apiKeyStatus = document.getElementById('api-key-status');
    if (apiKeyStatus) {
        apiKeyStatus.textContent = message;
        apiKeyStatus.className = 'error';
        
        // Auto-hide the error after 5 seconds
        setTimeout(() => {
            apiKeyStatus.classList.add('fade-out');
            setTimeout(() => {
                checkApiKey(); // Revert to normal status display
                apiKeyStatus.classList.remove('fade-out');
            }, 500);
        }, 5000);
    }
}

// Show API key success message
function showApiKeySuccess(message) {
    const apiKeyStatus = document.getElementById('api-key-status');
    if (apiKeyStatus) {
        apiKeyStatus.textContent = message;
        apiKeyStatus.className = 'success';
        
        // Auto-hide the success message after 3 seconds
        setTimeout(() => {
            apiKeyStatus.classList.add('fade-out');
            setTimeout(() => {
                checkApiKey(); // Revert to normal status display
                apiKeyStatus.classList.remove('fade-out');
            }, 500);
        }, 3000);
    }
}

// ----- STEP 6: CHAT INTERFACE -----
// Initialize the chat interface for sending prompts to OpenAI
function initChatInterface() {
    const promptInput = document.getElementById('prompt-input');
    const sendPromptBtn = document.getElementById('send-prompt-btn');
    const messagesContainer = document.getElementById('messages-container');
    
    // Listen for send button clicks
    if (sendPromptBtn && promptInput) {
        sendPromptBtn.addEventListener('click', () => {
            sendPrompt();
        });
        
        // Also listen for Enter key in the textarea
        promptInput.addEventListener('keydown', (e) => {
            // Check if Enter was pressed without Shift (for new line)
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendPrompt();
            }
        });
    }
}

// Send a prompt to OpenAI and display the response
function sendPrompt() {
    const promptInput = document.getElementById('prompt-input');
    const messagesContainer = document.getElementById('messages-container');
    const prompt = promptInput.value.trim();
    
    // Don't send empty prompts
    if (!prompt) return;
    
    // Get the API key from session storage
    const apiKey = sessionStorage.getItem('openai_api_key');
    if (!apiKey) {
        showApiKeyError('API key is missing. Please enter your OpenAI API key.');
        return;
    }
    
    // Display user message in the chat
    addMessageToChat('user', prompt);
    
    // Clear input
    promptInput.value = '';
    
    // Add a status message
    const statusMessageId = addStatusMessage('Sending to OpenAI...');
    
    // Call OpenAI API
    // IMPORTANT: For the tutorial, we're calling OpenAI directly from the client
    // In production, you should use a backend service or Firebase Function
    callOpenAI(apiKey, prompt)
        .then(response => {
            // Display AI response
            addMessageToChat('ai', response);
            
            // Remove the status message
            removeStatusMessage(statusMessageId);
            
            // Save the conversation to Firestore
            savePromptToFirestore(prompt, response);
        })
        .catch(error => {
            console.error('Error calling OpenAI:', error);
            
            // Update status message to show error
            updateStatusMessage(statusMessageId, `Error: ${error.message}`, 'error');
            
            // Auto-remove the error message after 5 seconds
            setTimeout(() => {
                removeStatusMessage(statusMessageId);
            }, 5000);
        });
}

// ----- STEP 7: CHAT UI FUNCTIONS -----
// Add a message to the chat interface
function addMessageToChat(type, content) {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}-message`;
    messageEl.textContent = content;
    
    // Add to container
    messagesContainer.appendChild(messageEl);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add a status message to the chat
function addStatusMessage(content) {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return null;
    
    // Create unique ID for the status message
    const messageId = 'status-' + Date.now();
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = 'status-message';
    messageEl.id = messageId;
    messageEl.textContent = content;
    
    // Add to container
    messagesContainer.appendChild(messageEl);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageId;
}

// Update the content of a status message
function updateStatusMessage(messageId, content, type = '') {
    const messageEl = document.getElementById(messageId);
    if (messageEl) {
        messageEl.textContent = content;
        messageEl.className = `status-message ${type}`;
    }
}

// Remove a status message
function removeStatusMessage(messageId) {
    const messageEl = document.getElementById(messageId);
    if (messageEl) {
        // Fade out
        messageEl.classList.add('fade-out');
        
        // Remove after animation
        setTimeout(() => {
            messageEl.remove();
        }, 500);
    }
}

// ----- STEP 8: FIRESTORE INTEGRATION -----
// Save a prompt and response to Firestore
function savePromptToFirestore(prompt, response) {
    // IMPORTANT: This requires Firebase Authentication and Firestore
    // Make sure you've completed those sections of the tutorial first
    
    const user = firebase.auth().currentUser;
    if (!user) {
        console.error('User not authenticated');
        return;
    }
    
    // Create a reference to the user's prompts collection
    const promptsRef = firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('prompts');
    
    // Create the prompt document
    promptsRef.add({
        prompt: prompt,
        response: response,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(docRef => {
        console.log('Prompt saved with ID:', docRef.id);
        
        // Refresh the prompts list
        loadSavedPrompts(user.uid);
    })
    .catch(error => {
        console.error('Error saving prompt:', error);
    });
}

// Load saved prompts from Firestore
function loadSavedPrompts(userId) {
    // This function retrieves the user's saved prompts from Firestore
    // and displays them in the saved-prompts-list section
    
    const savedPromptsList = document.getElementById('saved-prompts-list');
    const savedPromptsSection = document.getElementById('saved-prompts');
    
    // Show loading indicator
    if (savedPromptsList) {
        savedPromptsList.innerHTML = '<div class="loading">Loading saved prompts...</div>';
    }
    
    // Query Firestore for the user's prompts
    firebase.firestore()
        .collection('users')
        .doc(userId)
        .collection('prompts')
        .orderBy('timestamp', 'desc')
        .limit(10) // Limit to most recent 10 for performance
        .get()
        .then(querySnapshot => {
            // Clear the loading message
            if (savedPromptsList) {
                savedPromptsList.innerHTML = '';
            }
            
            // Check if there are any prompts
            if (querySnapshot.empty) {
                if (savedPromptsList) {
                    savedPromptsList.innerHTML = '<div class="no-prompts">No saved prompts yet.</div>';
                }
                return;
            }
            
            // Display each prompt
            querySnapshot.forEach(doc => {
                const data = doc.data();
                addPromptToList(doc.id, data.prompt, data.response, data.timestamp);
            });
            
            // Show the saved prompts section
            if (savedPromptsSection) {
                savedPromptsSection.classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('Error loading prompts:', error);
            if (savedPromptsList) {
                savedPromptsList.innerHTML = `<div class="error">Error loading prompts: ${error.message}</div>`;
            }
        });
}

// Add a prompt to the saved prompts list
function addPromptToList(id, prompt, response, timestamp) {
    const savedPromptsList = document.getElementById('saved-prompts-list');
    if (!savedPromptsList) return;
    
    // Create card element
    const card = document.createElement('div');
    card.className = 'saved-prompt-card';
    card.dataset.id = id;
    
    // Format timestamp
    let timeDisplay = 'Just now';
    if (timestamp) {
        // Convert Firebase timestamp to JS Date
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        timeDisplay = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    
    // Create content
    const promptText = prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt;
    card.innerHTML = `
        <div class="prompt-text">${promptText}</div>
        <div class="prompt-time">${timeDisplay}</div>
    `;
    
    // Add click listener to reload the conversation
    card.addEventListener('click', () => {
        // Add user message to chat
        addMessageToChat('user', prompt);
        
        // Add AI response to chat
        addMessageToChat('ai', response);
        
        // Scroll chat into view
        document.getElementById('chat-container').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Add to container
    savedPromptsList.appendChild(card);
}

// ----- STEP 9: OPENAI API INTEGRATION -----
// Call the OpenAI API with the prompt
// This function should be implemented in openai/api.js
// It is referenced here for completeness
function callOpenAI(apiKey, prompt) {
    // This function should be implemented in the OpenAI API module
    // Refer to openai/api.js for the implementation
    // Generally, it should:
    // 1. Make a fetch request to OpenAI's API
    // 2. Handle response parsing and error conditions
    // 3. Return a promise with the response text
    
    return openaiApi.sendPrompt(prompt, apiKey);
}

// --- NOTES FOR TUTORIAL USERS ---
/*
IMPORTANT IMPLEMENTATION NOTES:

1. SECURITY WARNING:
   This tutorial uses client-side storage for the OpenAI API key for simplicity.
   In a production environment, you should NEVER store API keys on the client.
   Use Firebase Cloud Functions or a backend service instead.

2. ERROR HANDLING:
   The error handling in this demo is basic. In a real application, you should:
   - Implement more robust error handling
   - Show more user-friendly error messages
   - Handle network failures and retries

3. PERFORMANCE:
   For better performance in a real app:
   - Implement pagination for saved prompts
   - Use Firestore snapshot listeners for real-time updates
   - Consider caching frequent responses

4. NEXT STEPS AFTER COMPLETING THIS TUTORIAL:
   - Implement a Firebase Cloud Function for OpenAI API calls
   - Add user settings for customizing AI parameters
   - Implement conversation threads/history
   - Add better UI feedback during loading states
*/ 