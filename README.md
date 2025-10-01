# SignalNoise 🎯📝

An offline-first daily task management app built with **Angular 18** and **Capacitor**. Organize your tasks into **Signal** (most important) and **Noise** (less important) categories, and start fresh every new day.

![Angular](https://img.shields.io/badge/Angular-18-red)
![Capacitor](https://img.shields.io/badge/Capacitor-6-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Offline First](https://img.shields.io/badge/Offline-First-green)

## ✨ Features

- 🎯 **Signal Tasks** - Track your most important daily tasks
- 📝 **Noise Tasks** - Manage less urgent tasks separately
- ✅ **Simple Checkboxes** - Mark tasks as complete with a tap
- 💾 **Offline Storage** - All data stored locally using Capacitor Preferences
- 🔄 **Daily Reset** - Automatically archives and clears tasks each new day
- 📚 **History View** - Access all past days' tasks, view and edit historical data
- 📅 **Date-Specific Tasks** - Add tasks to any date (past, present, or future)
- 📱 **Mobile-First Design** - Clean, responsive UI optimized for mobile devices
- 🚀 **Fast & Lightweight** - No backend required, fully self-contained
- 📦 **Android Ready** - Package and deploy to Android devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI 18+
- Android Studio (for Android builds)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd signalnoise

# Install dependencies
npm install

# Run development server
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## 📱 Build for Android

### Quick Build
```bash
# Build the Angular app
npm run build

# Sync with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android
```

Then click **Run** in Android Studio to deploy to your device/emulator.

### Detailed Instructions
See [BUILD_AND_DEPLOY.md](BUILD_AND_DEPLOY.md) for complete build and deployment instructions.

## 🏗️ Project Structure

```
src/app/
├── models/
│   └── task.model.ts          # Task interface (Signal/Noise types)
├── services/
│   └── task.service.ts        # Task management & offline storage with history
├── today/
│   ├── today.component.ts     # Today's tasks view
│   ├── today.component.html   # Today UI template
│   └── today.component.css    # Today styles
├── history/
│   ├── history.component.ts   # History view with date picker
│   ├── history.component.html # History UI template
│   └── history.component.css  # History styles
├── app.component.ts           # Root component with routing
├── app.component.html         # Router outlet
└── app.routes.ts              # Route configuration
```

## 🎨 Technology Stack

- **Frontend**: Angular 18 (Standalone Components, Signals)
- **Storage**: Capacitor Preferences API (offline-first)
- **Mobile**: Capacitor 6
- **Platform**: Android (extensible to iOS)
- **Styling**: Pure CSS (no dependencies)

## 💡 How It Works

### Task Types
- **Signal**: Important tasks you must accomplish today
- **Noise**: Less important tasks that are nice to complete

### Daily Reset
The app automatically detects when a new day begins and archives yesterday's tasks to history, then clears today's view for a fresh start every morning.

### History Feature
- **View Past Tasks**: Browse all historical dates and their tasks
- **Add to Dates**: Create tasks for any specific date (past or future)
- **Track Progress**: See completion statistics for each day
- **Manage History**: Edit, delete, or review tasks from any date
- See [HISTORY_FEATURE.md](HISTORY_FEATURE.md) for complete documentation

### Offline-First
All tasks are stored locally on your device using Capacitor Preferences:
- No internet required
- No backend server needed
- Data persists between app sessions
- Privacy-focused (data never leaves your device)

## 🛠️ Development

```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Watch mode
npm run watch
```

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build production app |
| `npm test` | Run unit tests |
| `npx cap sync` | Sync web assets to native platforms |
| `npx cap open android` | Open project in Android Studio |

## 🔧 Configuration

### Capacitor Config
Edit `capacitor.config.ts` to customize:
- App ID: `com.signalnoise.app`
- App Name: `signalnoise`
- Web Directory: `dist/signalnoise/browser`

### Angular Config
Standard Angular 18 configuration in:
- `angular.json` - Build configuration
- `tsconfig.json` - TypeScript settings

## 📸 Screenshots

[Add screenshots of your app here]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[Specify your license]

## 🙏 Acknowledgments

- Built with [Angular](https://angular.io)
- Powered by [Capacitor](https://capacitorjs.com)
- Inspired by the need for simple, focused task management

## 📞 Support

For detailed deployment instructions, see [BUILD_AND_DEPLOY.md](BUILD_AND_DEPLOY.md)

---

**Built with ❤️ using Angular 18 and Capacitor**
