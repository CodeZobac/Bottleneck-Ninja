import { render, screen } from '@testing-library/react';
import Body from '../../components/Body';

// Mock components
jest.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: () => <div data-testid="lottie-animation">Mocked Lottie Animation</div>
}));

jest.mock('../../components/HardwareModal', () => ({
  HardwareModal: () => <div data-testid="hardware-modal">Mocked Hardware Modal</div>
}));

jest.mock('../../components/CookieManager', () => ({
  CookieManager: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cookie-manager">{children}</div>
  )
}));

// Mock next-themes is already in jest.setup.js

describe('Body Component', () => {
  it('renders the main title with AI emphasis', () => {
    render(<Body />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1.textContent).toContain('1st');
    expect(h1.textContent).toContain('AI');
    expect(h1.textContent).toContain('Bottleneck Calculator');
  });

  it('renders the Lottie animation', () => {
    render(<Body />);
    const lottieAnimation = screen.getByTestId('lottie-animation');
    expect(lottieAnimation).toBeInTheDocument();
  });

  it('renders the HardwareModal component', () => {
    render(<Body />);
    const hardwareModal = screen.getByTestId('hardware-modal');
    expect(hardwareModal).toBeInTheDocument();
  });

  it('wraps content in CookieManager', () => {
    render(<Body />);
    const cookieManager = screen.getByTestId('cookie-manager');
    expect(cookieManager).toBeInTheDocument();
  });

  it('renders the background SVG', () => {
    render(<Body />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '100%');
    expect(svg).toHaveAttribute('height', '100%');
  });
});