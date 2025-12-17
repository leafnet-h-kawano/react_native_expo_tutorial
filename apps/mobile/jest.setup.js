// Jest setup for React Native Testing Library
import { jest } from '@jest/globals';

// Mock expo modules
jest.mock('expo-constants', () => ({
  executionEnvironment: 'standalone',
  appOwnership: 'expo',
}));

jest.mock('expo-router', () => ({
  Link: ({ children, ...props }) => children,
  Redirect: ({ href }) => `Redirect to ${href}`,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: () => ({}),
  useFocusEffect: jest.fn(),
}));

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Global test helpers
global.__DEV__ = true;
