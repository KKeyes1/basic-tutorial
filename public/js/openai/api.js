/**
 * OpenAI API Integration Module
 * 
 * This module handles all OpenAI API interactions for the application.
 * It provides methods for:
 * 1. Managing API keys securely (client-side only, for tutorial purposes)
 * 2. Making requests to the OpenAI Chat Completions API
 * 3. Processing responses and handling errors
 * 
 * SECURITY WARNING: In a production application, you should NEVER store
 * API keys on the client side. Instead, use Firebase Cloud Functions or
 * a backend service to make the API calls on behalf of your clients.
 * 
 * This implementation is for EDUCATIONAL PURPOSES ONLY.
 */

// Create a namespace for our OpenAI API functionality
const openaiApi = (function() {
    // Private variables and functions
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const DEFAULT_MODEL = 'gpt-3.5-turbo'; // You can change this to a different model as needed
    
    /**
     * Validate an OpenAI API key format
     * This is just a basic check - the only true validation is making an API call
     * @param {string} apiKey - The API key to validate
     * @return {boolean} Whether the key format is valid
     */
    const validateApiKeyFormat = (apiKey) => {
        // Basic validation: OpenAI keys start with "sk-" and are at least 30 chars
        return apiKey && apiKey.startsWith('sk-') && apiKey.length >= 30;
    };
    
    /**
     * Generate headers for the OpenAI API request
     * @param {string} apiKey - The OpenAI API key
     * @return {Object} Headers object for fetch
     */
    const getHeaders = (apiKey) => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };
    };
    
    /**
     * Format the request body for the chat completions API
     * @param {string} prompt - The user's prompt
     * @param {Object} options - Additional options like temperature, max_tokens, etc.
     * @return {Object} The formatted request body
     */
    const formatRequestBody = (prompt, options = {}) => {
        // Create a default request body
        const body = {
            model: options.model || DEFAULT_MODEL,
            messages: [
                {
                    role: "system",
                    content: options.systemPrompt || "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1000,
            top_p: options.topP || 1,
            frequency_penalty: options.frequencyPenalty || 0,
            presence_penalty: options.presencePenalty || 0
        };
        
        return body;
    };
    
    /**
     * Parse the API response and extract the assistant's reply
     * @param {Object} responseData - The response data from the API
     * @return {string} The extracted reply text
     */
    const parseResponse = (responseData) => {
        if (!responseData.choices || responseData.choices.length === 0) {
            throw new Error('Invalid response from OpenAI API');
        }
        
        return responseData.choices[0].message.content.trim();
    };
    
    /**
     * Extract meaningful error messages from API errors
     * @param {Error} error - The error object
     * @return {string} A user-friendly error message
     */
    const handleApiError = (error) => {
        console.error('OpenAI API Error:', error);
        
        // If we have a response from the API with an error message
        if (error.response && error.response.data && error.response.data.error) {
            const apiError = error.response.data.error;
            
            // Handle common error types
            if (apiError.type === 'invalid_request_error') {
                return 'Invalid request to OpenAI API. Please check your inputs.';
            } else if (apiError.type === 'authentication_error') {
                return 'Authentication error. Your API key may be invalid or expired.';
            } else if (apiError.type === 'rate_limit_error') {
                return 'Rate limit exceeded. Please try again later.';
            } else if (apiError.code === 'context_length_exceeded') {
                return 'Your prompt is too long for the current model. Please try a shorter prompt.';
            } else {
                return apiError.message || 'Error from OpenAI API. Please try again.';
            }
        }
        
        // Network errors
        if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
            return 'Network error. Please check your internet connection.';
        }
        
        // Default error message
        return 'Error communicating with OpenAI. Please try again later.';
    };
    
    // Public API
    return {
        /**
         * Check if an API key is stored in session storage
         * @return {boolean} Whether an API key exists
         */
        hasApiKey: function() {
            return !!sessionStorage.getItem('openai_api_key');
        },
        
        /**
         * Get the API key from session storage
         * @return {string|null} The API key or null if not set
         */
        getApiKey: function() {
            return sessionStorage.getItem('openai_api_key');
        },
        
        /**
         * Save an API key to session storage
         * @param {string} apiKey - The API key to save
         * @return {boolean} Whether the key was saved successfully
         */
        saveApiKey: function(apiKey) {
            if (!validateApiKeyFormat(apiKey)) {
                return false;
            }
            
            try {
                sessionStorage.setItem('openai_api_key', apiKey);
                return true;
            } catch (error) {
                console.error('Error saving API key:', error);
                return false;
            }
        },
        
        /**
         * Clear the API key from session storage
         */
        clearApiKey: function() {
            sessionStorage.removeItem('openai_api_key');
        },
        
        /**
         * Send a prompt to the OpenAI API
         * @param {string} prompt - The user's prompt
         * @param {string} apiKey - The OpenAI API key
         * @param {Object} options - Additional options for the API call
         * @return {Promise<string>} A promise that resolves to the AI's response
         */
        sendPrompt: function(prompt, apiKey, options = {}) {
            // Validate inputs
            if (!prompt || prompt.trim() === '') {
                return Promise.reject(new Error('Prompt cannot be empty'));
            }
            
            if (!apiKey || !validateApiKeyFormat(apiKey)) {
                return Promise.reject(new Error('Invalid API key format'));
            }
            
            // Prepare the request
            const requestOptions = {
                method: 'POST',
                headers: getHeaders(apiKey),
                body: JSON.stringify(formatRequestBody(prompt, options))
            };
            
            // Make the API request
            return fetch(API_URL, requestOptions)
                .then(response => {
                    // Check for HTTP errors
                    if (!response.ok) {
                        // Try to get the error message from the response
                        return response.json().then(data => {
                            throw {
                                status: response.status,
                                response: { data }
                            };
                        }).catch(err => {
                            // If we can't parse the JSON, use a generic error
                            if (err.status) {
                                throw err;
                            } else {
                                throw {
                                    status: response.status,
                                    message: `HTTP error ${response.status}: ${response.statusText}`
                                };
                            }
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    // Parse the successful response
                    return parseResponse(data);
                })
                .catch(error => {
                    // Handle and transform errors
                    const errorMessage = handleApiError(error);
                    throw new Error(errorMessage);
                });
        },
        
        /**
         * Ping the OpenAI API to verify an API key
         * This makes a minimal request to check if the key is valid
         * @param {string} apiKey - The API key to verify
         * @return {Promise<boolean>} A promise that resolves to whether the key is valid
         */
        verifyApiKey: function(apiKey) {
            if (!apiKey || !validateApiKeyFormat(apiKey)) {
                return Promise.resolve(false);
            }
            
            // Make a minimal request to check the key
            const requestOptions = {
                method: 'POST',
                headers: getHeaders(apiKey),
                body: JSON.stringify(formatRequestBody('Hello, this is a test.', {
                    maxTokens: 5 // Minimal tokens to save usage
                }))
            };
            
            return fetch(API_URL, requestOptions)
                .then(response => {
                    return response.ok;
                })
                .catch(() => {
                    return false;
                });
        }
    };
})();

// Initialize OpenAI module
function init() {
    console.log('Initializing OpenAI API module...');
    
    // Find DOM elements
    const apiKeyInput = document.getElementById('api-key');
    const saveKeyBtn = document.getElementById('save-key-btn');
    const clearKeyBtn = document.getElementById('clear-key-btn');
    const promptInput = document.getElementById('prompt-input');
    const sendPromptBtn = document.getElementById('send-prompt-btn');
    const messagesContainer = document.getElementById('messages-container');
    
    // Check for API key in session storage
    const savedApiKey = openaiApi.getApiKey();
    if (savedApiKey && apiKeyInput) {
        // Display masked key
        apiKeyInput.value = '••••••••••••••••••••••••••';
    }
    
    // Setup API key input event
    if (apiKeyInput) {
        apiKeyInput.addEventListener('change', () => {
            const newApiKey = apiKeyInput.value.trim();
            
            if (newApiKey && newApiKey !== '••••••••••••••••••••••••••') {
                // Validate and save key
                if (openaiApi.saveApiKey(newApiKey)) {
                    console.log('API key saved to session storage');
                    apiKeyInput.value = '••••••••••••••••••••••••••';
                    displayStatusMessage('API key saved for this session', 'success');
                } else {
                    displayStatusMessage('Invalid API key format', 'error');
                }
            }
        });
    }
    
    // Setup save key button event
    if (saveKeyBtn) {
        saveKeyBtn.addEventListener('click', () => {
            const newApiKey = apiKeyInput.value.trim();
            
            if (newApiKey && newApiKey !== '••••••••••••••••••••••••••') {
                // Validate and save key
                if (openaiApi.saveApiKey(newApiKey)) {
                    console.log('API key saved to session storage');
                    apiKeyInput.value = '••••••••••••••••••••••••••';
                    displayStatusMessage('API key saved for this session', 'success');
                } else {
                    displayStatusMessage('Invalid API key format', 'error');
                }
            }
        });
    }
    
    // Setup clear key button event
    if (clearKeyBtn) {
        clearKeyBtn.addEventListener('click', () => {
            openaiApi.clearApiKey();
            apiKeyInput.value = '';
            displayStatusMessage('API key removed', 'success');
        });
    }
    
    // Setup send button event
    if (sendPromptBtn && promptInput) {
        sendPromptBtn.addEventListener('click', handleSendPrompt);
        
        // Also listen for Enter key
        promptInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendPrompt();
            }
        });
    }
    
    console.log('OpenAI API module initialized');
}

// Handle sending prompts to OpenAI
function handleSendPrompt() {
    const promptInput = document.getElementById('prompt-input');
    const messagesContainer = document.getElementById('messages-container');
    
    if (!promptInput || !messagesContainer) return;
    
    const promptText = promptInput.value.trim();
    
    if (!promptText) {
        displayStatusMessage('Please enter a prompt', 'error');
        return;
    }
    
    const apiKey = openaiApi.getApiKey();
    if (!apiKey) {
        displayStatusMessage('Please enter an OpenAI API key', 'error');
        const apiKeyInput = document.getElementById('api-key');
        if (apiKeyInput) apiKeyInput.focus();
        return;
    }
    
    // Check authentication
    const user = firebase.auth().currentUser;
    if (!user) {
        displayStatusMessage('Please log in to use this feature', 'error');
        return;
    }
    
    // Display user message
    displayMessage(promptText, 'user');
    
    // Clear input
    promptInput.value = '';
    
    // Show loading indicator
    const loadingId = displayLoadingMessage();
    
    // Call OpenAI API
    openaiApi.sendPrompt(promptText, apiKey)
        .then(response => {
            // Remove loading indicator
            removeStatusMessage(loadingId);
            
            // Display AI response
            displayMessage(response, 'ai');
            
            // Save conversation to Firestore
            saveToFirestore(promptText, response);
        })
        .catch(error => {
            // Remove loading indicator
            removeStatusMessage(loadingId);
            
            // Display error
            displayStatusMessage(`Error: ${error.message}`, 'error');
            console.error('Error calling OpenAI API:', error);
        });
}

// Display a message in the chat interface
function displayMessage(text, sender) {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    // Format the text with markdown-like syntax (simple version)
    const formattedText = text
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    
    messageElement.innerHTML = formattedText;
    messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Display a status message
function displayStatusMessage(message, type) {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return null;
    
    const messageId = 'status-' + Date.now();
    const statusElement = document.createElement('div');
    statusElement.className = `message status-message ${type || ''}`;
    statusElement.id = messageId;
    statusElement.textContent = message;
    messagesContainer.appendChild(statusElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Auto-remove after a few seconds for non-error messages
    if (type !== 'error') {
        setTimeout(() => {
            removeStatusMessage(messageId);
        }, 3000);
    }
    
    return messageId;
}

// Display loading indicator
function displayLoadingMessage() {
    return displayStatusMessage('AI is thinking...', 'loading');
}

// Remove a status message
function removeStatusMessage(messageId) {
    const messageEl = document.getElementById(messageId);
    if (!messageEl) return;
    
    messageEl.classList.add('fade-out');
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 500);
}

// Save conversation to Firestore
function saveToFirestore(prompt, response) {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    // Save prompt to user's prompts collection
    firebase.firestore().collection('users')
        .doc(user.uid)
        .collection('prompts')
        .add({
            prompt: prompt,
            response: response,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(docRef => {
            console.log('Conversation saved with ID:', docRef.id);
            
            // Update the saved prompts list if the function exists
            if (typeof loadSavedPrompts === 'function') {
                loadSavedPrompts(user.uid);
            }
        })
        .catch(error => {
            console.error('Error saving conversation:', error);
            displayStatusMessage('Failed to save conversation', 'error');
        });
}

// Export the OpenAI module
window.openaiModule = {
    init,
    sendPrompt: openaiApi.sendPrompt,
    hasApiKey: openaiApi.hasApiKey,
    getApiKey: openaiApi.getApiKey,
    saveApiKey: openaiApi.saveApiKey,
    clearApiKey: openaiApi.clearApiKey
}; 