// src/navigation/AppNavigator.js
// -----------------------------------------------------------------------------
// ✅ Handles:
// 1. Deep linking via Firebase notification data (userhub://register, etc.)
// 2. Dynamic initial route based on login status & deep link
// 3. Navigation for authenticated and unauthenticated users
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { Linking, Text } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { navigationRef, navigate } from '../utils/navigationRef';



// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserListScreen from '../screens/UserListScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Linking Configuration (maps deep links to routes)
const linking = {
  prefixes: ['userhub://'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      Main: {
        screens: {
          Directory: 'directory',
          Chat: 'chat',
          Profile: 'profile',
        },
      },
      UserDetail: 'user/:id?',
    },
  },
};

// 🔹 Bottom Tabs for Authenticated Users
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: '#0D47A1' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      tabBarActiveTintColor: '#0D47A1',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 0.3,
        borderTopColor: '#ccc',
        height: 58,
      },
      tabBarIcon: ({ focused, color }) => {
        let iconName;
        if (route.name === 'Directory') iconName = focused ? 'people' : 'people-outline';
        else if (route.name === 'Chat') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={22} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Directory" component={UserListScreen} options={{ title: 'User Directory' }} />
    <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat Bot' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

// 🔹 Main App Navigation
export default function AppNavigator() {
  const { user } = useSelector((state) => state.auth);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
  const handleNotificationLaunch = async () => {
    const remoteMessage = await messaging().getInitialNotification();
    const deepLink = remoteMessage?.data?.deeplink;
    console.log(' Cold start deeplink:', deepLink);

    if (deepLink) {
      const route = deepLink.includes('register')
        ? 'Register'
        : deepLink.includes('login')
        ? 'Login'
        : user
        ? 'Main'
        : 'Login';
      setInitialRoute(route);

      // Wait for NavigationContainer to mount
      const interval = setInterval(() => {
        if (navigationRef.isReady()) {
          console.log(' Navigation ready, navigating to:', route);
          navigate(route);
          clearInterval(interval);
        }
      }, 300);
    } else {
      setInitialRoute(user ? 'Main' : 'Login');
    }
  };

  handleNotificationLaunch();

  // Handle background taps
  const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
    const deepLink = remoteMessage?.data?.deeplink;
    if (deepLink) {
      const route = deepLink.includes('register')
        ? 'Register'
        : deepLink.includes('login')
        ? 'Login'
        : 'Main';
      console.log(' Background notification opened:', route);
      navigate(route);
    }
  });

  return unsubscribe;
}, [user]);



  if (!initialRoute) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading navigation...</Text>;
  }

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="UserDetail"
              component={UserDetailScreen}
              options={{
                headerShown: true,
                title: 'User Details',
                headerStyle: { backgroundColor: '#0D47A1' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: true,
                title: 'Login',
                headerStyle: { backgroundColor: '#0D47A1' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                headerShown: true,
                title: 'Register',
                headerStyle: { backgroundColor: '#0D47A1' },
                headerTintColor: '#fff',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
