// filepath: /root/dev/scuzzy/Bottleneck-Ninja/bottleneckCalculator/app/builds/types.ts
export interface HardwareBuild {
  id?: string;
  user_id?: string;
  cpu: string;
  gpu: string;
  ram: string;
  budget?: number;
  cpu_intensive?: boolean;
  gpu_intensive?: boolean;
  gaming?: boolean;
  recomendation?: string[] | string;
  result: {
    agreement: boolean;
    components: {
      CPU: string;
      GPU: string;
      RAM: string;
    };
    hardware_analysis: {
      bottleneck: string;
      percentile_ranks?: unknown;
      raw_benchmark_scores?: unknown;
      estimated_impact: {
        CPU: number;
        GPU: number;
        RAM: number;
      };
    };
  };
  timestamp?: string;
  created_at?: string;
}