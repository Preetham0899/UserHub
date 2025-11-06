import * as Keychain from 'react-native-keychain';

export const saveSecureToken = async (token) => {
  await Keychain.setGenericPassword('user', token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
};

export const getSecureToken = async () => {
  const creds = await Keychain.getGenericPassword();
  return creds ? creds.password : null;
};

export const removeSecureToken = async () => {
  await Keychain.resetGenericPassword();
};
