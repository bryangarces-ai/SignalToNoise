export interface Task {
  id: string;
  title: string;
  done: boolean;
  type: 'signal' | 'noise';
  date: string; // ISO date string (YYYY-MM-DD) to track when task was created
}

export type TaskType = 'signal' | 'noise';

/**
 * Signal-to-Noise Ratio Metrics
 */
export interface RatioMetrics {
  // Counts
  signalTotal: number;      // S_total
  noiseTotal: number;       // N_total
  total: number;            // T = S_total + N_total
  signalDone: number;       // S_done
  noiseDone: number;        // N_done
  
  // Planned Ratio (when tasks are added)
  plannedSignalPercent: number;     // (S_total / T) × 100
  plannedNoisePercent: number;      // (N_total / T) × 100
  
  // Completion Ratio (based on checkmarks)
  completionSignalPercent: number;  // (S_done / S_total) × 100
  completionNoisePercent: number;   // (N_done / N_total) × 100
  
  // Effective Signal-to-Noise Productivity Ratio
  effectiveSignalPercent: number;   // (S_done / T) × 100
  effectiveNoisePercent: number;    // (N_done / T) × 100
  
  // Warnings and recommendations
  plannedRatioWarning: string;      // Warning if planned ratio is not 80:20
  completionWarning: string;        // Warning if executing more noise than signal
  effectiveRatioWarning: string;    // Warning if actual work split is not 80:20
  summaryMessage: string;           // Daily summary message
}
