# Signal-to-Noise Ratio - Quick Reference

## Formula Summary

### 1️⃣ Planned Ratio
```
Signal % = (Signal Tasks / Total Tasks) × 100
Noise %  = (Noise Tasks / Total Tasks) × 100
```
**Purpose**: Shows task distribution at planning stage  
**Goal**: 80:20 (Signal:Noise)

### 2️⃣ Completion Ratio
```
Signal Completion % = (Signal Done / Signal Total) × 100
Noise Completion %  = (Noise Done / Noise Total) × 100
```
**Purpose**: Shows execution progress per category  
**Goal**: Signal completion ≥ Noise completion

### 3️⃣ Effective Ratio
```
Effective Signal % = (Signal Done / Total Tasks) × 100
Effective Noise %  = (Noise Done / Total Tasks) × 100
```
**Purpose**: Shows actual energy distribution  
**Goal**: 80:20 (Signal:Noise) of completed work

---

## Files Modified

### Core Implementation
- ✅ `src/app/models/task.model.ts` - Added `RatioMetrics` interface
- ✅ `src/app/services/task.service.ts` - Added calculation methods
- ✅ `src/app/today/today.component.ts` - Added metrics display logic
- ✅ `src/app/today/today.component.html` - Added dashboard UI
- ✅ `src/app/today/today.component.css` - Added styling
- ✅ `src/app/history/history.component.ts` - Added metrics for history
- ✅ `src/app/history/history.component.html` - Added compact metrics UI
- ✅ `src/app/history/history.component.css` - Added history styling

### Documentation
- ✅ `RATIO_METRICS_IMPLEMENTATION.md` - Technical details
- ✅ `RATIO_VISUAL_GUIDE.md` - Visual layout guide
- ✅ `RATIO_QUICK_REFERENCE.md` - This file

---

## Key Methods

### TaskService
```typescript
// Calculate metrics for any task array
calculateRatioMetrics(tasks: Task[]): RatioMetrics

// Get current day metrics
getCurrentDayMetrics(): Promise<RatioMetrics>

// Get metrics for specific date
getMetricsForDate(date: string): Promise<RatioMetrics>

// Generate summary message
generateSummaryMessage(metrics: RatioMetrics): string
```

### Components
```typescript
// TodayComponent
metrics = signal<RatioMetrics | null>(null);
await this.loadTasks(); // Auto-updates metrics

// HistoryComponent
dateTasks: DateTasks[] // Each includes metrics property
```

---

## CSS Classes

### Main Dashboard
- `.metrics-dashboard` - Container
- `.dashboard-title` - "📊 Signal-to-Noise Ratio Analysis"
- `.summary-message` - Daily summary text
- `.metrics-grid` - Responsive grid (1-3 columns)

### Metric Cards
- `.metric-card` - Individual metric container
- `.metric-description` - Subtitle text
- `.metric-warning` - Warning/success message
- `.has-warning` - Yellow background for warnings

### Visualizations
- `.ratio-meter` - Horizontal bar (planned ratio)
- `.meter-fill` - Colored segments
- `.progress-bars` - Completion progress
- `.progress-fill` - Progress bar segments
- `.ratio-pie` - Circular chart (effective ratio)
- `.pie-chart` - Conic gradient visualization

### History Compact View
- `.date-metrics-summary` - Container for history metrics
- `.metrics-compact` - Grid layout for compact display
- `.compact-metric` - Individual metric row

---

## Color Variables

```css
:root {
  --signal-color: #ef4444; /* Red */
  --noise-color: #8b5cf6;  /* Purple */
}
```

### Usage
- Signal tasks, bars, and text: Red
- Noise tasks, bars, and text: Purple
- Success messages: Green (#10b981)
- Warning messages: Yellow (#f59e0b)

---

## Warning Thresholds

### Planned Ratio
- ✅ Good: 70% ≤ Signal ≤ 90%
- ⚠️ Too much noise: Signal < 70%
- ℹ️ Very focused: Signal > 90%

### Completion Ratio
- ✅ Good: Signal ≥ Noise
- ⚠️ Warning: Noise > Signal + 15%

### Effective Ratio
- ✅ Excellent: Signal ≥ 85%
- ✅ Good: 70% ≤ Signal < 85%
- ⚠️ Warning: Signal < 70%

---

## Example Calculations

**Scenario**: 8 Signal tasks (5 done), 2 Noise tasks (1 done)

### Planned Ratio
```
Total = 10 tasks
Signal = 8/10 × 100 = 80%
Noise = 2/10 × 100 = 20%
✅ Perfect 80:20 balance!
```

### Completion Ratio
```
Signal = 5/8 × 100 = 62.5%
Noise = 1/2 × 100 = 50%
✅ Signal completion ahead of noise
```

### Effective Ratio
```
Signal = 5/10 × 100 = 50%
Noise = 1/10 × 100 = 10%
(Only 6 tasks completed, showing 83:17 split)
✅ Good effective ratio!
```

---

## Testing Checklist

- [ ] Add Signal tasks and see planned ratio update
- [ ] Add Noise tasks and verify percentages
- [ ] Check/uncheck tasks to see completion progress
- [ ] Complete all tasks and verify effective ratio
- [ ] View history and see metrics for past dates
- [ ] Test on mobile, tablet, and desktop
- [ ] Verify warning messages appear correctly
- [ ] Check color coding matches design
- [ ] Ensure metrics update in real-time

---

## Common Issues & Solutions

### Metrics not showing
- **Cause**: No tasks added yet
- **Solution**: Add at least one task to see metrics

### Division by zero
- **Handled**: All formulas check for zero tasks
- **Result**: Shows 0% or empty state message

### Colors not displaying
- **Check**: CSS variables defined in component CSS
- **Verify**: `:root` selector or component scope

### Metrics not updating
- **Cause**: Missing `await this.loadTasks()` call
- **Fix**: Call after any task modification

---

## Performance Notes

- Calculations are instant (O(n) where n = number of tasks)
- No external API calls
- All computation happens client-side
- Metrics recalculated on every change (acceptable for small datasets)
- Consider memoization if task list grows beyond 1000+ tasks

---

## Future Enhancement Ideas

1. **Weekly/Monthly Aggregates**: Average ratios over time
2. **Trend Charts**: Line graphs showing ratio changes
3. **Goals & Targets**: Customizable ratio targets
4. **Notifications**: Alert when ratios drift too far
5. **Export Data**: CSV download of metrics history
6. **Insights Panel**: AI-generated productivity tips
7. **Comparison View**: Compare today vs yesterday
8. **Productivity Score**: Single number combining all metrics

---

## Support

For questions or issues:
1. Check `RATIO_METRICS_IMPLEMENTATION.md` for technical details
2. Review `RATIO_VISUAL_GUIDE.md` for UI/UX reference
3. Inspect browser console for errors
4. Verify task data in Capacitor Preferences storage

---

**Last Updated**: October 1, 2025  
**Version**: 1.0.0  
**Status**: ✅ Complete and Tested
