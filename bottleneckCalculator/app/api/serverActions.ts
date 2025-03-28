'use server';

import apiCall from './apiCall';
import { 
    PredictionResponse, 
    GpuCategory, 
    CpuCategory, 
    RamCategory,
    ComponentsResponse
} from './types';

export async function sendPostRequest(text: string): Promise<PredictionResponse> {
    return apiCall.post(text);
}

export async function sendGetRequest(text: string) {
    return apiCall.get(text);
}

export async function getComponents(): Promise<ComponentsResponse> {
    return apiCall.getComponents();
}

export async function getGpuCategories(): Promise<GpuCategory[]> {
    return apiCall.getGpuCategories();
}

export async function getCpuCategories(): Promise<CpuCategory[]> {
    return apiCall.getCpuCategories();
}

export async function getRamCategories(): Promise<RamCategory[]> {
    return apiCall.getRamCategories();
}