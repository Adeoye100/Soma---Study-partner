import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

vi.mock('@clerk/react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  Show: ({ when, children }: { when: 'signed-in' | 'signed-out'; children: React.ReactNode }) => {
    if (when === 'signed-out') return children;
    return null;
  },
  UserButton: () => React.createElement('button', { type: 'button', 'aria-label': 'Clerk user profile' }, 'User'),
  SignInButton: ({ children }: { children?: React.ReactNode }) => React.createElement('button', { type: 'button' }, children || 'Sign in'),
  SignUpButton: ({ children }: { children?: React.ReactNode }) => React.createElement('button', { type: 'button' }, children || 'Sign up'),
  SignOutButton: ({ children }: { children?: React.ReactNode }) => React.createElement('button', { type: 'button' }, children || 'Sign out'),
  SignIn: () => React.createElement('div', { 'data-testid': 'clerk-sign-in' }, 'Clerk Sign In'),
  SignUp: () => React.createElement('div', { 'data-testid': 'clerk-sign-up' }, 'Clerk Sign Up'),
  useAuth: () => ({ isSignedIn: false, isLoaded: true, userId: null, sessionId: null }),
  useUser: () => ({ isSignedIn: false, isLoaded: true, user: null }),
  useClerk: () => ({ signOut: vi.fn(), openSignIn: vi.fn(), openSignUp: vi.fn() }),
}));

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;
