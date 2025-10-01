import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task, RatioMetrics } from '../models/task.model';

interface DateTasks {
  date: string;
  displayDate: string;
  signalTasks: Task[];
  noiseTasks: Task[];
  expanded: boolean;
  metrics?: RatioMetrics;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  dateTasks = signal<DateTasks[]>([]);
  showDatePicker = signal(false);
  selectedDate = '';
  newSignalTask = '';
  newNoiseTask = '';
  
  // For adding tasks to selected date
  addingToDate = signal<string | null>(null);

  constructor(public taskService: TaskService) {}

  async ngOnInit() {
    await this.loadHistory();
  }

  /**
   * Load all historical dates and their tasks
   */
  async loadHistory() {
    const dates = await this.taskService.getAllDates();
    const dateTasksArray: DateTasks[] = [];

    for (const date of dates) {
      const tasks = await this.taskService.getTasksForDate(date);
      const metrics = await this.taskService.getMetricsForDate(date);
      dateTasksArray.push({
        date,
        displayDate: this.taskService.formatDate(date),
        signalTasks: tasks.filter(t => t.type === 'signal'),
        noiseTasks: tasks.filter(t => t.type === 'noise'),
        expanded: false,
        metrics
      });
    }

    this.dateTasks.set(dateTasksArray);
  }

  /**
   * Toggle expansion of a date section
   */
  toggleDate(index: number) {
    const tasks = this.dateTasks();
    tasks[index].expanded = !tasks[index].expanded;
    this.dateTasks.set([...tasks]);
  }

  /**
   * Toggle task completion
   */
  async toggleTask(taskId: string, date: string) {
    await this.taskService.toggleTaskDoneForDate(taskId, date);
    await this.loadHistory();
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string, date: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      await this.taskService.deleteTaskFromDate(taskId, date);
      await this.loadHistory();
    }
  }

  /**
   * Get completed count for tasks
   */
  getCompletedCount(tasks: Task[]): number {
    return tasks.filter(task => task.done).length;
  }

  /**
   * Open date picker modal
   */
  openDatePicker() {
    // Set default to today
    this.selectedDate = this.taskService.getTodayDate();
    this.showDatePicker.set(true);
  }

  /**
   * Close date picker modal
   */
  closeDatePicker() {
    this.showDatePicker.set(false);
    this.addingToDate.set(null);
    this.newSignalTask = '';
    this.newNoiseTask = '';
  }

  /**
   * Start adding tasks to selected date
   */
  async selectDateForTasks() {
    if (!this.selectedDate) return;
    this.addingToDate.set(this.selectedDate);
  }

  /**
   * Add Signal task to selected date
   */
  async addSignalTaskToDate() {
    const date = this.addingToDate();
    if (date && this.newSignalTask.trim()) {
      await this.taskService.addTaskToDate(this.newSignalTask, 'signal', date);
      this.newSignalTask = '';
      await this.loadHistory();
    }
  }

  /**
   * Add Noise task to selected date
   */
  async addNoiseTaskToDate() {
    const date = this.addingToDate();
    if (date && this.newNoiseTask.trim()) {
      await this.taskService.addTaskToDate(this.newNoiseTask, 'noise', date);
      this.newNoiseTask = '';
      await this.loadHistory();
    }
  }

  /**
   * Finish adding tasks and close modal
   */
  finishAddingTasks() {
    this.closeDatePicker();
  }

  /**
   * Delete all tasks for a date
   */
  async deleteDate(date: string) {
    const formattedDate = this.taskService.formatDate(date);
    if (confirm(`Are you sure you want to delete all tasks from ${formattedDate}?`)) {
      await this.taskService.clearHistoryForDate(date);
      await this.loadHistory();
    }
  }
}
