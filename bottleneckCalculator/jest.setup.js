/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable react/display-name */
// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next-Auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ 
    data: null, 
    status: "unauthenticated" 
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock framer-motion with string functions instead of JSX
jest.mock('framer-motion', () => {
  const React = require('react');
  
  const mockComponent = (type) => {
    return React.forwardRef((props, ref) => {
      return React.createElement(type, { ...props, ref });
    });
  };

  return {
    motion: {
      div: mockComponent('div'),
      li: mockComponent('li'),
      span: mockComponent('span'),
      button: mockComponent('button'),
      a: mockComponent('a'),
      p: mockComponent('p'),
      h1: mockComponent('h1'),
      h2: mockComponent('h2'),
      h3: mockComponent('h3'),
      svg: mockComponent('svg'),
      path: mockComponent('path'),
    },
    AnimatePresence: function MockAnimatePresence(props) {
      return props.children;
    },
  };
});

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
  })),
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};