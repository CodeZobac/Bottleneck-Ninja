export interface PredictionRequest {
    test_text: string;
}

export interface PredictionResponse {
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

export interface GpuModel {
    id: number;
    name: string;
}

export interface GpuCategory {
    id: number;
    name: string;
    models: GpuModel[];
}

export interface CpuModel {
    id: number;
    name: string;
}

export interface CpuCategory {
    id: number;
    name: string;
    models: CpuModel[];
}

export interface RamModel {
    id: number;
    name: string;
}

export interface RamCategory {
    id: number;
    name: string;
    models: RamModel[];
}

export interface ComponentsResponse {
    cpu: string[];
    gpu?: string[];
    gpus?: GpuCategory[];
    cpus?: CpuCategory[];
    rams?: RamCategory[] | string[];
}

export interface ApiCall {
    get: (text: string) => Promise<PredictionRequest>;
    post: (text: string) => Promise<PredictionResponse>;
    getComponents: () => Promise<ComponentsResponse>;
    getGpuCategories: () => Promise<GpuCategory[]>;
    getCpuCategories: () => Promise<CpuCategory[]>;
    getRamCategories: () => Promise<RamCategory[]>;
}