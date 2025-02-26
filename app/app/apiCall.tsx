'use client';

interface PredictionRequest {
    test_text: string;
}

interface PredictionResponse {
    prediction: string;
}

interface ComponentsResponse {
    cpu: string[];
    gpu: string[];
}

interface ApiCall {
    get: (text: string) => Promise<any>;
    post: (text: string) => Promise<PredictionResponse>;
    getComponents: () => Promise<ComponentsResponse>;
}

const apiCall: ApiCall = {
    get: async (text: string) => {
        const response = await fetch(`http://localhost:8000/predict/?test_text=${encodeURIComponent(text)}`);
        return response.json();
    },

    post: async (text: string) => {
        const requestBody: PredictionRequest = { test_text: text };
        const response = await fetch('http://localhost:8000/predict/', {
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

    getComponents: async () => {
        try {
            const response = await fetch('http://localhost:8000/components/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
            }
            
            return response.json();
        } catch (error) {
            console.error('Error fetching components:', error);
            throw error;
        }
    }
};

export default apiCall;