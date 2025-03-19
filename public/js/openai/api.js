/**
 * OpenAI API Integration Module
 * 
 * This module handles communication with the OpenAI API.
 * Includes functions for making API calls and managing API keys.
 */

// DOM Elements
const apiKeyInput = document.getElementById('api-key');
const sendPromptBtn = document.getElementById('send-prompt-btn');
const promptInput = document.getElementById('prompt-input');
const messagesContainer = document.getElementById('messages-container');

// Get Firebase services
const db = window.firebaseServices.db;
const auth = window.firebaseServices.auth;

// Store API key in session storage (only for demo purposes)
// In production, this should be handled server-side
let apiKey = '';

// Initialize OpenAI module
function init() {
  // Check for API key in session storage
  apiKey = sessionStorage.getItem('openai_api_key') || '';
  if (apiKey) {
    apiKeyInput.value = '••••••••••••••••••••••••••';
  }
  
  // Setup event listeners
  apiKeyInput.addEventListener('change', handleApiKeyChange);
  sendPromptBtn.addEventListener('click', handleSendPrompt);
  promptInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  });
}

// Handle API key changes
function handleApiKeyChange() {
  const newApiKey = apiKeyInput.value.trim();
  
  if (newApiKey && newApiKey !== '••••••••••••••••••••••••••') {
    // Save API key to session storage (only for demo purposes)
    sessionStorage.setItem('openai_api_key', newApiKey);
    apiKey = newApiKey;
    apiKeyInput.value = '••••••••••••••••••••••••••';
    
    console.log('API key saved to session storage');
    
    // Show success message
    displayStatusMessage('API key saved for this session', 'success');
  }
}

// Handle sending prompts to OpenAI
async function handleSendPrompt() {
  const promptText = promptInput.value.trim();
  
  if (!promptText) {
    displayStatusMessage('Please enter a prompt', 'error');
    return;
  }
  
  if (!apiKey) {
    displayStatusMessage('Please enter an OpenAI API key', 'error');
    apiKeyInput.focus();
    return;
  }
  
  if (!window.authModule.isUserLoggedIn()) {
    displayStatusMessage('Please log in to use this feature', 'error');
    return;
  }
  
  // Display user message
  displayMessage(promptText, 'user');
  
  // Clear input
  promptInput.value = '';
  
  // Save prompt to Firestore
  savePromptToFirestore(promptText);
  
  // Show loading indicator
  const loadingMessage = displayLoadingMessage();
  
  try {
    // Call OpenAI API
    const response = await callOpenAI(promptText, apiKey);
    
    // Remove loading indicator
    loadingMessage.remove();
    
    if (response.error) {
      // Handle API error
      displayStatusMessage(`API Error: ${response.error.message}`, 'error');
      console.error('OpenAI API Error:', response.error);
      return;
    }
    
    // Display AI response
    const aiResponse = response.choices[0].message.content;
    displayMessage(aiResponse, 'ai');
    
    // Save response to Firestore
    saveResponseToFirestore(promptText, aiResponse);
    
  } catch (error) {
    // Remove loading indicator
    loadingMessage.remove();
    
    // Handle network or other errors
    displayStatusMessage(`Error: ${error.message}`, 'error');
    console.error('Error calling OpenAI API:', error);
  }
}

// Call OpenAI API
async function callOpenAI(prompt, apiKey) {
  // In a production app, this call should be routed through a backend service
  // to keep the API key secure
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 500
    })
  });
  
  return await response.json();
}

// Display a message in the chat container
function displayMessage(text, sender) {
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

// Display loading indicator
function displayLoadingMessage() {
  const loadingElement = document.createElement('div');
  loadingElement.className = 'message ai-message loading';
  loadingElement.innerHTML = 'AI is thinking...';
  messagesContainer.appendChild(loadingElement);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  return loadingElement;
}

// Display status messages
function displayStatusMessage(message, type) {
  const statusElement = document.createElement('div');
  statusElement.className = `message status-message ${type}`;
  statusElement.textContent = message;
  messagesContainer.appendChild(statusElement);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Remove after a few seconds
  setTimeout(() => {
    statusElement.classList.add('fade-out');
    setTimeout(() => statusElement.remove(), 500);
  }, 3000);
}

// Save prompt to Firestore
function savePromptToFirestore(promptText) {
  const user = auth.currentUser;
  if (!user) return;
  
  db.collection('users').doc(user.uid).collection('prompts').add({
    text: promptText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    console.log('Prompt saved to Firestore');
    // Refresh the saved prompts list
    window.authModule.loadSavedPrompts();
  }).catch(error => {
    console.error('Error saving prompt:', error);
  });
}

// Save response to Firestore
function saveResponseToFirestore(promptText, responseText) {
  const user = auth.currentUser;
  if (!user) return;
  
  db.collection('users').doc(user.uid).collection('conversations').add({
    prompt: promptText,
    response: responseText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    console.log('Conversation saved to Firestore');
  }).catch(error => {
    console.error('Error saving conversation:', error);
  });
}

// Export OpenAI module
window.openaiModule = {
  init,
  callOpenAI
};

// Initialize the module when the page loads
document.addEventListener('DOMContentLoaded', init); 