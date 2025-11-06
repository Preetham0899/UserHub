// src/firebase/firebase.js
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Note: Firestore persistence is enabled by default on React Native Firebase.
// If you previously tried to force it via settings(), you can remove that.
// (Older versions used firestore().settings({ persistence: true }))

export { auth, firestore };
