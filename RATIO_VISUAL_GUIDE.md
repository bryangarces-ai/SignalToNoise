# Signal-to-Noise Ratio - Visual Guide

## Dashboard Layout

### Today View

```
┌─────────────────────────────────────────────────────────────┐
│                      SignalNoise                            │
│                  Daily Task Organizer          📚 History   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           📊 Signal-to-Noise Ratio Analysis                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  💡 You planned 60:40, but executed 50:50.                 │
│     Try shifting focus to Signal tasks tomorrow.            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 📋 Planned   │  │ ✅ Completion│  │ ⚡ Effective  │     │
│  │   Ratio      │  │   Progress   │  │  Productivity │     │
│  │              │  │              │  │   Ratio       │     │
│  │ ████████░░░░ │  │ Signal: 50% │  │   ┌────┐     │     │
│  │ 60% : 40%    │  │ ███████░░░░ │  │   │50:│     │     │
│  │              │  │              │  │   │ 50│     │     │
│  │ 🎯 6 Signal  │  │ Noise: 75%  │  │   └────┘     │     │
│  │ 📝 4 Noise   │  │ ███████████░│  │              │     │
│  │              │  │              │  │ 🎯 3/10     │     │
│  │ ⚠️ Planned   │  │ ⚠️ More noise│  │ 📝 3/10     │     │
│  │    too much  │  │    than signal│ │              │     │
│  │    noise     │  │              │  │ ⚠️ Split not │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🎯 Signal                                      3 / 6        │
├─────────────────────────────────────────────────────────────┤
│  Most important tasks today                                  │
│                                                              │
│  [Add Signal task...              ] [Add]                   │
│                                                              │
│  ☑ Complete project report                           ×      │
│  ☑ Client meeting preparation                        ×      │
│  ☑ Review budget proposal                            ×      │
│  ☐ Update marketing strategy                         ×      │
│  ☐ Team performance reviews                          ×      │
│  ☐ Strategic planning document                       ×      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📝 Noise                                       3 / 4        │
├─────────────────────────────────────────────────────────────┤
│  Less important tasks                                        │
│                                                              │
│  [Add Noise task...               ] [Add]                   │
│                                                              │
│  ☑ Check emails                                      ×      │
│  ☑ Update calendar                                   ×      │
│  ☑ Order office supplies                             ×      │
│  ☐ Organize desk                                     ×      │
└─────────────────────────────────────────────────────────────┘
```

### History View

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back        Task History         📅 Add Tasks to Date    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Wednesday, October 1, 2025                              ▼  │
│  🎯 6 Signal (3 done)  📝 4 Noise (3 done)                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 Productivity Summary                                    │
│  💡 You planned 60:40, but executed 50:50.                 │
│     Try shifting focus to Signal tasks tomorrow.            │
│                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ Planned:     │ │ Executed:    │ │ Completion:  │       │
│  │ 60% : 40%    │ │ 50% : 50%    │ │ 🎯 50%      │       │
│  └──────────────┘ └──────────────┘ │ 📝 75%      │       │
│                                     └──────────────┘       │
│                                                              │
│  🎯 Signal Tasks                                            │
│  ☑ Complete project report                           ×      │
│  ☑ Client meeting preparation                        ×      │
│  ☑ Review budget proposal                            ×      │
│  ☐ Update marketing strategy                         ×      │
│  ☐ Team performance reviews                          ×      │
│  ☐ Strategic planning document                       ×      │
│                                                              │
│  📝 Noise Tasks                                             │
│  ☑ Check emails                                      ×      │
│  ☑ Update calendar                                   ×      │
│  ☑ Order office supplies                             ×      │
│  ☐ Organize desk                                     ×      │
│                                                              │
│                    🗑️ Delete This Day                       │
└─────────────────────────────────────────────────────────────┘
```

## Color Coding

- **Signal Color**: 🔴 Red (#ef4444)
  - Represents important, high-impact tasks
  - Should dominate your daily work (target: 80%)

- **Noise Color**: 🟣 Purple (#8b5cf6)
  - Represents less important, routine tasks
  - Should be minimized (target: 20%)

## Warning Messages

### ✅ Success Messages (Green background)
- "✅ Good balance (75:25). Close to 80:20 goal."
- "✅ Good focus! Signal completion ahead of noise."
- "✅ Excellent! Effective ratio is 82:18."
- "🎉 Excellent work! You planned 80:20 and executed 78:22."

### ⚠️ Warning Messages (Yellow background)
- "⚠️ Planned too much noise (55:45). Goal is 80:20."
- "⚠️ Completing more noise (75%) than signal (45%)."
- "⚠️ Actual work split was 50:50, not 80:20."
- "💡 You planned 60:40, but executed 50:50. Try shifting focus..."

### ℹ️ Info Messages (Blue background)
- "ℹ️ Very signal-focused (92:8). Some noise tasks are normal."

## Metric Formulas Display

Each metric card shows:

1. **Icon and Title** (e.g., 📋 Planned Ratio)
2. **Description** (e.g., "Task distribution at start of day")
3. **Visual Representation**:
   - Bar chart for planned ratio
   - Progress bars for completion
   - Pie chart for effective ratio
4. **Numerical Values** (e.g., "60% : 40%")
5. **Raw Counts** (e.g., "🎯 6 Signal, 📝 4 Noise")
6. **Warning/Success Message**

## Responsive Behavior

### Mobile (< 768px)
- Metrics stack vertically (1 column)
- Compact summary in history
- Touch-friendly buttons and controls

### Tablet (768px - 1024px)
- Metrics in 2-column grid
- Side-by-side metric display

### Desktop (> 1024px)
- Metrics in 3-column grid
- Full dashboard layout
- Maximum visibility of all metrics

## Interactive Features

1. **Real-time Updates**: Metrics recalculate instantly when:
   - Adding a new task
   - Checking/unchecking a task
   - Deleting a task

2. **Visual Feedback**:
   - Hover effects on cards
   - Smooth transitions for percentage changes
   - Color changes based on warnings

3. **Expandable History**:
   - Click date header to expand/collapse
   - Metrics only shown when expanded
   - Compact summary visible when collapsed

## Key Insights at a Glance

The dashboard answers:
1. ❓ "Is my plan balanced?" → Planned Ratio
2. ❓ "Am I completing what I planned?" → Completion Progress
3. ❓ "Where is my energy actually going?" → Effective Ratio
4. ❓ "How did I do?" → Summary Message
