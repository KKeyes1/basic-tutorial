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
- [Cursor AI](https://cursor.so/) or another code editor

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

### Step 1: Clone and Setup the Repository

```bash
# Clone the repository
git clone https://github.com/KKeyes1/basic-tutorial.git
cd basic-tutorial

# Start the local development server
node server.js
```

> 🧠 **VIBE Coding Prompt**: "Create a local development server using Node.js that serves static files from a public directory and handles different content types properly."

### Step 2: Firebase Project Setup

#### 2.1 Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Give your project a name (e.g., "openai-firebase-demo")
4. Optionally enable Google Analytics
5. Click "Create project"

> 🧠 **VIBE Coding Prompt**: "What are the key steps for creating a new Firebase project through the Firebase Console?"

#### 2.2 Register Your Web App

1. From the project overview page, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "openai-firebase-web")
3. Check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the Firebase configuration object (we'll use it in the next step)

> 🧠 **VIBE Coding Prompt**: "Generate the code needed to initialize Firebase in a web application, including authentication and Firestore."

#### 2.3 Update Firebase Configuration

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

> 🧠 **VIBE Coding Prompt**: "Update the Firebase configuration file with the credentials from my Firebase project."

### Step 3: Set Up Firebase Authentication

#### 3.1 Enable Google Authentication

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Click on "Google" provider
3. Toggle the "Enable" switch to on
4. Provide your support email
5. Click "Save"

> 🧠 **VIBE Coding Prompt**: "What configuration steps are needed to enable Google Authentication in a Firebase project?"

#### 3.2 Test Authentication

1. Run the local server (`node server.js`) if not already running
2. Open your browser to [http://localhost:5000](http://localhost:5000)
3. Click the "Login" button in the top right corner
4. You should be prompted to sign in with Google
5. After signing in, you should see your profile picture and name

> 🧠 **VIBE Coding Prompt**: "Create an authentication module that handles Google sign-in, user profile display, and authentication state management using Firebase."

### Step 4: Set Up Firestore Database

#### 4.1 Create a Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in test mode for now (we'll secure it later)
4. Choose a database location closest to your users
5. Click "Enable"

> 🧠 **VIBE Coding Prompt**: "What is the proper structure for a Firestore database to store user profiles, prompts, and conversation history?"

#### 4.2 Understand the Data Structure

This project uses the following Firestore collections:

- `users` - Stores user profile information
  - `{userId}/prompts` - Stores a user's saved prompts
  - `{userId}/conversations` - Stores conversation history

> 🧠 **VIBE Coding Prompt**: "Create Firestore security rules that allow users to only access their own data."

### Step 5: Set Up OpenAI API

#### 5.1 Get an API Key

1. Go to [OpenAI's platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to the API keys section
4. Create a new secret key
5. Copy the key (you won't be able to see it again)

> 🧠 **VIBE Coding Prompt**: "What's the best practice for securely handling API keys in a JavaScript application?"

#### 5.2 Test the OpenAI Integration

1. Log in to the application (if not already logged in)
2. Enter your OpenAI API key in the "OpenAI Configuration" section
3. Enter a prompt in the text area and click "Send"
4. You should see the AI response appear in the chat

> 🧠 **VIBE Coding Prompt**: "Create a module that handles API calls to OpenAI, manages API keys securely (client-side only for demo purposes), and displays chat messages."

### Step 6: Deploy to Firebase

#### 6.1 Install Firebase CLI

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
- Features: Hosting, Firestore
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

> 🧠 **VIBE Coding Prompt**: "What are the steps to deploy a web application to Firebase Hosting using the Firebase CLI?"

## 🔒 Security Considerations

### Client-Side vs. Server-Side

This tutorial demonstrates client-side API integration for simplicity. For production:

1. **NEVER store API keys in client-side code**
2. Create a Firebase Cloud Function or backend service to handle OpenAI API calls
3. Use Firebase Auth to secure your API endpoints

> 🧠 **VIBE Coding Prompt**: "Create a Firebase Cloud Function that securely handles OpenAI API requests without exposing the API key to clients."

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

> 🧠 **VIBE Coding Prompt**: "Explain how these Firestore security rules protect user data and what modifications might be needed for a production application."

## 🛣️ Where to Go From Here

Once you've completed this tutorial, consider these enhancements:

1. **Implement Firebase Cloud Functions** for secure API key handling
2. **Add additional authentication providers** (Email/Password, GitHub, etc.)
3. **Implement rate limiting** to control API usage
4. **Add conversation threading** for more complex chat interactions
5. **Implement user settings** for customizing API parameters
6. **Add a collaborative feature** using Firebase Realtime Database

> 🧠 **VIBE Coding Prompt**: "Design a Firebase Cloud Function that handles OpenAI API requests securely and implements rate limiting."

## 🤔 Troubleshooting

### Authentication Issues

- Ensure you've properly configured Google Authentication in Firebase Console
- Check browser console for errors
- Verify that your Firebase configuration is correct

### API Issues

- Verify your OpenAI API key is active and has sufficient credits
- Check response errors in browser console
- Test with simple prompts first

### Deployment Issues

- Ensure Firebase CLI is installed and logged in
- Verify project ID matches your Firebase project
- Check Firebase Console for deployment errors

> 🧠 **VIBE Coding Prompt**: "Create a troubleshooting guide for common Firebase authentication and API integration issues."

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Cursor AI](https://cursor.so/) for VIBE coding assistance 