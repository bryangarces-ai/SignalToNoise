# Advance Task Planning Feature

## Overview
Users can create tasks in advance for future dates using the History component. When the date arrives, those tasks automatically appear in the Today view.

## How It Works

### 1. **Creating Advance Tasks**
Users can create tasks for any future date:
1. Open the History component (📚 History button)
2. Click "📅 Add Tasks"
3. Select a future date (e.g., October 5th when it's October 2nd)
4. Add Signal and/or Noise tasks
5. Tasks are stored in history under that date

### 2. **Automatic Migration**
When the future date arrives, tasks are automatically migrated:

#### On App Load:
```typescript
async ngOnInit() {
  await this.checkForNewDay();
  await this.checkForAdvanceTasks(); // Checks for advance tasks
  await this.loadTasks();
  this.setupDayChangeDetection();
}
```

#### On Day Change (Midnight):
```typescript
private async checkForNewDay(): Promise<void> {
  if (this.lastCheckedDate && this.lastCheckedDate !== currentDate) {
    await this.taskService.checkAndResetForNewDay();
    await this.checkForAdvanceTasks(); // Checks for advance tasks
    await this.loadTasks();
  }
}
```

#### In getTasks() Method:
```typescript
async getTasks(): Promise<Task[]> {
  const currentTasks = await getCurrentTasksFromStorage();
  const advanceTasks = await getAdvanceTasksFromHistory(today);
  
  if (advanceTasks.length > 0 && currentTasks.length === 0) {
    // Migrate advance tasks to current
    await this.saveTasks(advanceTasks);
    await removeFromHistory(today);
    return advanceTasks;
  }
  
  if (advanceTasks.length > 0 && currentTasks.length > 0) {
    // Merge without duplicates
    const mergedTasks = mergeTasks(currentTasks, advanceTasks);
    await this.saveTasks(mergedTasks);
    await removeFromHistory(today);
    return mergedTasks;
  }
  
  return currentTasks;
}
```

### 3. **Migration Scenarios**

#### Scenario A: Only Advance Tasks Exist
**Before (Oct 2, History):**
- Oct 3: "Meeting at 9 AM", "Gym workout"

**After (Oct 3 arrives):**
- Today: "Meeting at 9 AM", "Gym workout"
- History (Oct 3): Empty (migrated to current)

#### Scenario B: Both Advance and Current Tasks Exist
**Before (Oct 2, History):**
- Oct 3: "Pre-planned meeting"

**Oct 3 (user adds new task):**
- Today: "Emergency task"

**After Merge:**
- Today: "Emergency task", "Pre-planned meeting"
- History (Oct 3): Empty (migrated)

#### Scenario C: No Advance Tasks
**Oct 3 (no advance tasks):**
- Today: Shows current tasks only
- History (Oct 3): Not checked/empty

## Key Features

### ✅ Automatic Detection
- Checks on app load
- Checks on day change (midnight)
- Checks on user activity

### ✅ Smart Merging
- Avoids duplicate tasks (by ID)
- Preserves both advance and current tasks
- Removes from history after migration

### ✅ Console Logging
```typescript
// When advance tasks found:
"Found 3 advance-planned tasks for today. Migrating..."

// When merging:
"Merging advance-planned tasks with current tasks..."

// On day change:
"Checking for advance-planned tasks for 2025-10-03..."
```

## User Experience

### Creating Tasks for Tomorrow:
1. Today is **October 2nd**
2. User opens History → "📅 Add Tasks"
3. Selects **October 3rd**
4. Adds tasks: "Team standup", "Code review", "Lunch with client"
5. Tasks saved to history under Oct 3rd

### Next Day (October 3rd):
1. User opens app at 8:00 AM
2. **Automatic migration happens:**
   - App detects it's Oct 3rd
   - Finds advance tasks in history
   - Moves them to Today view
   - Removes from history
3. User sees: "Team standup", "Code review", "Lunch with client"
4. User can check them off as completed

### Mid-Day Activity:
1. User closes app at 9:00 AM
2. At 12:00 PM (midnight), day changes to Oct 4th
3. User opens app at 8:00 AM on Oct 4th
4. **Day change detection triggers:**
   - Archives Oct 3rd tasks to history
   - Checks for Oct 4th advance tasks
   - Migrates if found
5. Fresh day starts with advance tasks (if any)

## Benefits

1. **Plan Ahead**: Create tasks for future dates
2. **Automatic**: No manual copying/moving needed
3. **Smart**: Handles duplicates and edge cases
4. **Efficient**: Only checks when necessary
5. **Transparent**: Console logs show what's happening

## Technical Details

### Storage Structure:

**Current Tasks** (TASKS_KEY):
```json
[
  { "id": "abc123", "title": "Today's task", "type": "signal", "date": "2025-10-03", "done": false }
]
```

**History** (HISTORY_KEY):
```json
{
  "2025-10-03": [
    { "id": "xyz789", "title": "Advance task", "type": "signal", "date": "2025-10-03", "done": false }
  ],
  "2025-10-05": [
    { "id": "def456", "title": "Future task", "type": "noise", "date": "2025-10-05", "done": false }
  ]
}
```

### After Migration (Oct 3rd):
**Current Tasks**:
```json
[
  { "id": "abc123", "title": "Today's task", "type": "signal", "date": "2025-10-03", "done": false },
  { "id": "xyz789", "title": "Advance task", "type": "signal", "date": "2025-10-03", "done": false }
]
```

**History**:
```json
{
  "2025-10-05": [
    { "id": "def456", "title": "Future task", "type": "noise", "date": "2025-10-05", "done": false }
  ]
}
```

## Edge Cases Handled

1. **No Advance Tasks**: Normal behavior, shows only current tasks
2. **Duplicate IDs**: Filters out duplicates during merge
3. **Empty Current Tasks**: Simply migrates advance tasks
4. **App Left Open Overnight**: Day change detection catches it
5. **Multiple Future Dates**: Only today's date is migrated

## Testing Scenarios

### Test 1: Basic Advance Task
1. Create task for tomorrow
2. Wait until tomorrow (or change system date)
3. Open app
4. Verify task appears in Today view

### Test 2: Merge with Current Tasks
1. Create task for tomorrow
2. Tomorrow arrives
3. Add a new task manually
4. Verify both tasks appear

### Test 3: No Advance Tasks
1. Don't create any advance tasks
2. Tomorrow arrives
3. Verify normal behavior (no errors)

### Test 4: Multiple Days Ahead
1. Create tasks for Oct 5th (today is Oct 2nd)
2. Oct 3rd arrives - verify Oct 5th tasks stay in history
3. Oct 4th arrives - verify Oct 5th tasks stay in history
4. Oct 5th arrives - verify Oct 5th tasks migrate

## Console Logs to Monitor

```
// Successful migration:
"Found 2 advance-planned tasks for today. Migrating..."

// Merge operation:
"Merging advance-planned tasks with current tasks..."

// Day change with advance check:
"New day detected! Archiving and resetting..."
"Checking for advance-planned tasks for 2025-10-03..."

// App resume from background:
"App resumed from background"
```
