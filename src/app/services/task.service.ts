import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Task, TaskType, RatioMetrics } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly TASKS_KEY = 'signalnoise_tasks';
  private readonly HISTORY_KEY = 'signalnoise_history';
  private readonly LAST_DATE_KEY = 'signalnoise_last_date';

  constructor() {
    this.checkAndResetForNewDay();
  }

  /**
   * Check if it's a new day and archive current tasks to history
   */
  private async checkAndResetForNewDay(): Promise<void> {
    const today = this.getTodayDate();
    const lastDate = await this.getLastDate();

    if (lastDate && lastDate !== today) {
      // Archive current day's tasks to history before clearing
      await this.archiveCurrentTasks(lastDate);
      // Clear current tasks for new day
      await this.clearAllTasks();
    }

    // Update the last date
    await Preferences.set({
      key: this.LAST_DATE_KEY,
      value: today
    });
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  
  /**
   * Format date to readable string
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Get the last stored date
   */
  private async getLastDate(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.LAST_DATE_KEY });
    return value;
  }

  /**
   * Get all tasks
   */
  async getTasks(): Promise<Task[]> {
    try {
      const { value } = await Preferences.get({ key: this.TASKS_KEY });
      if (value) {
        return JSON.parse(value);
      }
      return [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  /**
   * Get tasks by type (signal or noise)
   */
  async getTasksByType(type: TaskType): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.type === type);
  }

  /**
   * Save all tasks
   */
  private async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await Preferences.set({
        key: this.TASKS_KEY,
        value: JSON.stringify(tasks)
      });
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  /**
   * Add a new task (optionally for a specific date)
   */
  async addTask(title: string, type: TaskType, date?: string): Promise<Task> {
    const taskDate = date || this.getTodayDate();
    const newTask: Task = {
      id: this.generateId(),
      title: title.trim(),
      done: false,
      type,
      date: taskDate
    };

    const tasks = await this.getTasks();
    tasks.push(newTask);
    await this.saveTasks(tasks);

    return newTask;
  }

  /**
   * Update a task (mainly for toggling done status)
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
      await this.saveTasks(tasks);
    }
  }

  /**
   * Toggle task done status
   */
  async toggleTaskDone(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      task.done = !task.done;
      await this.saveTasks(tasks);
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    await this.saveTasks(filteredTasks);
  }

  /**
   * Clear all tasks (used for new day reset)
   */
  async clearAllTasks(): Promise<void> {
    await Preferences.set({
      key: this.TASKS_KEY,
      value: JSON.stringify([])
    });
  }

  /**
   * Clear tasks by type
   */
  async clearTasksByType(type: TaskType): Promise<void> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(task => task.type !== type);
    await this.saveTasks(filteredTasks);
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // ========== HISTORY METHODS ==========

  /**
   * Archive current tasks to history
   */
  private async archiveCurrentTasks(date: string): Promise<void> {
    const currentTasks = await this.getTasks();
    if (currentTasks.length === 0) return;

    const history = await this.getHistory();
    history[date] = currentTasks;
    await this.saveHistory(history);
  }

  /**
   * Get all history (tasks grouped by date)
   */
  async getHistory(): Promise<{ [date: string]: Task[] }> {
    try {
      const { value } = await Preferences.get({ key: this.HISTORY_KEY });
      if (value) {
        return JSON.parse(value);
      }
      return {};
    } catch (error) {
      console.error('Error getting history:', error);
      return {};
    }
  }

  /**
   * Save history
   */
  private async saveHistory(history: { [date: string]: Task[] }): Promise<void> {
    try {
      await Preferences.set({
        key: this.HISTORY_KEY,
        value: JSON.stringify(history)
      });
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  /**
   * Get tasks for a specific date
   */
  async getTasksForDate(date: string): Promise<Task[]> {
    // Check if it's today's date
    if (date === this.getTodayDate()) {
      return await this.getTasks();
    }

    // Otherwise, get from history
    const history = await this.getHistory();
    return history[date] || [];
  }

  /**
   * Get all dates that have tasks (sorted newest first)
   */
  async getAllDates(): Promise<string[]> {
    const history = await this.getHistory();
    const dates = Object.keys(history);
    
    // Add today if there are current tasks
    const currentTasks = await this.getTasks();
    const today = this.getTodayDate();
    if (currentTasks.length > 0 && !dates.includes(today)) {
      dates.push(today);
    }

    // Sort dates in descending order (newest first)
    return dates.sort((a, b) => b.localeCompare(a));
  }

  /**
   * Save tasks for a specific date (for creating historical entries)
   */
  async saveTasksForDate(date: string, tasks: Task[]): Promise<void> {
    if (date === this.getTodayDate()) {
      // If it's today, save to current tasks
      await this.saveTasks(tasks);
    } else {
      // Otherwise, save to history
      const history = await this.getHistory();
      history[date] = tasks;
      await this.saveHistory(history);
    }
  }

  /**
   * Add task to a specific date
   */
  async addTaskToDate(title: string, type: TaskType, date: string): Promise<Task> {
    const newTask: Task = {
      id: this.generateId(),
      title: title.trim(),
      done: false,
      type,
      date: date
    };

    const tasksForDate = await this.getTasksForDate(date);
    tasksForDate.push(newTask);
    await this.saveTasksForDate(date, tasksForDate);

    return newTask;
  }

  /**
   * Delete task from a specific date
   */
  async deleteTaskFromDate(taskId: string, date: string): Promise<void> {
    const tasksForDate = await this.getTasksForDate(date);
    const filteredTasks = tasksForDate.filter(task => task.id !== taskId);
    await this.saveTasksForDate(date, filteredTasks);
  }

  /**
   * Toggle task done status for a specific date
   */
  async toggleTaskDoneForDate(taskId: string, date: string): Promise<void> {
    const tasksForDate = await this.getTasksForDate(date);
    const task = tasksForDate.find(t => t.id === taskId);
    
    if (task) {
      task.done = !task.done;
      await this.saveTasksForDate(date, tasksForDate);
    }
  }

  /**
   * Clear history for a specific date
   */
  async clearHistoryForDate(date: string): Promise<void> {
    const history = await this.getHistory();
    delete history[date];
    await this.saveHistory(history);
  }

  // ========== SIGNAL-TO-NOISE RATIO COMPUTATION ==========

  /**
   * Calculate Signal-to-Noise Ratio Metrics
   * Implements the three ratio formulas: Planned, Completion, and Effective
   */
  calculateRatioMetrics(tasks: Task[]): RatioMetrics {
    // Count tasks by type and completion status
    const signalTasks = tasks.filter(t => t.type === 'signal');
    const noiseTasks = tasks.filter(t => t.type === 'noise');
    
    const signalTotal = signalTasks.length;
    const noiseTotal = noiseTasks.length;
    const total = signalTotal + noiseTotal;
    
    const signalDone = signalTasks.filter(t => t.done).length;
    const noiseDone = noiseTasks.filter(t => t.done).length;

    // Initialize metrics with default values
    const metrics: RatioMetrics = {
      signalTotal,
      noiseTotal,
      total,
      signalDone,
      noiseDone,
      plannedSignalPercent: 0,
      plannedNoisePercent: 0,
      completionSignalPercent: 0,
      completionNoisePercent: 0,
      effectiveSignalPercent: 0,
      effectiveNoisePercent: 0,
      plannedRatioWarning: '',
      completionWarning: '',
      effectiveRatioWarning: '',
      summaryMessage: ''
    };

    // If no tasks, return empty metrics
    if (total === 0) {
      metrics.summaryMessage = 'No tasks yet. Start adding tasks to track your productivity!';
      return metrics;
    }

    // 1. PLANNED RATIO (when tasks are added)
    metrics.plannedSignalPercent = (signalTotal / total) * 100;
    metrics.plannedNoisePercent = (noiseTotal / total) * 100;

    // Check if planned ratio is close to 80:20
    if (metrics.plannedSignalPercent < 70) {
      metrics.plannedRatioWarning = `⚠️ Planned too much noise (${metrics.plannedSignalPercent.toFixed(0)}:${metrics.plannedNoisePercent.toFixed(0)}). Goal is 80:20.`;
    } else if (metrics.plannedSignalPercent > 90) {
      metrics.plannedRatioWarning = `ℹ️ Very signal-focused (${metrics.plannedSignalPercent.toFixed(0)}:${metrics.plannedNoisePercent.toFixed(0)}). Some noise tasks are normal.`;
    } else {
      metrics.plannedRatioWarning = `✅ Good balance (${metrics.plannedSignalPercent.toFixed(0)}:${metrics.plannedNoisePercent.toFixed(0)}). Close to 80:20 goal.`;
    }

    // 2. COMPLETION RATIO (based on checkmarks)
    if (signalTotal > 0) {
      metrics.completionSignalPercent = (signalDone / signalTotal) * 100;
    }
    if (noiseTotal > 0) {
      metrics.completionNoisePercent = (noiseDone / noiseTotal) * 100;
    }

    // Check if executing more noise than signal
    if (signalTotal > 0 && noiseTotal > 0) {
      if (metrics.completionNoisePercent > metrics.completionSignalPercent + 15) {
        metrics.completionWarning = `⚠️ Completing more noise (${metrics.completionNoisePercent.toFixed(0)}%) than signal (${metrics.completionSignalPercent.toFixed(0)}%).`;
      } else if (metrics.completionSignalPercent > metrics.completionNoisePercent) {
        metrics.completionWarning = `✅ Good focus! Signal completion (${metrics.completionSignalPercent.toFixed(0)}%) ahead of noise (${metrics.completionNoisePercent.toFixed(0)}%).`;
      }
    }

    // 3. EFFECTIVE SIGNAL-TO-NOISE PRODUCTIVITY RATIO
    metrics.effectiveSignalPercent = (signalDone / total) * 100;
    metrics.effectiveNoisePercent = (noiseDone / total) * 100;

    const totalDone = signalDone + noiseDone;
    if (totalDone > 0) {
      const actualSignalRatio = (signalDone / totalDone) * 100;
      const actualNoiseRatio = (noiseDone / totalDone) * 100;
      
      if (actualSignalRatio < 70) {
        metrics.effectiveRatioWarning = `⚠️ Actual work split was ${actualSignalRatio.toFixed(0)}:${actualNoiseRatio.toFixed(0)}, not 80:20.`;
      } else if (actualSignalRatio >= 70 && actualSignalRatio < 85) {
        metrics.effectiveRatioWarning = `✅ Good effective ratio (${actualSignalRatio.toFixed(0)}:${actualNoiseRatio.toFixed(0)}). Close to 80:20 goal!`;
      } else {
        metrics.effectiveRatioWarning = `✅ Excellent! Effective ratio is ${actualSignalRatio.toFixed(0)}:${actualNoiseRatio.toFixed(0)}.`;
      }
    }

    // Generate summary message
    metrics.summaryMessage = this.generateSummaryMessage(metrics);

    return metrics;
  }

  /**
   * Generate a daily summary message based on metrics
   */
  private generateSummaryMessage(metrics: RatioMetrics): string {
    if (metrics.total === 0) {
      return 'No tasks yet. Start adding tasks to track your productivity!';
    }

    const totalDone = metrics.signalDone + metrics.noiseDone;
    if (totalDone === 0) {
      return `You have ${metrics.total} tasks planned (${metrics.plannedSignalPercent.toFixed(0)}% Signal, ${metrics.plannedNoisePercent.toFixed(0)}% Noise). Start checking them off!`;
    }

    const actualSignalRatio = totalDone > 0 ? (metrics.signalDone / totalDone) * 100 : 0;
    const actualNoiseRatio = totalDone > 0 ? (metrics.noiseDone / totalDone) * 100 : 0;

    const plannedRatio = `${metrics.plannedSignalPercent.toFixed(0)}:${metrics.plannedNoisePercent.toFixed(0)}`;
    const executedRatio = `${actualSignalRatio.toFixed(0)}:${actualNoiseRatio.toFixed(0)}`;

    if (actualSignalRatio >= 75) {
      return `🎉 Excellent work! You planned ${plannedRatio} and executed ${executedRatio}. Keep it up!`;
    } else if (actualSignalRatio >= 60) {
      return `👍 Good progress! You planned ${plannedRatio} and executed ${executedRatio}. Try to focus more on Signal tasks.`;
    } else {
      return `💡 You planned ${plannedRatio}, but executed ${executedRatio}. Try shifting focus to Signal tasks tomorrow.`;
    }
  }

  /**
   * Calculate ratio metrics for current day
   */
  async getCurrentDayMetrics(): Promise<RatioMetrics> {
    const tasks = await this.getTasks();
    return this.calculateRatioMetrics(tasks);
  }

  /**
   * Calculate ratio metrics for a specific date
   */
  async getMetricsForDate(date: string): Promise<RatioMetrics> {
    const tasks = await this.getTasksForDate(date);
    return this.calculateRatioMetrics(tasks);
  }
}
