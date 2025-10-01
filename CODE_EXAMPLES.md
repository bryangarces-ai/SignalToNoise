# SignalNoise - Code Examples

## Quick Code Reference Guide

### 1. Task Model (task.model.ts)

```typescript
export interface Task {
  id: string;                      // Unique identifier
  title: string;                   // Task description
  done: boolean;                   // Completion status
  type: 'signal' | 'noise';       // Task category
  date: string;                    // Creation date (ISO format)
}

export type TaskType = 'signal' | 'noise';
```

**Usage:**
```typescript
const task: Task = {
  id: 'abc123',
  title: 'Complete project',
  done: false,
  type: 'signal',
  date: '2025-10-01'
};
```

---

### 2. Task Service (task.service.ts)

#### Key Methods:

**Add a task:**
```typescript
await this.taskService.addTask('My important task', 'signal');
```

**Get all tasks:**
```typescript
const allTasks = await this.taskService.getTasks();
```

**Get tasks by type:**
```typescript
const signalTasks = await this.taskService.getTasksByType('signal');
const noiseTasks = await this.taskService.getTasksByType('noise');
```

**Toggle task completion:**
```typescript
await this.taskService.toggleTaskDone(taskId);
```

**Delete a task:**
```typescript
await this.taskService.deleteTask(taskId);
```

**Clear tasks by type:**
```typescript
await this.taskService.clearTasksByType('signal');
await this.taskService.clearTasksByType('noise');
```

**Clear all tasks:**
```typescript
await this.taskService.clearAllTasks();
```

---

### 3. App Component (app.component.ts)

#### Using Angular Signals:

```typescript
// Define signals for reactive state
signalTasks = signal<Task[]>([]);
noiseTasks = signal<Task[]>([]);

// Read signal values
const tasks = this.signalTasks();
const count = this.signalTasks().length;

// Update signal values
this.signalTasks.set([...newTasks]);
```

#### Component Methods:

**Load tasks:**
```typescript
async loadTasks() {
  const allTasks = await this.taskService.getTasks();
  this.signalTasks.set(allTasks.filter(task => task.type === 'signal'));
  this.noiseTasks.set(allTasks.filter(task => task.type === 'noise'));
}
```

**Add a task:**
```typescript
async addSignalTask() {
  if (this.newSignalTask.trim()) {
    await this.taskService.addTask(this.newSignalTask, 'signal');
    this.newSignalTask = '';
    await this.loadTasks();
  }
}
```

**Toggle task:**
```typescript
async toggleTask(taskId: string) {
  await this.taskService.toggleTaskDone(taskId);
  await this.loadTasks();
}
```

---

### 4. Template Syntax (app.component.html)

#### Angular Control Flow:

**@if directive:**
```html
@if (signalTasks().length === 0) {
  <p class="empty-state">No tasks yet!</p>
}
```

**@for directive:**
```html
@for (task of signalTasks(); track task.id) {
  <div class="task-item">
    <span>{{ task.title }}</span>
  </div>
}
```

#### Two-way binding:
```html
<input
  type="text"
  [(ngModel)]="newSignalTask"
  placeholder="Add a task..."
/>
```

#### Event binding:
```html
<!-- Click event -->
<button (click)="addSignalTask()">Add</button>

<!-- Enter key event -->
<input (keyup.enter)="addSignalTask()" />

<!-- Change event -->
<input type="checkbox" (change)="toggleTask(task.id)" />
```

#### Property binding:
```html
<input [checked]="task.done" />
<button [disabled]="!newSignalTask.trim()">Add</button>
```

#### Class binding:
```html
<div [class.task-done]="task.done">
  {{ task.title }}
</div>
```

---

### 5. Capacitor Storage (How it works)

#### Behind the scenes in TaskService:

**Store data:**
```typescript
await Preferences.set({
  key: 'signalnoise_tasks',
  value: JSON.stringify(tasks)
});
```

**Retrieve data:**
```typescript
const { value } = await Preferences.get({ 
  key: 'signalnoise_tasks' 
});
const tasks = value ? JSON.parse(value) : [];
```

**Remove data:**
```typescript
await Preferences.remove({ 
  key: 'signalnoise_tasks' 
});
```

**Check date for daily reset:**
```typescript
// Get today's date
const today = new Date().toISOString().split('T')[0]; // "2025-10-01"

// Get stored date
const { value } = await Preferences.get({ key: 'signalnoise_last_date' });

// Compare and reset if different
if (value && value !== today) {
  await this.clearAllTasks();
}

// Store new date
await Preferences.set({ 
  key: 'signalnoise_last_date', 
  value: today 
});
```

---

### 6. CSS Examples

#### Custom Checkbox:
```css
.task-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
}

.checkmark {
  height: 24px;
  width: 24px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
}

.task-checkbox input[type="checkbox"]:checked ~ .checkmark {
  background-color: #2563eb;
}

.task-checkbox input[type="checkbox"]:checked ~ .checkmark::after {
  content: '✓';
  color: white;
}
```

#### Responsive Design:
```css
/* Mobile first (default) */
.task-input {
  font-size: 1rem;
  padding: 0.75rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .task-input {
    font-size: 1.125rem;
    padding: 1rem;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .task-input {
    font-size: 0.875rem;
  }
}
```

#### Task Item Animation:
```css
.task-item {
  transition: all 0.2s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.task-item.task-done {
  opacity: 0.6;
}

.task-item.task-done .task-title {
  text-decoration: line-through;
}
```

---

### 7. Common Patterns

#### Pattern 1: Add Task Flow
```typescript
// 1. User types in input (two-way binding)
newSignalTask = 'Buy groceries';

// 2. User presses Enter or clicks Add
async addSignalTask() {
  // 3. Validate input
  if (this.newSignalTask.trim()) {
    // 4. Call service to save
    await this.taskService.addTask(this.newSignalTask, 'signal');
    // 5. Clear input
    this.newSignalTask = '';
    // 6. Refresh UI
    await this.loadTasks();
  }
}
```

#### Pattern 2: Toggle Task Flow
```html
<!-- 1. Checkbox in template -->
<input
  type="checkbox"
  [checked]="task.done"
  (change)="toggleTask(task.id)"
/>
```

```typescript
// 2. Toggle handler
async toggleTask(taskId: string) {
  // 3. Update in storage
  await this.taskService.toggleTaskDone(taskId);
  // 4. Refresh UI
  await this.loadTasks();
}
```

#### Pattern 3: Filter and Display
```typescript
// Service provides all tasks
async getTasks(): Promise<Task[]> { ... }

// Component filters by type
async loadTasks() {
  const allTasks = await this.taskService.getTasks();
  
  // Filter for Signal section
  this.signalTasks.set(
    allTasks.filter(task => task.type === 'signal')
  );
  
  // Filter for Noise section
  this.noiseTasks.set(
    allTasks.filter(task => task.type === 'noise')
  );
}
```

---

### 8. Debugging Tips

#### Log task data:
```typescript
async loadTasks() {
  const allTasks = await this.taskService.getTasks();
  console.log('All tasks:', allTasks);
  console.log('Signal tasks:', allTasks.filter(t => t.type === 'signal'));
  console.log('Noise tasks:', allTasks.filter(t => t.type === 'noise'));
  // ... rest of code
}
```

#### Check storage in browser:
```typescript
// Open browser console and run:
import { Preferences } from '@capacitor/preferences';

// View stored tasks
const { value } = await Preferences.get({ key: 'signalnoise_tasks' });
console.log(JSON.parse(value));

// View last date
const { value: date } = await Preferences.get({ key: 'signalnoise_last_date' });
console.log(date);

// Clear storage (testing)
await Preferences.clear();
```

#### Verify daily reset:
```typescript
// In TaskService, add logs:
private async checkAndResetForNewDay(): Promise<void> {
  const today = this.getTodayDate();
  const lastDate = await this.getLastDate();
  
  console.log('Today:', today);
  console.log('Last date:', lastDate);
  
  if (lastDate && lastDate !== today) {
    console.log('New day detected! Clearing tasks...');
    await this.clearAllTasks();
  }
}
```

---

### 9. Extending the App

#### Add Task Priority:
```typescript
// 1. Update model
export interface Task {
  // ... existing fields
  priority?: 'high' | 'medium' | 'low';
}

// 2. Update service
async addTask(title: string, type: TaskType, priority?: string) {
  const newTask: Task = {
    // ... existing fields
    priority: priority as any
  };
}

// 3. Update component
<select [(ngModel)]="selectedPriority">
  <option value="high">High</option>
  <option value="medium">Medium</option>
  <option value="low">Low</option>
</select>
```

#### Add Task Notes:
```typescript
// 1. Update model
export interface Task {
  // ... existing fields
  notes?: string;
}

// 2. Add textarea in template
<textarea
  [(ngModel)]="task.notes"
  (change)="updateTask(task)"
></textarea>
```

---

### 10. Performance Tips

```typescript
// Use trackBy for better performance
@for (task of signalTasks(); track task.id) {
  <!-- task template -->
}

// Debounce input (optional)
import { debounceTime } from 'rxjs/operators';

// Lazy load images
<img loading="lazy" src="..." />

// Optimize change detection
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

---

## Quick Command Reference

```powershell
# Development
npm start                    # Start dev server
npm test                     # Run tests
npm run build               # Production build

# Capacitor
npx cap sync                # Sync all platforms
npx cap sync android        # Sync Android only
npx cap open android        # Open in Android Studio
npx cap copy                # Copy web assets only

# Android
cd android                  # Navigate to Android project
./gradlew clean            # Clean build
./gradlew build            # Build project

# Git
git status                  # Check status
git add .                   # Stage all changes
git commit -m "message"    # Commit changes
git push                    # Push to remote
```

---

**📚 This covers all the key code patterns in the SignalNoise app!**

For implementation details, see the actual source files.
For build instructions, see BUILD_AND_DEPLOY.md.
