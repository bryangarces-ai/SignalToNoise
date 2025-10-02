import { Component, OnInit, AfterViewInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import { RatioMetrics } from '../models/task.model';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

type TimeFilter = 'daily' | 'weekly' | 'monthly';

interface DayMetrics {
  date: string;
  metrics: RatioMetrics;
  displayLabel: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  @ViewChild('plannedRatioChart') plannedRatioChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('completionChart') completionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productivityChart') productivityChartRef!: ElementRef<HTMLCanvasElement>;

  timeFilter = signal<TimeFilter>('daily');
  metricsData = signal<DayMetrics[]>([]);
  loading = signal<boolean>(true);

  // Chart instances
  private plannedRatioChart?: Chart;
  private completionChart?: Chart;
  private productivityChart?: Chart;

  constructor(private taskService: TaskService) {}

  async ngOnInit() {
    await this.loadMetricsData();
  }

  ngAfterViewInit() {
    // Wait for the next tick to ensure DOM is ready
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  /**
   * Load metrics data based on selected time filter
   */
  async loadMetricsData() {
    this.loading.set(true);
    const filter = this.timeFilter();
    const dates = await this.getDateRange(filter);
    
    const metricsPromises = dates.map(async (date) => {
      const metrics = await this.taskService.getMetricsForDate(date);
      return {
        date,
        metrics,
        displayLabel: this.formatDateLabel(date, filter)
      };
    });

    const data = await Promise.all(metricsPromises);
    this.metricsData.set(data);
    this.loading.set(false);

    // Update charts after data is loaded
    if (this.plannedRatioChart) {
      this.updateCharts();
    }
  }

  /**
   * Get date range based on filter
   */
  private async getDateRange(filter: TimeFilter): Promise<string[]> {
    const history = await this.taskService.getHistory();
    const today = this.taskService.getTodayDate();
    const allDates = [...Object.keys(history), today].sort((a, b) => b.localeCompare(a));

    switch (filter) {
      case 'daily':
        // Last 7 days
        return this.getLastNDays(7, allDates);
      case 'weekly':
        // Last 4 weeks (28 days)
        return this.getLastNDays(28, allDates);
      case 'monthly':
        // Last 90 days (3 months)
        return this.getLastNDays(90, allDates);
      default:
        return this.getLastNDays(7, allDates);
    }
  }

  /**
   * Get last N days from available dates
   */
  private getLastNDays(n: number, availableDates: string[]): string[] {
    const today = new Date();
    const dates: string[] = [];

    for (let i = n - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Only include dates that exist in our data
      if (availableDates.includes(dateStr)) {
        dates.push(dateStr);
      }
    }

    return dates;
  }

  /**
   * Format date label based on filter
   */
  private formatDateLabel(date: string, filter: TimeFilter): string {
    const dateObj = new Date(date + 'T00:00:00');
    
    switch (filter) {
      case 'daily':
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'weekly':
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'monthly':
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      default:
        return date;
    }
  }

  /**
   * Change time filter
   */
  async changeFilter(filter: TimeFilter) {
    this.timeFilter.set(filter);
    await this.loadMetricsData();
  }

  /**
   * Initialize all charts
   */
  private initializeCharts() {
    if (!this.plannedRatioChartRef || !this.completionChartRef || !this.productivityChartRef) {
      return;
    }

    this.createPlannedRatioChart();
    this.createCompletionChart();
    this.createProductivityChart();
  }

  /**
   * Update all charts with new data
   */
  private updateCharts() {
    this.updatePlannedRatioChart();
    this.updateCompletionChart();
    this.updateProductivityChart();
  }

  /**
   * Create Planned Ratio Chart (Stacked Bar)
   */
  private createPlannedRatioChart() {
    const ctx = this.plannedRatioChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.metricsData();
    const labels = data.map(d => d.displayLabel);
    const signalData = data.map(d => d.metrics.plannedSignalPercent);
    const noiseData = data.map(d => d.metrics.plannedNoisePercent);

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Signal %',
            data: signalData,
            backgroundColor: '#28a745',
            borderColor: '#1e7e34',
            borderWidth: 1
          },
          {
            label: 'Noise %',
            data: noiseData,
            backgroundColor: '#dc3545',
            borderColor: '#bd2130',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Planned Ratio (Goal: 80% Signal, 20% Noise)',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
              }
            }
          }
        }
      }
    };

    this.plannedRatioChart = new Chart(ctx, config);
  }

  /**
   * Create Completion Progress Chart (Line)
   */
  private createCompletionChart() {
    const ctx = this.completionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.metricsData();
    const labels = data.map(d => d.displayLabel);
    const signalCompletion = data.map(d => d.metrics.completionSignalPercent);
    const noiseCompletion = data.map(d => d.metrics.completionNoisePercent);

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Signal Completion %',
            data: signalCompletion,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Noise Completion %',
            data: noiseCompletion,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Completion Progress (%)',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
              }
            }
          }
        }
      }
    };

    this.completionChart = new Chart(ctx, config);
  }

  /**
   * Create Productivity Ratio Chart (Doughnut)
   */
  private createProductivityChart() {
    const ctx = this.productivityChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.metricsData();
    
    // Calculate averages across all days
    const avgEffectiveSignal = data.reduce((sum, d) => sum + d.metrics.effectiveSignalPercent, 0) / (data.length || 1);
    const avgEffectiveNoise = data.reduce((sum, d) => sum + d.metrics.effectiveNoisePercent, 0) / (data.length || 1);
    const avgIncomplete = 100 - avgEffectiveSignal - avgEffectiveNoise;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Signal Completed', 'Noise Completed', 'Incomplete'],
        datasets: [{
          data: [avgEffectiveSignal, avgEffectiveNoise, avgIncomplete],
          backgroundColor: ['#28a745', '#dc3545', '#e0e0e0'],
          borderColor: ['#1e7e34', '#bd2130', '#cccccc'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Average Productivity Ratio',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: ${value.toFixed(1)}%`;
              }
            }
          }
        }
      }
    };

    this.productivityChart = new Chart(ctx, config);
  }

  /**
   * Update Planned Ratio Chart
   */
  private updatePlannedRatioChart() {
    if (!this.plannedRatioChart) return;

    const data = this.metricsData();
    this.plannedRatioChart.data.labels = data.map(d => d.displayLabel);
    this.plannedRatioChart.data.datasets[0].data = data.map(d => d.metrics.plannedSignalPercent);
    this.plannedRatioChart.data.datasets[1].data = data.map(d => d.metrics.plannedNoisePercent);
    this.plannedRatioChart.update();
  }

  /**
   * Update Completion Chart
   */
  private updateCompletionChart() {
    if (!this.completionChart) return;

    const data = this.metricsData();
    this.completionChart.data.labels = data.map(d => d.displayLabel);
    this.completionChart.data.datasets[0].data = data.map(d => d.metrics.completionSignalPercent);
    this.completionChart.data.datasets[1].data = data.map(d => d.metrics.completionNoisePercent);
    this.completionChart.update();
  }

  /**
   * Update Productivity Chart
   */
  private updateProductivityChart() {
    if (!this.productivityChart) return;

    const data = this.metricsData();
    const avgEffectiveSignal = data.reduce((sum, d) => sum + d.metrics.effectiveSignalPercent, 0) / (data.length || 1);
    const avgEffectiveNoise = data.reduce((sum, d) => sum + d.metrics.effectiveNoisePercent, 0) / (data.length || 1);
    const avgIncomplete = 100 - avgEffectiveSignal - avgEffectiveNoise;

    this.productivityChart.data.datasets[0].data = [avgEffectiveSignal, avgEffectiveNoise, avgIncomplete];
    this.productivityChart.update();
  }

  /**
   * Get summary statistics
   */
  getSummaryStats() {
    const data = this.metricsData();
    if (data.length === 0) {
      return {
        avgPlannedSignal: '0',
        avgPlannedSignalNum: 0,
        avgCompletionSignal: '0',
        avgCompletionSignalNum: 0,
        avgProductivitySignal: '0',
        avgProductivitySignalNum: 0,
        totalTasks: 0,
        completedTasks: 0
      };
    }

    const avgPlannedSignal = data.reduce((sum, d) => sum + d.metrics.plannedSignalPercent, 0) / data.length;
    const avgCompletionSignal = data.reduce((sum, d) => sum + d.metrics.completionSignalPercent, 0) / data.length;
    const avgProductivitySignal = data.reduce((sum, d) => sum + d.metrics.effectiveSignalPercent, 0) / data.length;
    const totalTasks = data.reduce((sum, d) => sum + d.metrics.total, 0);
    const completedTasks = data.reduce((sum, d) => sum + d.metrics.signalDone + d.metrics.noiseDone, 0);

    return {
      avgPlannedSignal: avgPlannedSignal.toFixed(1),
      avgPlannedSignalNum: avgPlannedSignal,
      avgCompletionSignal: avgCompletionSignal.toFixed(1),
      avgCompletionSignalNum: avgCompletionSignal,
      avgProductivitySignal: avgProductivitySignal.toFixed(1),
      avgProductivitySignalNum: avgProductivitySignal,
      totalTasks,
      completedTasks
    };
  }

  /**
   * Cleanup charts on destroy
   */
  ngOnDestroy() {
    this.plannedRatioChart?.destroy();
    this.completionChart?.destroy();
    this.productivityChart?.destroy();
  }
}
