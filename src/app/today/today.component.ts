import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task, RatioMetrics } from '../models/task.model';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './today.component.html',
  styleUrl: './today.component.css'
})
export class TodayComponent implements OnInit {
  title = 'SignalNoise';
  
  // Signals for reactive state management
  signalTasks = signal<Task[]>([]);
  noiseTasks = signal<Task[]>([]);
  metrics = signal<RatioMetrics | null>(null);
  
  // Input fields
  newSignalTask = '';
  newNoiseTask = '';

  constructor(private taskService: TaskService) {}

  async ngOnInit() {
    await this.loadTasks();
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
