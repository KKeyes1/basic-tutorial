# Firebase + OpenAI Integration Tutorial

This repository contains a comprehensive tutorial application demonstrating how to integrate Firebase (for hosting, authentication, and data persistence) with the OpenAI API using vanilla JavaScript, HTML, and CSS.

## 🚀 Live Demo

[View the live demo](#) (Replace with your Firebase hosting URL once deployed)

## 🎯 What You'll Build

This tutorial walks you through building an application that:

1. **Authenticates users** with Firebase Google Sign-in
2. **Stores user data** in Firestore
3. **Sends prompts** to OpenAI's API
4. **Saves conversation history** in Firebase
5. **Deploys** to Firebase Hosting

The demo allows users to log in with authentication, send prompts to OpenAI, see the responses, and retrieve their saved prompts from the database.

## 📋 Prerequisites

Before starting this tutorial, make sure you have:

- [Node.js](https://nodejs.org/) (v14 or later) installed
- A Firebase account: [Sign up here](https://firebase.google.com/)
- An OpenAI API account and key: [Sign up here](https://platform.openai.com/signup)
- [Git](https://git-scm.com/) installed
- [Cursor AI](https://cursor.so/) installed - for VIBE coding

## 🤖 Using VIBE Coding with Cursor AI

This tutorial includes VIBE coding prompts throughout. These prompts are specially designed to use with [Cursor AI](https://cursor.so/) to help you implement each feature efficiently:

1. Look for sections marked with 🧠 **VIBE Coding Prompt**
2. Copy the prompt text (including quotes)
3. In Cursor AI, press `Cmd+L` (Mac) or `Ctrl+L` (Windows) to open the AI chat
4. Paste the prompt and press Enter
5. Follow Cursor AI's suggestions to implement the feature

> 🧠 **VIBE Coding Prompt**: "What is VIBE coding and how can I use it effectively with Cursor AI for this tutorial?"

## 🔍 Project Structure

```
├── public/                # Public directory (deployed to Firebase Hosting)
│   ├── assets/            # Images and other assets
│   ├── css/               # CSS styles
│   ├── js/                # JavaScript files
│   │   ├── auth/          # Authentication-related code
│   │   ├── firebase/      # Firebase configuration
│   │   └── openai/        # OpenAI API integration
│   └── index.html         # Main HTML file
├── .firebaserc            # Firebase project configuration
├── firebase.json          # Firebase configuration file
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes configuration
├── server.js              # Simple local development server
└── README.md              # This readme file
```

## 🛠️ Step-by-Step Tutorial

### Step 1: Fork and Clone the Repository

> 🧠 **VIBE Coding Prompt**: "Help me fork the repository at 'https://github.com/KKeyes1/basic-tutorial' to my own GitHub account and clone it locally. What commands should I run?"

1. Fork this repository:
   - Visit https://github.com/KKeyes1/basic-tutorial
   - Click the "Fork" button in the top-right corner
   - Wait for the fork to complete

2. Clone your fork to your local machine:
   ```bash
   # Replace YOUR_USERNAME with your GitHub username
   git clone https://github.com/YOUR_USERNAME/basic-tutorial.git
   cd basic-tutorial
   ```

3. Start the local development server:
   ```bash
   node server.js
   ```
   This will launch the server at http://localhost:5000

> 🧠 **VIBE Coding Prompt**: "Analyze the server.js file in this repository and explain how it serves static files. If I want to modify it to use a different port, what changes would I need to make?"

### Step 2: Firebase Project Setup

#### 2.1 Create a Firebase Project

> 🧠 **VIBE Coding Prompt**: "Guide me through creating a new Firebase project for this application. What specific settings should I choose for a web app that will use authentication and Firestore?"

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Give your project a name (e.g., "openai-firebase-demo")
4. Optionally enable Google Analytics
5. Click "Create project"

#### 2.2 Register Your Web App

> 🧠 **VIBE Coding Prompt**: "Show me the steps to register a web application in my Firebase project, including how to enable Firebase Hosting and get the configuration object I'll need for the config.js file."

1. From the project overview page, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "openai-firebase-web")
3. Check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the Firebase configuration object (we'll use it in the next step)

#### 2.3 Update Firebase Configuration

> 🧠 **VIBE Coding Prompt**: "Looking at public/js/firebase/config.js in this project, help me replace the placeholder Firebase configuration with my own. What security considerations should I keep in mind?"

Open `public/js/firebase/config.js` and replace the placeholder configuration with your own:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Set Up Firebase Authentication

#### 3.1 Enable Google Authentication

> 🧠 **VIBE Coding Prompt**: "Walk me through enabling Google authentication in the Firebase console for this project, and explain how the auth.js file in this repository implements the sign-in functionality."

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Click on "Google" provider
3. Toggle the "Enable" switch to on
4. Provide your support email
5. Click "Save"

#### 3.2 Test Authentication

> 🧠 **VIBE Coding Prompt**: "Analyze the authentication code in public/js/auth/auth.js and explain how it handles the user's login state. What would I need to modify to add additional auth providers?"

1. Run the local server (`node server.js`) if not already running
2. Open your browser to [http://localhost:5000](http://localhost:5000)
3. Click the "Login" button in the top right corner
4. You should be prompted to sign in with Google
5. After signing in, you should see your profile picture and name

### Step 4: Set Up Firestore Database

#### 4.1 Create a Firestore Database

> 🧠 **VIBE Coding Prompt**: "Help me create a Firestore database in my Firebase project. Then examine how this application's code (in auth.js and openai/api.js) interacts with Firestore to store user data, prompts, and conversations."

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in test mode for now (we'll secure it later)
4. Choose a database location closest to your users
5. Click "Enable"

#### 4.2 Understand the Data Structure

> 🧠 **VIBE Coding Prompt**: "Analyze the Firestore data model used in this application. Looking at the code in auth.js and openai/api.js, explain the collections and documents structure and how they relate to user authentication."

This project uses the following Firestore collections:

- `users` - Stores user profile information
  - `{userId}/prompts` - Stores a user's saved prompts
  - `{userId}/conversations` - Stores conversation history

Review the security rules in `firestore.rules` to understand how data access is controlled:

> 🧠 **VIBE Coding Prompt**: "Examine the firestore.rules file in this project and explain how it protects user data. What changes would make these rules more secure for a production environment?"

### Step 5: Set Up OpenAI API

#### 5.1 Get an API Key

> 🧠 **VIBE Coding Prompt**: "Guide me through getting an OpenAI API key and explain how the openai/api.js file in this project securely handles the API key in the client-side code."

1. Go to [OpenAI's platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to the API keys section
4. Create a new secret key
5. Copy the key (you won't be able to see it again)

#### 5.2 Test the OpenAI Integration

> 🧠 **VIBE Coding Prompt**: "Analyze the code in public/js/openai/api.js that handles API calls to OpenAI. What improvements could be made to handle rate limiting, error states, or additional OpenAI API parameters?"

1. Log in to the application (if not already logged in)
2. Enter your OpenAI API key in the "OpenAI Configuration" section
3. Enter a prompt in the text area and click "Send"
4. You should see the AI response appear in the chat

### Step 6: Deploy to Firebase

#### 6.1 Install Firebase CLI

> 🧠 **VIBE Coding Prompt**: "Create a step-by-step guide for deploying this specific application to Firebase Hosting, starting with installing the Firebase CLI and ending with viewing the deployed site."

```bash
npm install -g firebase-tools
```

#### 6.2 Login to Firebase

```bash
firebase login
```

#### 6.3 Initialize Firebase Project

```bash
firebase init
```

Select the following options:
- Features: Hosting and Firestore
- Project: Select your Firebase project
- Public directory: public
- Configure as single-page app: No
- Set up automatic builds: No
- Use existing firestore.rules: Yes
- Use existing firestore.indexes.json: Yes

#### 6.4 Deploy the Application

```bash
firebase deploy
```

> 🧠 **VIBE Coding Prompt**: "Suggest a CI/CD workflow using GitHub Actions that would automatically deploy this application to Firebase whenever changes are pushed to the main branch."

## 🔒 Security Considerations

### Client-Side vs. Server-Side

This tutorial demonstrates client-side API integration for simplicity. For production:

1. **NEVER store API keys in client-side code**
2. Create a Firebase Cloud Function or backend service to handle OpenAI API calls
3. Use Firebase Auth to secure your API endpoints

> 🧠 **VIBE Coding Prompt**: "Create a Firebase Cloud Function that would securely handle OpenAI API requests for this application without exposing the API key to clients. Explain how we would modify the openai/api.js file to use this function instead of direct API calls."

### Firestore Security Rules

Review and customize the `firestore.rules` file to secure your data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /prompts/{promptId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /conversations/{conversationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

> 🧠 **VIBE Coding Prompt**: "Review the firestore.rules in this project and suggest improvements to enhance security while maintaining the application's functionality."

## 🛣️ Where to Go From Here

Once you've completed this tutorial, consider these enhancements:

1. **Implement Firebase Cloud Functions** for secure API key handling
   > 🧠 **VIBE Coding Prompt**: "Write a Firebase Cloud Function that handles OpenAI API requests and explain how to deploy it."

2. **Add additional authentication providers** (Email/Password, GitHub, etc.)
   > 🧠 **VIBE Coding Prompt**: "Modify the auth.js file in this project to add Email/Password authentication alongside Google authentication."

3. **Implement rate limiting** to control API usage
   > 🧠 **VIBE Coding Prompt**: "Implement a basic rate limiting system in this application to prevent excessive OpenAI API usage."

4. **Add conversation threading** for more complex chat interactions
   > 🧠 **VIBE Coding Prompt**: "Modify the openai/api.js file to support conversation history and threading with OpenAI's API."

5. **Implement user settings** for customizing API parameters
   > 🧠 **VIBE Coding Prompt**: "Create a user settings component that allows customizing OpenAI API parameters like model, temperature, and max tokens."

6. **Add a collaborative feature** using Firebase Realtime Database
   > 🧠 **VIBE Coding Prompt**: "Add a collaborative feature to this application using Firebase Realtime Database that allows users to share conversations."

## 🤔 Troubleshooting

### Authentication Issues

- Ensure you've properly configured Google Authentication in Firebase Console
- Check browser console for errors
- Verify that your Firebase configuration is correct

> 🧠 **VIBE Coding Prompt**: "Looking at this application's code, what are the most common authentication issues that might occur and how would I debug them?"

### API Issues

- Verify your OpenAI API key is active and has sufficient credits
- Check response errors in browser console
- Test with simple prompts first

> 🧠 **VIBE Coding Prompt**: "Analyze the error handling in openai/api.js and suggest improvements to provide better user feedback for common API errors."

### Deployment Issues

- Ensure Firebase CLI is installed and logged in
- Verify project ID matches your Firebase project
- Check Firebase Console for deployment errors

> 🧠 **VIBE Coding Prompt**: "What are common deployment issues with Firebase Hosting and how would I debug them in this project?"

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Cursor AI](https://cursor.so/) for VIBE coding assistance 