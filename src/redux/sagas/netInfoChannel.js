
import NetInfo from '@react-native-community/netinfo';
import { eventChannel } from 'redux-saga';

export const createNetInfoChannel = () =>
  eventChannel((emit) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      emit({ isConnected: !!state.isConnected });
    });
    return () => unsubscribe();
  });
