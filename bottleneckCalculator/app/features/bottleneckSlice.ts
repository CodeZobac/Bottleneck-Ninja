import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the bottleneck data
interface BottleneckData {
  cpu: string;
  gpu: string;
  ram: string;
  recommendations: string[];
  result: {
    agreement: boolean;
    components: {
      CPU: string;
      GPU: string;
      RAM: string;
    };
    hardware_analysis: {
      bottleneck: string;
      percentile_ranks: Record<string, number>;
      raw_benchmark_scores: Record<string, number>;
      estimated_impact: {
        CPU: number;
        GPU: number;
        RAM: number;
      };
    };
  };
  timestamp: string;
}

// Define the slice interface
interface BottleneckState {
  data: BottleneckData | null;
}

// Initialize state from localStorage if available
const getInitialState = (): BottleneckState => {
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem('bottleneckData');
    if (savedData) {
      try {
        return { data: JSON.parse(savedData) };
      } catch (e) {
        console.error('Error parsing bottleneck data from localStorage:', e);
      }
    }
  }
  return { data: null };
};

// Create the bottleneck slice
const bottleneckSlice = createSlice({
  name: 'bottleneck',
  initialState: getInitialState(),
  reducers: {
    setBottleneckData: (state, action: PayloadAction<BottleneckData>) => {
      state.data = action.payload;
      // We'll sync with localStorage in a middleware or component
    },
    clearBottleneckData: (state) => {
      state.data = null;
      // We'll sync with localStorage in a middleware or component
    },
  },
});

// Export actions and reducer
export const { setBottleneckData, clearBottleneckData } = bottleneckSlice.actions;
export default bottleneckSlice.reducer;