import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n/i18n';
import AppNavigator from './src/navigation/AppNavigator';


import { requestUserPermission, notificationListener } from './src/utils/notificationHelper';

export default function App() {
  useEffect(() => {
    // Request permission to receive notifications
    requestUserPermission();

    // Listen for foreground/background/quit notifications
    const unsubscribe = notificationListener();

    // Cleanup listeners when component unmounts
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </I18nextProvider>
    </Provider>
  );
}
