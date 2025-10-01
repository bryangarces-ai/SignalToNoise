# Signal-to-Noise Ratio Metrics Implementation

## Overview
This document describes the implementation of the Signal-to-Noise Ratio computation system in the SignalNoise app. The system provides comprehensive productivity analytics based on three key metrics.

## Mathematical Formulas Implemented

### 1. Planned Ratio (Task Distribution)
Calculated when tasks are added to show how balanced your task list is:

- **Planned Signal %** = (S_total / T) × 100
- **Planned Noise %** = (N_total / T) × 100

Where:
- S_total = Total Signal tasks added
- N_total = Total Noise tasks added
- T = S_total + N_total (Total tasks)

**Goal**: Should be close to 80:20 (Signal:Noise)

**Warnings**:
- ⚠️ If Signal < 70%: "Planned too much noise"
- ℹ️ If Signal > 90%: "Very signal-focused"
- ✅ If 70% ≤ Signal ≤ 90%: "Good balance"

### 2. Completion Ratio (Task Execution)
Shows how well you're finishing what you planned:

- **Completion Signal %** = (S_done / S_total) × 100
- **Completion Noise %** = (N_done / N_total) × 100

Where:
- S_done = Signal tasks completed
- N_done = Noise tasks completed

**Warnings**:
- ⚠️ If Noise completion > Signal completion + 15%: "Completing more noise than signal"
- ✅ If Signal completion ≥ Noise completion: "Good focus!"

### 3. Effective Productivity Ratio (Actual Energy Distribution)
Shows how your actual daily energy was spent (completed tasks only):

- **Effective Signal %** = (S_done / T) × 100
- **Effective Noise %** = (N_done / T) × 100

**Goal**: Effective Signal ≈ 80%, Effective Noise ≈ 20%

**Warnings**:
- ⚠️ If actual Signal < 70%: "Actual work split not 80:20"
- ✅ If 70% ≤ Signal < 85%: "Good effective ratio"
- ✅ If Signal ≥ 85%: "Excellent!"

## Implementation Details

### 1. Data Model (`task.model.ts`)

Added `RatioMetrics` interface containing:
- Raw counts (signalTotal, noiseTotal, signalDone, noiseDone)
- Calculated percentages for all three ratio types
- Warning messages and recommendations
- Daily summary message

### 2. Service Layer (`task.service.ts`)

Added methods:
- `calculateRatioMetrics(tasks: Task[]): RatioMetrics` - Core calculation logic
- `generateSummaryMessage(metrics: RatioMetrics): string` - Generates contextual messages
- `getCurrentDayMetrics(): Promise<RatioMetrics>` - Gets metrics for today
- `getMetricsForDate(date: string): Promise<RatioMetrics>` - Gets metrics for any date

### 3. Today Component (`today.component.ts/html`)

**Features**:
- Real-time metrics dashboard at the top of the page
- Updates automatically when tasks are added, completed, or deleted
- Three visualization cards:
  1. **Planned Ratio Meter** - Horizontal bar showing Signal:Noise distribution
  2. **Completion Progress Bars** - Individual progress for Signal and Noise tasks
  3. **Effective Ratio Pie Chart** - Visual representation of actual productivity

**Visual Elements**:
- Color-coded bars (Signal: red, Noise: purple)
- Percentage labels on all visualizations
- Warning/success messages with emojis
- Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)

### 4. History Component (`history.component.ts/html`)

**Features**:
- Compact metrics summary for each historical date
- Shows when date card is expanded
- Displays:
  - Summary message
  - Planned ratio
  - Executed ratio (actual Signal:Noise split of completed tasks)
  - Completion percentages

**Visual Elements**:
- Compact metric cards with color-coded values
- Grid layout for metrics
- Consistent styling with main dashboard

### 5. Styling (`*.component.css`)

**Design System**:
- CSS custom properties for colors:
  - `--signal-color: #ef4444` (red)
  - `--noise-color: #8b5cf6` (purple)
- Gradient backgrounds for visual appeal
- Box shadows and hover effects
- Smooth transitions and animations
- Fully responsive (mobile-first approach)

**Components**:
- `.metrics-dashboard` - Main container
- `.metric-card` - Individual metric sections
- `.ratio-meter` - Horizontal bar visualization
- `.progress-bars` - Task completion indicators
- `.ratio-pie` - Circular chart for effective ratio
- `.metric-warning` - Color-coded message boxes

## Example Usage

### Scenario: October 1, 2025
**Input**:
- S_total = 6 Signal tasks
- N_total = 4 Noise tasks
- S_done = 3 Signal tasks completed
- N_done = 3 Noise tasks completed

**Output**:
1. **Planned Ratio**: 60:40
   - ⚠️ Warning: "Planned too much noise (60:40). Goal is 80:20."

2. **Completion Ratio**:
   - Signal: 50% (3/6)
   - Noise: 75% (3/4)
   - ⚠️ Warning: "Completing more noise than signal"

3. **Effective Ratio**: 30:30 (or 50:50 of completed work)
   - ⚠️ Warning: "Actual work split was 50:50, not 80:20"

4. **Summary Message**:
   - "💡 You planned 60:40, but executed 50:50. Try shifting focus to Signal tasks tomorrow."

## User Benefits

1. **Planning Awareness**: See if your daily plan is balanced before starting work
2. **Execution Tracking**: Monitor which tasks you're actually completing
3. **Productivity Insights**: Understand where your energy goes throughout the day
4. **Behavioral Nudges**: Receive warnings and recommendations to improve focus
5. **Historical Analysis**: Review past days to identify patterns and trends

## Technical Notes

- All calculations handle edge cases (zero tasks, division by zero)
- Metrics update automatically on any task change
- Percentages rounded to nearest integer for display
- Color-coded warnings (yellow for warnings, green for success)
- Fully integrated with existing task management system
- No external dependencies beyond Angular core

## Future Enhancements (Potential)

- Weekly/monthly aggregate metrics
- Trend graphs and charts
- Comparison with previous days
- Customizable ratio goals (not just 80:20)
- Export metrics data
- Notification reminders based on metrics
