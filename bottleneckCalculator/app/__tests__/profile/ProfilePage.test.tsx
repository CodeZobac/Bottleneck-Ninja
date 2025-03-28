import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProfilePage from '../../profile/page';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
      data-testid="mock-image"
    />
  ),
}));

// Proper mock of next-auth/react module
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
});

// Import useSession after mocking
import { useSession } from 'next-auth/react';

// Mock useSession for tests
const mockUseSession = useSession as jest.Mock;

// Mock fetch function
const mockFetchResponse = {
  preferences: {
    id: '123',
    user_id: 'user123',
    budget: 1500,
    cpu_intensive: true,
    gpu_intensive: false,
    gaming: true,
    created_at: '2025-03-28T10:30:00Z',
    updated_at: '2025-03-28T10:30:00Z',
  }
};

describe('ProfilePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock fetch
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFetchResponse),
      } as Response)
    );
  });

  it('renders loading state when session is loading', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<ProfilePage />);
    
    expect(screen.getByText('Loading your profile...')).toBeInTheDocument();
  });

  it('renders profile data when user is authenticated and has preferences', async () => {
    // Mock authenticated session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          image: 'https://example.com/profile.jpg',
        },
        expires: '2025-04-28',
      },
      status: 'authenticated',
    });

    render(<ProfilePage />);
    
    // Wait for the profile data to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Your Computer Preferences')).toBeInTheDocument();
      expect(screen.getByText('$1,500')).toBeInTheDocument();
      expect(screen.getByText('CPU Intensive Tasks (programming, video editing)')).toBeInTheDocument();
      expect(screen.getByText('Gaming')).toBeInTheDocument();
      expect(screen.getByText('Generate AI Report')).toBeInTheDocument();
    });
  });

  it('enters edit mode when edit button is clicked', async () => {
    // Mock authenticated session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          image: 'https://example.com/profile.jpg',
        },
        expires: '2025-04-28',
      },
      status: 'authenticated',
    });

    render(<ProfilePage />);
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Edit Preferences')).toBeInTheDocument();
    });
    
    // Click the edit button
    fireEvent.click(screen.getByText('Edit Preferences'));
    
    // Verify edit mode is active
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    
    // Verify form fields are present
    const budgetInput = screen.getByRole('spinbutton');
    expect(budgetInput).toBeInTheDocument();
    expect(budgetInput).toHaveValue(1500);
    
    // Check that the checkboxes have correct initial values
    const cpuCheckbox = screen.getByLabelText(/CPU Intensive Tasks/i);
    const gpuCheckbox = screen.getByLabelText(/GPU Intensive Tasks/i);
    const gamingCheckbox = screen.getByLabelText('Gaming');
    
    expect(cpuCheckbox).toBeChecked();
    expect(gpuCheckbox).not.toBeChecked();
    expect(gamingCheckbox).toBeChecked();
  });

  it('cancels edit mode when cancel button is clicked', async () => {
    // Mock authenticated session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
        expires: '2025-04-28',
      },
      status: 'authenticated',
    });

    render(<ProfilePage />);
    
    // Wait for component to load and click edit button
    await waitFor(() => {
      screen.getByText('Edit Preferences').click();
    });
    
    // Verify edit mode is active and click cancel
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    screen.getByText('Cancel').click();
    
    // Verify we're back to view mode
    await waitFor(() => {
      expect(screen.getByText('Edit Preferences')).toBeInTheDocument();
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });

  it('saves changes when save button is clicked', async () => {
    // Mock authenticated session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
        expires: '2025-04-28',
      },
      status: 'authenticated',
    });

    render(<ProfilePage />);
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Edit Preferences')).toBeInTheDocument();
    });
    
    // Enter edit mode
    fireEvent.click(screen.getByText('Edit Preferences'));
    
    // Change form values
    const budgetInput = screen.getByRole('spinbutton');
    fireEvent.change(budgetInput, { target: { value: '2000' } });
    
    const gpuCheckbox = screen.getByLabelText(/GPU Intensive Tasks/i);
    fireEvent.click(gpuCheckbox);
    
    // Save changes
    fireEvent.click(screen.getByText('Save'));
    
    // Verify API was called with new values
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/profile', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('2000'),
      }));
    });
  });
});