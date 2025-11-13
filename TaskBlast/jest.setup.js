// Mock Expo's __ExpoImportMetaRegistry for import.meta support
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
  get: jest.fn(() => ({ url: "", env: {} })),
};

// Mock structuredClone for Expo
global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));

// Mock expo-router
jest.mock("expo-router", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockBack = jest.fn();

  return {
    useRouter: () => ({
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
    }),
    Link: "Link",
    router: {
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
    },
  };
});

// Mock expo-audio with shared mock functions
const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockStop = jest.fn();

jest.mock("expo-audio", () => ({
  useAudioPlayer: jest.fn(() => ({
    play: mockPlay,
    pause: mockPause,
    stop: mockStop,
    loop: false,
    isLoaded: true,
  })),
}));

// Export audio mocks for tests
global.mockAudioPlayer = {
  play: mockPlay,
  pause: mockPause,
  stop: mockStop,
};

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock Firebase
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendEmailVerification: jest.fn(),
  updateProfile: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

// Mock server/firebase
jest.mock("./server/firebase", () => ({
  auth: {
    currentUser: {
      uid: "test-uid",
      email: "test@example.com",
    },
  },
  db: {},
  firestore: {},
}));

// Mock react-native-webview
jest.mock("react-native-webview", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    WebView: (props) => {
      return React.createElement(View, { testID: "webview", ...props });
    },
  };
});

// Mock @react-navigation/native
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useFocusEffect: jest.fn((callback) => callback()),
}));

// Mock Expo Font
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

// Mock Expo Asset
jest.mock("expo-asset", () => ({
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
  },
}));

// Mock Reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Safe Area Context
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock AppState with accessible listeners
const mockAppStateListeners = [];
const mockAppStateAddEventListener = jest.fn((event, handler) => {
  mockAppStateListeners.push({ event, handler });
  return { remove: jest.fn() };
});

jest.mock("react-native/Libraries/AppState/AppState", () => ({
  addEventListener: mockAppStateAddEventListener,
  removeEventListener: jest.fn(),
  currentState: "active",
}));

// Export AppState helpers for tests
global.mockAppState = {
  listeners: mockAppStateListeners,
  triggerAppStateChange: (newState) => {
    mockAppStateListeners.forEach(({ event, handler }) => {
      if (event === "change") {
        handler(newState);
      }
    });
  },
  clear: () => {
    mockAppStateListeners.length = 0;
  },
};

// Mock Alert with controllable button callbacks
let lastAlertButtons = [];
const mockAlertFn = jest.fn((title, message, buttons) => {
  lastAlertButtons = buttons || [];
  // Store the alert info for test access
  mockAlertFn.lastCall = { title, message, buttons };

  // Do NOT auto-trigger - tests should manually trigger if needed
  // Tests can use mockAlert.pressButtonByText() to trigger buttons
});

global.Alert = {
  alert: mockAlertFn,
};

// Replace Alert in react-native after it's loaded
const RN = require("react-native");
RN.Alert = {
  alert: mockAlertFn,
};

// Helper to access and trigger alert buttons in tests
global.mockAlert = {
  alert: mockAlertFn,
  pressButton: (buttonIndex) => {
    if (
      lastAlertButtons[buttonIndex] &&
      lastAlertButtons[buttonIndex].onPress
    ) {
      lastAlertButtons[buttonIndex].onPress();
    }
  },
  pressButtonByText: (buttonText) => {
    const button = lastAlertButtons.find(
      (btn) =>
        btn.text && btn.text.toLowerCase().includes(buttonText.toLowerCase())
    );
    if (button && button.onPress) {
      button.onPress();
    }
  },
  getLastAlert: () => mockAlertFn.lastCall,
  clear: () => {
    lastAlertButtons = [];
    mockAlertFn.mockClear();
    delete mockAlertFn.lastCall;
  },
};

// Increase timeout for async tests
jest.setTimeout(10000);

// Global test utilities
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};
