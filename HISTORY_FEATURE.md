# History Feature - Documentation

## Overview
The History feature allows you to:
1. View all past days' Signal and Noise tasks
2. Add tasks to specific dates (past or future)
3. Edit and manage historical tasks
4. Track your progress over time

## How to Use

### Accessing History
From the main "Today" view, click the **📚 History** button in the top-right corner of the header.

### Viewing History

#### Date List View
- History shows all dates with tasks, sorted newest first
- Each date card displays:
  - Full formatted date (e.g., "Monday, October 1, 2025")
  - Summary count of Signal tasks (total and completed)
  - Summary count of Noise tasks (total and completed)
  - Expand/collapse arrow (▶/▼)

#### Expanding a Date
Click on any date card to expand and view:
- All Signal tasks for that date
- All Noise tasks for that date
- Ability to mark tasks as done/undone
- Delete individual tasks
- Delete entire day

### Adding Tasks to Specific Dates

#### Step 1: Open Date Picker
Click the **📅 Add Tasks to Date** button at the top of the History page.

#### Step 2: Select a Date
- A modal will appear with a date picker
- Select any date (past, present, or future)
- Click **Continue**

#### Step 3: Add Tasks
- The modal will show the selected date
- Add Signal tasks using the Signal input field
- Add Noise tasks using the Noise input field
- Press **Add** or hit **Enter** to add each task
- Add as many tasks as you want

#### Step 4: Finish
Click **✓ Done Adding Tasks** to close the modal and see your updated history.

### Managing Historical Tasks

#### Mark Task as Done
- Click the checkbox next to any task to toggle its completion status
- Works the same way as the Today view

#### Delete a Task
- Click the **×** button next to any task to delete it
- Confirmation is required

#### Delete an Entire Day
- Expand the date you want to delete
- Scroll to the bottom of that date's tasks
- Click **🗑️ Delete This Day**
- Confirmation is required
- This removes all Signal and Noise tasks for that date

### Navigation

#### Back to Today
Click the **← Back** button in the top-left of the History header to return to today's tasks.

## Features

### Automatic Archiving
When a new day begins:
- The app automatically archives yesterday's tasks to history
- Today's task list starts fresh
- Historical data is preserved forever (until manually deleted)

### Date-Based Organization
- Tasks are organized by their creation date
- You can view tasks from any day
- Each day's tasks are independent

### Color Coding
- **Signal tasks**: Red accent (🎯)
- **Noise tasks**: Green accent (📝)
- Same color scheme as the main view for consistency

### Completion Tracking
- See at a glance how many tasks were completed each day
- Visual indicators show done vs. total tasks
- Completed tasks appear with strikethrough text

## Use Cases

### Planning Future Days
1. Open History
2. Click "Add Tasks to Date"
3. Select a future date
4. Add Signal and Noise tasks for that day
5. When that day arrives, those tasks will be in your Today view

### Reviewing Past Performance
1. Open History
2. Browse through past dates
3. See what you accomplished
4. Review completed vs. incomplete tasks
5. Use insights to improve planning

### Correcting Missed Tasks
1. Open History
2. Find the date you want to update
3. Add forgotten tasks
4. Mark them as done if completed
5. Keep accurate records

### Reference Past Work
1. Open History
2. Expand any date
3. View what you worked on
4. Remember task details
5. Learn from past patterns

## Data Storage

### How It Works
- Current day's tasks stored in: `signalnoise_tasks`
- Historical tasks stored in: `signalnoise_history`
- Each date is a key with array of tasks as value
- All data stored locally using Capacitor Preferences
- No internet connection required
- Data persists across app restarts

### Data Structure
```json
{
  "2025-10-01": [
    {
      "id": "abc123",
      "title": "Complete project",
      "done": true,
      "type": "signal",
      "date": "2025-10-01"
    }
  ],
  "2025-09-30": [...]
}
```

## Tips & Best Practices

### Daily Review
- At the end of each day, review your History
- Mark any completed tasks you forgot to check
- Add any tasks you worked on but didn't track

### Weekly Planning
- Use History to plan next week
- Look at patterns in past weeks
- Add tasks to future dates based on your schedule

### Progress Tracking
- Review your History weekly or monthly
- Count completed Signal tasks
- Identify productive patterns
- Adjust your planning accordingly

### Data Cleanup
- Periodically review old dates
- Delete dates you no longer need
- Keep your history focused and relevant
- No performance issues with large history

## Keyboard Shortcuts

- **Enter**: Add task (when in input field)
- **Escape**: Close date picker modal (browser only)

## Mobile Optimization

### Touch Gestures
- Tap date card to expand/collapse
- Tap checkbox to toggle task
- Tap × to delete task
- Tap buttons for actions

### Responsive Design
- History adapts to screen size
- Date cards stack vertically on mobile
- Modal fills screen on small devices
- Easy to use with one hand

### Performance
- Lazy loading for history dates
- Smooth animations
- Fast task operations
- No lag with large datasets

## Troubleshooting

### History Not Showing
- Make sure you've used the app for at least one full day
- Check that automatic archiving happened (new day trigger)
- Try manually adding a task to a past date

### Tasks Not Saving
- Check browser console for errors
- Ensure Capacitor Preferences is working
- Try clearing cache and reloading

### Date Picker Issues
- Make sure date is selected before clicking Continue
- Check that date format is correct
- Try a different browser if issues persist

### Performance Issues
- Large history (100+ dates) may slow loading
- Consider deleting very old dates
- Contact support if issues persist

## Future Enhancements

Potential features for future versions:
- Export history to CSV/JSON
- Import tasks from files
- Search across all dates
- Filter by task type
- Statistics dashboard
- Calendar view
- Task templates
- Recurring tasks

---

**Need help?** See the main README.md or BUILD_AND_DEPLOY.md for more information.
