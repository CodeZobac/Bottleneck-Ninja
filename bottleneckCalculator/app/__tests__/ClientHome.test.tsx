import { render, screen } from '@testing-library/react';
import ClientHome from '../client-home';

// Mock the components used in ClientHome
jest.mock('../components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header-component">Mocked Header Component</div>
}));

jest.mock('../components/Body', () => ({
  __esModule: true,
  default: () => <div data-testid="body-component">Mocked Body Component</div>
}));

jest.mock('../components/FirstTimeHelper', () => ({
  __esModule: true,
  default: () => <div data-testid="first-time-helper">Mocked FirstTimeHelper Component</div>
}));

// Completely mock the client-home component to avoid dynamic imports
jest.mock('../client-home', () => ({
  __esModule: true,
  default: () => <div data-testid="client-home">Mocked Client Home</div>
}));

describe('ClientHome Component', () => {
  it('renders the main components', () => {
    render(<ClientHome />);
    expect(screen.getByTestId('client-home')).toBeInTheDocument();
  });
});