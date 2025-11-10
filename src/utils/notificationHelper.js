
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

// Request Notification Permission + Fetch FCM Token
export const requestUserPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log(' Notification permission granted.');

      // Get FCM device token
      const token = await messaging().getToken();
      console.log(' FCM Token:', token);

      // Save it to Firestore (linked to current user)
      await saveTokenToFirestore(token);
    } else {
      console.log('Notification permission not granted.');
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
};

//  Save the FCM Token in Firestore for the logged-in user
const saveTokenToFirestore = async (token) => {
  const user = auth().currentUser;
  if (!user) {
    console.log(' No authenticated user — skipping token save.');
    return;
  }

  try {
    const userRef = firestore().collection('users').doc(user.uid);
    await userRef.set(
      {
        fcmToken: token,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(' Token saved to Firestore.');
  } catch (error) {
    console.error(' Error saving token to Firestore:', error);
  }
};

// Listen for Foreground / Background / Quit notifications
export const notificationListener = () => {
  // Foreground message (app is open)
  const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
    console.log('FCM message received in foreground:', remoteMessage);
    const { title, body } = remoteMessage.notification || {};
    Alert.alert(title || 'Notification', body || 'You have a new message!');
  });

  // Background opened (no navigation here — handled in AppNavigator)
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log(' App opened from background via notification:', remoteMessage);
  });

  // Quit state (cold start)
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App launched from quit state via notification:', remoteMessage);
      }
    });

  // Background message handler (silent notifications)
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log(' Background FCM message:', remoteMessage);
  });

  return unsubscribeOnMessage; // Cleanup listener
};
