# Firebase + OpenAI Integration Demo

This repository contains a simple demonstration application that shows how to integrate Firebase (for hosting, authentication, and data persistence) with the OpenAI API. The application is built using vanilla JavaScript, HTML, and CSS, making it accessible for developers of all skill levels.

## Live Demo

[View the live demo](#) (Replace with your Firebase hosting URL once deployed)

## Features

- 🔐 **Firebase Authentication**: Google sign-in implementation
- 💾 **Firebase Firestore**: Store and retrieve user data and conversation history
- 🚀 **Firebase Hosting**: Deploy your application to the web
- 🤖 **OpenAI Integration**: Connect to the OpenAI API for AI-powered responses
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 📝 **Self-documented**: The application includes guides on how to set up your own version

## Project Structure

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

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Firebase account
- OpenAI API account and API key

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/firebase-openai-demo.git
cd firebase-openai-demo
```

### Step 2: Set Up Firebase

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Google Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in
3. Create a Firestore database:
   - Go to Firestore Database
   - Create database (start in test mode)
4. Register your web app:
   - Go to Project Overview > Add app
   - Choose web app
   - Register your app and get your Firebase configuration

### Step 3: Update Firebase Configuration

1. Open `public/js/firebase/config.js`
2. Replace the placeholder Firebase configuration with your own:

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

### Step 4: Get an OpenAI API Key

1. Create an account at [openai.com](https://openai.com)
2. Navigate to the API section
3. Generate an API key
4. For security, don't hardcode this key in the application

### Step 5: Run Locally

You can test the application locally using the included Node.js server:

```bash
node server.js
```

This will start a server at http://localhost:3000 where you can view and test your application.

### Step 6: Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize your project (if you haven't done so already):
   ```bash
   firebase init
   ```
   - Select Hosting and Firestore
   - Select your Firebase project
   - Specify "public" as your public directory
   - Configure as a single-page app: No
   - Set up automatic builds and deploys: No
   - Use existing firestore.rules: Yes
   - Use existing firestore.indexes.json: Yes

4. Update `.firebaserc` with your project ID:
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

5. Deploy your application:
   ```bash
   firebase deploy
   ```

## Security Considerations

⚠️ **Important**: This demo allows users to input their OpenAI API key directly into the browser for demonstration purposes only. In a production environment, you should:

1. Create a server-side API or Firebase Function to handle OpenAI API calls
2. Store API keys securely on the server-side
3. Implement rate limiting and user restrictions

## Extending the Application

Here are some ideas to extend this application:

- Add more authentication providers (Email/Password, GitHub, etc.)
- Implement Firebase Storage for file uploads
- Create a server-side API using Firebase Functions to handle OpenAI API calls securely
- Add more advanced conversation history features
- Implement collaborative features using Firebase Realtime Database

## Troubleshooting

- **Firebase Authentication Issues**: Ensure you've properly configured your Firebase project and enabled Google authentication.
- **CORS Issues with OpenAI**: If you encounter CORS issues when calling the OpenAI API, consider implementing a Firebase Function to proxy the requests.
- **Local Development**: When testing locally, some Firebase features may require special configuration. Refer to the Firebase documentation for local emulator setup.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs) 