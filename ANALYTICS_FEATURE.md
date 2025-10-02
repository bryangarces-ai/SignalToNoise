# Analytics Dashboard Feature

## Overview
The Analytics Dashboard provides comprehensive visualization and insights into your productivity metrics, helping you understand your task planning and completion patterns over time.

## Features

### 📊 Interactive Charts
1. **Planned Ratio Chart** (Stacked Bar Chart)
   - Shows how you planned your tasks (Signal vs Noise percentage)
   - Goal indicator: 80% Signal, 20% Noise
   - Visualizes planning consistency over time

2. **Completion Progress Chart** (Line Chart)
   - Tracks completion percentage for Signal and Noise tasks
   - Shows trends in task completion
   - Helps identify execution patterns

3. **Productivity Ratio Chart** (Doughnut Chart)
   - Displays average productivity distribution
   - Shows completed Signal, completed Noise, and incomplete tasks
   - Provides at-a-glance productivity overview

### 📅 Time Filters
- **Daily**: Last 7 days of data
- **Weekly**: Last 4 weeks (28 days) of data
- **Monthly**: Last 3 months (90 days) of data

### 📈 Summary Statistics
- Average Planned Signal percentage
- Average Signal Completion percentage
- Average Productivity percentage
- Total tasks and completed tasks count

### 💡 AI-Powered Insights
The dashboard provides intelligent recommendations based on your metrics:

1. **Planning Quality**
   - ✅ Success: 75%+ Signal tasks planned
   - ⚠️ Warning: 60-75% Signal tasks planned
   - 🚨 Danger: < 60% Signal tasks planned

2. **Execution Focus**
   - ✅ Success: 70%+ Signal completion rate
   - ⚠️ Warning: 50-70% Signal completion rate
   - 🚨 Danger: < 50% Signal completion rate

3. **Overall Productivity**
   - ✅ Success: 70%+ total task completion
   - ⚠️ Warning: 50-70% total task completion
   - 🚨 Danger: < 50% total task completion

## Navigation
- Access from **Today** page: Click "📊 Analytics" button in header
- Access from **History** page: Click "📊 Analytics" button in header
- Return to main app: Click "← Back to Today" in Analytics header

## Usage Tips

1. **Regular Review**: Check analytics weekly to identify patterns
2. **Adjust Planning**: Use insights to improve task planning
3. **Track Progress**: Monitor completion trends over time
4. **Set Goals**: Aim for 80:20 Signal-to-Noise ratio
5. **Identify Blockers**: Look for drops in completion rates

## Technical Details

### Technologies Used
- **Chart.js**: Open-source charting library
- **Angular Signals**: Reactive state management
- **Capacitor Preferences**: Data persistence
- **Responsive Design**: Mobile-first approach

### Data Sources
- Real-time metrics from current day's tasks
- Historical data from previous days
- Aggregated calculations for trends

### Performance
- Lazy loading for optimal performance
- Efficient data aggregation
- Smooth chart animations
- Responsive to screen sizes

## Color Coding
- 🟢 **Green**: Signal tasks (important work)
- 🔴 **Red**: Noise tasks (maintenance work)
- ⚪ **Gray**: Incomplete tasks

## Metrics Explained

### Planned Ratio
- **Formula**: (Signal Tasks / Total Tasks) × 100
- **Purpose**: Shows how you plan your day
- **Goal**: 80% Signal, 20% Noise

### Completion Progress
- **Formula**: (Completed Tasks / Total Tasks of Type) × 100
- **Purpose**: Tracks execution effectiveness
- **Goal**: High completion for Signal tasks

### Productivity Ratio
- **Formula**: (Completed Tasks / All Tasks) × 100
- **Purpose**: Measures overall productivity
- **Goal**: Balanced completion with Signal priority

## Future Enhancements (Potential)
- Export data to CSV/PDF
- Custom date range selection
- Goal setting and tracking
- Comparative analysis (week-over-week)
- Predictive analytics
- Team/group analytics
- Integration with calendar apps

## Support
For issues or feature requests, refer to the main README.md file.
