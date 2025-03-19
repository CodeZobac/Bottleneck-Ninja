'use client';

// Define the expected API response structures
interface PredictionRequest {
    test_text: string;
}

interface PredictionResponse {
    prediction: string;
	recomendation: string[];
    result: {
		agreement: boolean;
		components: {
		  CPU: string;
		  GPU: string;
		  RAM: string;
		};
		hardware_analysis: {
		  bottleneck: string;
		  percentile_ranks: unknown | string;
		  raw_benchmark_scores: unknown | string;
		  estimated_impact: {
			CPU: number;
			GPU: number;
			RAM: number;
		  };
		};
	  };
}

interface GpuModel {
    id: number;
    name: string;
}

interface GpuCategory {
    id: number;
    name: string;
    models: GpuModel[];
}

interface CpuModel {
    id: number;
    name: string;
}

interface CpuCategory {
    id: number;
    name: string;
    models: CpuModel[];
}

interface RamModel {
    id: number;
    name: string;
}

interface RamCategory {
    id: number;
    name: string;
    models: RamModel[];
}

interface ComponentsResponse {
    cpu: string[];
    gpu?: string[];
    gpus?: GpuCategory[];
    cpus?: CpuCategory[];
    rams?: RamCategory[] | string[];
}

interface ApiCall {
    get: (text: string) => Promise<PredictionRequest>;
    post: (text: string) => Promise<PredictionResponse>;
    getComponents: () => Promise<ComponentsResponse>;
    getGpuCategories: () => Promise<GpuCategory[]>;
    getCpuCategories: () => Promise<CpuCategory[]>;
    getRamCategories: () => Promise<RamCategory[]>;
}

const url = process.env.NEXT_PUBLIC_API_URL;
const endpoint1 = process.env.NEXT_PUBLIC_API_ENDPOINT1;
const endpoint2 = process.env.NEXT_PUBLIC_API_ENDPOINT2;
// const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const apiCall: ApiCall = {
    get: async (text: string) => {
        const apiUrl = `${url}/${endpoint1}/?test_text=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
            }
        });
        return response.json();
    },

    post: async (text: string) => {
        const requestBody: PredictionRequest = { test_text: text };
        const apiUrl = `${url}/${endpoint1}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
        }
        console.log('response:', response);
        return response.json();
    },

    // Enhanced debugging for getComponents
    getComponents: async () => {
        try {
            console.log('Fetching components from API...');
            const apiUrl = `${url}/${endpoint2}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                mode: 'cors'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('API response for components:', data);
            return data;
        } catch (error) {
            console.error('Error fetching components:', error);
            throw error;
        }
    },

    // New method to specifically fetch GPU categories in the correct format
    getGpuCategories: async () => {
        try {
            const data = await apiCall.getComponents();
            
            // If the API already returns gpus in the correct format
            if (data.gpus && Array.isArray(data.gpus)) {
                // Transform models array to landmarks for compatibility with Menu component
                return data.gpus.map(category => ({
                    ...category,
                    landmarks: category.models  // Map 'models' to 'landmarks' for Menu component
                }));
            }
            
            // If we need to extract from position 1 of an array (old format)
            let gpuData: string[] = [];
            
            if (Array.isArray(data)) {
                // Old array format, GPU data is at position 1
                gpuData = Array.isArray(data[1]) ? data[1] : [];
            } else if (data && data.gpu) {
                // New object format with 'gpu' property
                gpuData = Array.isArray(data.gpu) ? data.gpu : [data.gpu].filter(Boolean);
            }
            
            // Manually categorize GPUs by name patterns
            const categoryMap: { [key: string]: GpuModel[] } = {
                'NVIDIA RTX': [],
                'NVIDIA GTX': [],
                'AMD': [],
                'Other': []
            };
            
            gpuData.forEach((gpu, index) => {
                if (!gpu || typeof gpu !== 'string') return;
                
                const gpuModel: GpuModel = { id: index, name: gpu };
                const upperGpu = gpu.toUpperCase();
                
                if (upperGpu.includes('RTX')) {
                    categoryMap['NVIDIA RTX'].push(gpuModel);
                } else if (upperGpu.includes('GTX')) {
                    categoryMap['NVIDIA GTX'].push(gpuModel);
                } else if (upperGpu.includes('AMD') || upperGpu.includes('RADEON')) {
                    categoryMap['AMD'].push(gpuModel);
                } else {
                    categoryMap['Other'].push(gpuModel);
                }
            });
            
            // Convert to array format with proper structure
            const formattedCategories: GpuCategory[] = Object.entries(categoryMap)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, models]) => models.length > 0)
                .map(([name, models], index) => ({
                    id: index + 1,
                    name,
                    models,
                    landmarks: models  // Add landmarks for compatibility with Menu component
                }));
            
            return formattedCategories;
        } catch (error) {
            console.error('Error formatting GPU categories:', error);
            throw error;
        }
    },

    // Fixed CPU categories method to handle "cpus" property
    getCpuCategories: async () => {
        try {
            console.log('Getting CPU categories...');
            const data = await apiCall.getComponents();
            console.log('Raw data for CPU categorization:', data);
            
            // Check if API already returns cpus in the correct format (similar to gpus)
            if (data.cpus && Array.isArray(data.cpus)) {
                console.log('Found cpus array in correct format:', data.cpus);
                // Transform models array to landmarks for compatibility with Menu component
                return data.cpus.map(category => ({
                    ...category,
                    landmarks: category.models  // Add landmarks for compatibility with Menu component
                }));
            }
            
            // If not found in cpus, check other formats
            let cpuData: string[] = [];
            
            if (Array.isArray(data)) {
                // Old array format, CPU data is at position 0
                console.log('Data is an array, extracting from position 0');
                cpuData = Array.isArray(data[0]) ? data[0] : [];
            } else if (data && data.cpu) {
                // Object format with 'cpu' property
                console.log('Data is an object with cpu property');
                cpuData = Array.isArray(data.cpu) ? data.cpu : [data.cpu].filter(Boolean);
            } else {
                // Added case for unexpected data format
                console.error('Unexpected data format. Neither array, object with cpu property, nor object with cpus property');
                console.log('Data type:', typeof data);
                console.log('Available properties:', Object.keys(data || {}));
                console.log('Data structure:', JSON.stringify(data, null, 2));
                return []; // Return empty array on error
            }
            
            // Manually categorize CPUs by name patterns
            const categoryMap: { [key: string]: CpuModel[] } = {
                'Intel': [],
                'AMD': [],
                'Other': []
            };
            
            cpuData.forEach((cpu, index) => {
                if (!cpu || typeof cpu !== 'string') {
                    console.warn(`Invalid CPU data at index ${index}:`, cpu);
                    return;
                }
                
                const cpuModel: CpuModel = { id: index, name: cpu };
                const upperCpu = cpu.toUpperCase();
                
                if (upperCpu.includes('INTEL') || upperCpu.includes('I3') || 
                    upperCpu.includes('I5') || upperCpu.includes('I7') || 
                    upperCpu.includes('I9') || upperCpu.includes('CELERON') || 
                    upperCpu.includes('PENTIUM')) {
                    categoryMap['Intel'].push(cpuModel);
                } else if (upperCpu.includes('AMD') || upperCpu.includes('RYZEN') || 
                          upperCpu.includes('THREADRIPPER') || upperCpu.includes('ATHLON')) {
                    categoryMap['AMD'].push(cpuModel);
                } else {
                    categoryMap['Other'].push(cpuModel);
                }
            });
            
            // Log category counts to help diagnose issues
            Object.entries(categoryMap).forEach(([category, models]) => {
                console.log(`${category} CPUs found: ${models.length}`);
            });
            
            // Convert to array format with proper structure
            const formattedCategories: CpuCategory[] = Object.entries(categoryMap)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, models]) => models.length > 0)
                .map(([name, models], index) => ({
                    id: index + 1,
                    name,
                    models,
                    landmarks: models  // Add landmarks for compatibility with Menu component
                }));
            
            console.log('Formatted CPU categories:', formattedCategories);
            console.log('Number of CPU categories:', formattedCategories.length);
            
            return formattedCategories;
        } catch (error) {
            console.error('Error formatting CPU categories:', error);
            console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
            
            // Return an empty array instead of throwing, so the UI can handle the error gracefully
            return [];
        }
    },

    // New method to fetch RAM categories
    getRamCategories: async () => {
        try {
            console.log('Getting RAM categories...');
            const data = await apiCall.getComponents();
            console.log('Raw data for RAM categorization:', data);
            
            // Check if API already returns rams in the correct format
            if (data.rams && Array.isArray(data.rams) && data.rams.length > 0 && typeof data.rams[0] === 'object' && data.rams[0] !== null && 'models' in data.rams[0]) {
                console.log('Found rams array in correct structured format:', data.rams);
                // Transform models array to landmarks for compatibility with Menu component
                return (data.rams as RamCategory[]).map(category => ({
                    ...category,
                    landmarks: category.models
                }));
            }
            
            // If rams is an array of strings, we need to categorize them
            let ramData: string[] = [];
            
            if (Array.isArray(data.rams) && data.rams.length > 0 && typeof data.rams[0] === 'string') {
                console.log('Found rams as string array');
                ramData = data.rams as string[];
            } else if (Array.isArray(data)) {
                // Old array format, RAM data might be at position 2
                console.log('Data is an array, extracting from position 2');
                ramData = Array.isArray(data[2]) ? data[2] : [];
            } else {
                console.error('Unexpected RAM data format');
                console.log('Data type:', typeof data);
                console.log('Available properties:', Object.keys(data || {}));
                return []; // Return empty array on error
            }
            
            console.log('Extracted RAM data:', ramData);
            
            // Categorize RAMs by DDR type
            const categoryMap: { [key: string]: RamModel[] } = {
                'DDR5': [],
                'DDR4': [],
                'DDR3': [],
                'Other': []
            };
            
            ramData.forEach((ram, index) => {
                if (!ram || typeof ram !== 'string') {
                    console.warn(`Invalid RAM data at index ${index}:`, ram);
                    return;
                }
                
                const ramModel: RamModel = { id: index, name: ram };
                const upperRam = ram.toUpperCase();
                
                if (upperRam.includes('DDR5')) {
                    categoryMap['DDR5'].push(ramModel);
                } else if (upperRam.includes('DDR4')) {
                    categoryMap['DDR4'].push(ramModel);
                } else if (upperRam.includes('DDR3')) {
                    categoryMap['DDR3'].push(ramModel);
                } else {
                    categoryMap['Other'].push(ramModel);
                }
            });
            
            // Log category counts to help diagnose issues
            Object.entries(categoryMap).forEach(([category, models]) => {
                console.log(`${category} RAMs found: ${models.length}`);
            });
            
            // Convert to array format with proper structure
            const formattedCategories: RamCategory[] = Object.entries(categoryMap)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, models]) => models.length > 0)
                .map(([name, models], index) => ({
                    id: index + 1,
                    name,
                    models,
                    landmarks: models  // Add landmarks for compatibility with Menu component
                }));
            
            console.log('Formatted RAM categories:', formattedCategories);
            return formattedCategories;
        } catch (error) {
            console.error('Error formatting RAM categories:', error);
            console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
            
            // Return an empty array instead of throwing, so the UI can handle the error gracefully
            return [];
        }
    }
};

export default apiCall;
export type { GpuCategory, GpuModel, CpuCategory, CpuModel, RamCategory, RamModel };