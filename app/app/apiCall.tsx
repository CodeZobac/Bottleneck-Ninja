

interface ApiCall {
    get: (url: string) => Promise<any>;
    };

const apiCall: ApiCall = {
    get: async (url: string) => {
        const response = await fetch(url);
        return response.json();
    }
};

export default apiCall;