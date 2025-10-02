import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task, RatioMetrics } from '../models/task.model';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './today.component.html',
  styleUrl: './today.component.css'
})
export class TodayComponent implements OnInit, OnDestroy {
  title = 'Signal To Noise';
  currentDate = new Date();
  
  // Signals for reactive state management
  signalTasks = signal<Task[]>([]);
  noiseTasks = signal<Task[]>([]);
  metrics = signal<RatioMetrics | null>(null);
  
  // Input fields
  newSignalTask = '';
  newNoiseTask = '';
  
  // Edit task state
  editingTaskId: string | null = null;
  editingTaskTitle = '';
  
  // Day change detection
  private lastCheckedDate = '';
  private dayCheckInterval?: number;
  private activityListeners: (() => void)[] = [];

  constructor(private taskService: TaskService) {}

  async ngOnInit() {
    await this.checkForNewDay();
    await this.loadTasks();
    this.setupDayChangeDetection();
  }

  ngOnDestroy() {
    // Clean up interval
    if (this.dayCheckInterval) {
      clearInterval(this.dayCheckInterval);
    }
    
    // Clean up activity listeners
    this.activityListeners.forEach(cleanup => cleanup());
  }

  /**
   * Check if it's a new day and reset if needed
   */
  private async checkForNewDay(): Promise<void> {
    const currentDate = this.getTodayDate();
    
    if (this.lastCheckedDate && this.lastCheckedDate !== currentDate) {
      console.log('New day detected! Archiving and resetting...');
      await this.taskService.checkAndResetForNewDay();
      await this.checkForAdvanceTasks();
      await this.loadTasks();
      this.currentDate = new Date();
    }
    
    this.lastCheckedDate = currentDate;
  }

  /**
   * Check if there are advance-planned tasks for today and they will be migrated automatically
   */
  private async checkForAdvanceTasks(): Promise<void> {
    const today = this.getTodayDate();
    const advanceTasks = await this.taskService.getTasksForDate(today);
    
    if (advanceTasks.length > 0) {
      console.log(`Checking for advance-planned tasks for ${today}...`);
      // getTasks() in loadTasks() will handle the migration automatically
    }
  }

  /**
   * Setup hybrid day change detection:
   * 1. Instant checks on user activity
   * 2. Fallback periodic check every 30 minutes
   * 3. Mobile app lifecycle events (Capacitor)
   */
  private setupDayChangeDetection(): void {
    const activityHandler = () => this.checkForNewDay();
    
    // Activity-based checks (instant response)
    const clickListener = () => activityHandler();
    const focusListener = () => activityHandler();
    
    document.addEventListener('click', clickListener);
    window.addEventListener('focus', focusListener);
    
    // Store cleanup functions
    this.activityListeners.push(
      () => document.removeEventListener('click', clickListener),
      () => window.removeEventListener('focus', focusListener)
    );
    
    // Mobile-specific: Check when app comes to foreground
    App.addListener('resume', () => {
      console.log('App resumed from background');
      activityHandler();
    });
    
    // Fallback: Check every 30 minutes for idle users
    this.dayCheckInterval = window.setInterval(() => {
      console.log('Periodic day check (30 min interval)');
      this.checkForNewDay();
    }, 1800000); // 30 minutes = 1800000ms
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Load all tasks from storage and calculate metrics
   */
  async loadTasks() {
    const allTasks = await this.taskService.getTasks();
    this.signalTasks.set(allTasks.filter(task => task.type === 'signal'));
    this.noiseTasks.set(allTasks.filter(task => task.type === 'noise'));
    
    // Calculate and update metrics
    const ratioMetrics = await this.taskService.getCurrentDayMetrics();
    this.metrics.set(ratioMetrics);
  }

  /**
   * Add a new Signal task
   */
  async addSignalTask() {
    if (this.newSignalTask.trim()) {
      await this.taskService.addTask(this.newSignalTask, 'signal');
      this.newSignalTask = '';
      await this.loadTasks();
    }
  }

  /**
   * Add a new Noise task
   */
  async addNoiseTask() {
    if (this.newNoiseTask.trim()) {
      await this.taskService.addTask(this.newNoiseTask, 'noise');
      this.newNoiseTask = '';
      await this.loadTasks();
    }
  }

  /**
   * Toggle task completion status
   */
  async toggleTask(taskId: string) {
    await this.taskService.toggleTaskDone(taskId);
    await this.loadTasks();
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string) {
    await this.taskService.deleteTask(taskId);
    await this.loadTasks();
  }

  /**
   * Start editing a task
   */
  startEditTask(task: Task) {
    this.editingTaskId = task.id;
    this.editingTaskTitle = task.title;
  }

  /**
   * Save edited task
   */
  async saveEditTask() {
    if (this.editingTaskId && this.editingTaskTitle.trim()) {
      await this.taskService.updateTask(this.editingTaskId, { title: this.editingTaskTitle.trim() });
      this.editingTaskId = null;
      this.editingTaskTitle = '';
      await this.loadTasks();
    }
  }

  /**
   * Cancel editing a task
   */
  cancelEditTask() {
    this.editingTaskId = null;
    this.editingTaskTitle = '';
  }

  /**
   * Clear all Signal tasks
   */
  async clearSignalTasks() {
    if (confirm('Are you sure you want to clear all Signal tasks?')) {
      await this.taskService.clearTasksByType('signal');
      await this.loadTasks();
    }
  }

  /**
   * Clear all Noise tasks
   */
  async clearNoiseTasks() {
    if (confirm('Are you sure you want to clear all Noise tasks?')) {
      await this.taskService.clearTasksByType('noise');
      await this.loadTasks();
    }
  }

  /**
   * Clear all tasks (new day reset)
   */
  async clearAllTasks() {
    if (confirm('Are you sure you want to clear ALL tasks? This will start a fresh day.')) {
      await this.taskService.clearAllTasks();
      await this.loadTasks();
    }
  }

  /**
   * Get completed count for a task type
   */
  getCompletedCount(tasks: Task[]): number {
    return tasks.filter(task => task.done).length;
  }
}
