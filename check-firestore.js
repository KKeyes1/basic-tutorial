const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin with service account
// For tutorial-a5216 project
admin.initializeApp({
  projectId: 'tutorial-a5216'
});

const db = admin.firestore();

// Replace this with the user ID you saw in the logs
const userId = '8y2868GuyNUP7j3ZTYf5Sp1vyNl2';

async function checkFirestore() {
  console.log(`Checking Firestore data for user: ${userId}`);
  
  try {
    // First, check if the user exists
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log(`User document not found: ${userId}`);
      return;
    }
    
    console.log(`Found user document: ${userId}`);
    console.log('User data:', userDoc.data());
    
    // Check for the prompts subcollection
    const promptsSnapshot = await db.collection('users').doc(userId).collection('prompts').get();
    
    if (promptsSnapshot.empty) {
      console.log('No prompts found for this user');
      return;
    }
    
    console.log(`Found ${promptsSnapshot.size} prompts:`);
    
    // List all prompts
    promptsSnapshot.forEach(doc => {
      console.log(`Prompt ID: ${doc.id}`);
      console.log('Prompt data:', doc.data());
      console.log('-------------------');
    });
    
  } catch (error) {
    console.error('Error accessing Firestore:', error);
  }
}

// Run the function
checkFirestore()
  .then(() => {
    console.log('Done checking Firestore');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  }); 