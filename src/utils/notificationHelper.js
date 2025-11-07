import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert, Linking, Platform } from 'react-native';


export const requestUserPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted.');

      // Fetch FCM device token
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      // Save token in Firestore 
      await saveTokenToFirestore(token);
    } else {
      console.log(' Notification permission not granted.');
    }
  } catch (error) {
    console.error(' Error requesting notification permission:', error);
  }
};


const saveTokenToFirestore = async (token) => {
  const user = auth().currentUser;
  if (!user) {
    console.log(' No authenticated user — token not saved.');
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
    console.log('Token saved to Firestore.');
  } catch (error) {
    console.error('Error saving token to Firestore:', error);
  }
};


export const notificationListener = () => {
  // Foreground notification handler
  const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
    console.log(' FCM message received in foreground:', remoteMessage);

    const { title, body } = remoteMessage.notification || {};
    Alert.alert(title || 'Notification', body || 'You have a new message!');
  });

  // Background 
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log(' Notification caused app to open from background:', remoteMessage);

    const deeplink = remoteMessage?.data?.deeplink || 'userhub://login';
    console.log(' Opening deep link:', deeplink);
    Linking.openURL(deeplink);
  });

  // Quit state 
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(' App opened from quit state via notification:', remoteMessage);

        const deeplink = remoteMessage?.data?.deeplink || 'userhub://login';
        console.log(' Opening deep link:', deeplink);
        Linking.openURL(deeplink);
      }
    });

  // Background message handler
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log(' Background FCM message:', remoteMessage);
  });

  return unsubscribeOnMessage; // cleanup
};
