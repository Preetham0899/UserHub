

// Mock native modules
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('@react-native-firebase/app', () => ({
  initializeApp: jest.fn(),
}));
jest.mock('@react-native-firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));
jest.mock('@react-native-firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
}));
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));
