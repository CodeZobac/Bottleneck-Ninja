import { render, screen, within } from '@testing-library/react';
import { BuildAnalysis } from '@/app/builds/components/BuildAnalysis';

// Mock the HardwareChart component
jest.mock('@/app/components/HardwareChart', () => ({
  HardwareChart: ({ data }: { data: Array<{ component: string; score: number }> }) => (
    <div data-testid="hardware-chart">
      Mocked Hardware Chart with {data.length} data points
    </div>
  )
}));

// Create a sample build object for testing that matches HardwareBuild interface
const mockBuild = {
  id: '123',
  user_id: 'user123',
  name: 'Test Build',
  cpu: 'Intel i9-12900K',
  gpu: 'NVIDIA RTX 3080',
  ram: '32GB DDR5',
  created_at: '2025-01-15T10:30:00Z',
  result: {
    agreement: true,
    components: {
      CPU: 'Intel i9-12900K',
      GPU: 'NVIDIA RTX 3080',
      RAM: '32GB DDR5'
    },
    hardware_analysis: {
      bottleneck: 'CPU',
      percentile_ranks: {},
      raw_benchmark_scores: {},
      estimated_impact: {
        CPU: 15.5,
        GPU: 8.3,
        RAM: 3.2
      }
    }
  },
  recommendations: [
    'Upgrade your CPU to reduce bottleneck',
    'Consider overclocking your RAM for better performance'
  ]
};

describe('BuildAnalysis Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders build analysis title and configuration details', () => {
    render(<BuildAnalysis build={mockBuild} />);
    
    // Check for title and configuration details
    expect(screen.getByText('Build Analysis')).toBeInTheDocument();
    expect(screen.getByText('Your Hardware Configuration')).toBeInTheDocument();
    expect(screen.getByText('Intel i9-12900K')).toBeInTheDocument();
    expect(screen.getByText('NVIDIA RTX 3080')).toBeInTheDocument();
    expect(screen.getByText('32GB DDR5')).toBeInTheDocument();
  });

  it('displays bottleneck information correctly', () => {
    render(<BuildAnalysis build={mockBuild} />);
    
    // Check for bottleneck details
    const bottleneckText = screen.getByText(/Detected Bottleneck:/);
    expect(bottleneckText).toBeInTheDocument();
    
    // Get the parent element and find the CPU text within it
    const bottleneckContainer = bottleneckText.closest('p');
    if (bottleneckContainer) {
      const cpuElement = within(bottleneckContainer).getByText('CPU');
      expect(cpuElement).toBeInTheDocument();
    }
    
    // Check for impact values
    expect(screen.getByText('Impact: 15.5')).toBeInTheDocument();
    expect(screen.getByText('Impact: 8.3')).toBeInTheDocument();
    expect(screen.getByText('Impact: 3.2')).toBeInTheDocument();
  });

  it('renders the hardware chart when data is available', () => {
    render(<BuildAnalysis build={mockBuild} />);
    
    const chart = screen.getByTestId('hardware-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveTextContent('Mocked Hardware Chart with 3 data points');
  });

  it('displays recommendations correctly', () => {
    render(<BuildAnalysis build={mockBuild} />);
    
    expect(screen.getByText('Personalized Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Upgrade your CPU to reduce bottleneck')).toBeInTheDocument();
    expect(screen.getByText('Consider overclocking your RAM for better performance')).toBeInTheDocument();
  });

  it('displays "no recommendations" message when recommendations are empty', () => {
    const buildWithNoRecommendations = {
      ...mockBuild,
      recommendations: []
    };
    
    render(<BuildAnalysis build={buildWithNoRecommendations} />);
    
    expect(screen.getByText(/Your hardware combination appears to be well-balanced/)).toBeInTheDocument();
  });

  it('renders export button', () => {
    render(<BuildAnalysis build={mockBuild} />);
    
    const exportButton = screen.getByText('Export PDF');
    expect(exportButton).toBeInTheDocument();
  });
});