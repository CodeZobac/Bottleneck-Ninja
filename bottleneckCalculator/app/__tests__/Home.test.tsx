import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock ClientHome component
jest.mock('../client-home', () => {
  return function MockClientHome() {
    return <div data-testid="client-home">Mocked Client Home</div>;
  };
});

describe('Home Page', () => {
  it('renders the ClientHome component', () => {
    render(<Home />);
    const clientHome = screen.getByTestId('client-home');
    expect(clientHome).toBeInTheDocument();
    expect(clientHome).toHaveTextContent('Mocked Client Home');
  });
});