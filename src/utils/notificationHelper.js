
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert, Platform } from 'react-native';

//  Ask for notification permission
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log(' Notification permission granted.');

    // Get and store FCM token
    const token = await messaging().getToken();
    console.log(' FCM Token:', token);
    await saveTokenToFirestore(token);
  } else {
    console.log('Notification permission not granted.');
  }
};

//  Save token in Firestore (tied to current user)
const saveTokenToFirestore = async (token) => {
  const user = auth().currentUser;
  if (!user) return;

  const userRef = firestore().collection('users').doc(user.uid);

  await userRef.set(
    {
      fcmToken: token,
      lastUpdated: new Date().toISOString(),
    },
    { merge: true }
  );
};

//  Listen for notifications (foreground, background, quit)
export const notificationListener = () => {
  // Foreground messages
  const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
    console.log(' FCM message received in foreground:', remoteMessage);
    Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);
  });

  // Background/quit messages are handled by setBackgroundMessageHandler (top-level)
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log(' Background message:', remoteMessage);
  });

  return unsubscribeOnMessage; // cleanup
};
