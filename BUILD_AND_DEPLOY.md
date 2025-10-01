# SignalNoise App - Build & Deployment Guide

## Overview
SignalNoise is an offline-first task management app built with Angular 18 and Capacitor. It helps you organize your daily tasks into Signal (important) and Noise (less important) categories.

## Features
- ✅ Fully offline functionality
- 📱 Mobile-friendly responsive design
- 🎯 Signal tasks (most important)
- 📝 Noise tasks (less important)
- ✔️ Mark tasks as done with checkboxes
- 🔄 Automatic daily reset
- 💾 Local storage using Capacitor Preferences
- 📦 Android deployment ready

## Project Structure
```
src/
├── app/
│   ├── models/
│   │   └── task.model.ts          # Task interface and types
│   ├── services/
│   │   └── task.service.ts        # Task management with Capacitor storage
│   ├── app.component.ts           # Main component with Angular signals
│   ├── app.component.html         # UI template
│   └── app.component.css          # Styles
├── styles.css                      # Global styles
└── index.html
```

## Prerequisites
Before building the app, ensure you have:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Android Studio (for Android builds)
- Java JDK 17 (required by Android SDK)

## Installation & Setup

### 1. Install Dependencies
```powershell
npm install
```

### 2. Build the Angular App
Build the production version of your Angular app:
```powershell
npm run build
```

This creates the optimized app in `dist/signalnoise/browser/`

### 3. Sync Capacitor
Sync the web assets to the native Android project:
```powershell
npx cap sync android
```

## Running in Development

### Test in Browser (Web)
```powershell
npm start
```
Visit `http://localhost:4200` to test the app in your browser.

### Test on Android Device/Emulator
1. Build the Angular app:
```powershell
npm run build
```

2. Sync with Capacitor:
```powershell
npx cap sync android
```

3. Open in Android Studio:
```powershell
npx cap open android
```

4. In Android Studio:
   - Wait for Gradle sync to complete
   - Connect an Android device via USB (with USB debugging enabled) OR start an Android emulator
   - Click the "Run" button (green play icon)

## Building for Android Production

### Step 1: Build Optimized Angular App
```powershell
npm run build --configuration production
```

### Step 2: Sync to Android
```powershell
npx cap sync android
```

### Step 3: Open in Android Studio
```powershell
npx cap open android
```

### Step 4: Generate Signed APK/AAB
In Android Studio:

1. **Build** → **Generate Signed Bundle / APK**
2. Choose **Android App Bundle (AAB)** for Play Store or **APK** for direct installation
3. Create a new keystore (first time) or select existing one:
   - Key store path: Choose a secure location
   - Password: Create a strong password
   - Key alias: `signalnoise`
   - Key password: Create a strong password
   - Validity: 25 years (minimum)
   - Certificate info: Fill in your details

4. Select build variant: **release**
5. Click **Finish**

The signed APK/AAB will be in:
- APK: `android/app/release/app-release.apk`
- AAB: `android/app/release/app-release.aab`

### Step 5: Install APK on Device
```powershell
# Install via adb
adb install android/app/release/app-release.apk
```

Or transfer the APK to your device and install manually.

## Configuration Files

### capacitor.config.ts
The Capacitor configuration file (automatically created):
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.signalnoise.app',
  appName: 'signalnoise',
  webDir: 'dist/signalnoise/browser'
};

export default config;
```

### android/app/build.gradle
You may want to update the version code and name:
```gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0"
    }
}
```

## Key Features Explained

### Offline Storage
The app uses **Capacitor Preferences** for persistent offline storage:
- All tasks are stored locally on the device
- No internet connection required
- Data persists between app sessions

### Automatic Daily Reset
The `TaskService` automatically checks the date:
- Stores the last access date
- Compares with current date on app launch
- Clears all tasks if it's a new day
- Allows users to start fresh each morning

### Angular Signals
The app leverages Angular 18's signals for reactive state management:
- `signalTasks` - Array of Signal tasks
- `noiseTasks` - Array of Noise tasks
- Automatic UI updates when tasks change

## Troubleshooting

### Build Issues

**Problem**: "dist/signalnoise/browser directory not found"
```powershell
# Solution: Build the Angular app first
npm run build
npx cap sync android
```

**Problem**: Gradle sync failed
```powershell
# Solution: Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Android Studio Issues

**Problem**: SDK not found
- Open Android Studio → Tools → SDK Manager
- Install Android SDK Platform 33+ (API Level 33)
- Install Android SDK Build-Tools

**Problem**: Java version mismatch
- Ensure Java JDK 17 is installed
- Set JAVA_HOME environment variable

### Device Issues

**Problem**: App not installing
- Enable "Install from Unknown Sources" on Android device
- Check if USB debugging is enabled
- Try: `adb devices` to verify device connection

## Publishing to Google Play Store

1. Build a signed AAB (Android App Bundle):
   - Follow Step 4 above, choosing AAB

2. Create a Google Play Developer account ($25 one-time fee)

3. Create a new app in Play Console:
   - Upload the AAB
   - Fill in store listing (description, screenshots, icon)
   - Complete content rating questionnaire
   - Set pricing (free or paid)

4. Submit for review

## Updating the App

When making changes:

1. Edit your Angular code
2. Test locally: `npm start`
3. Build: `npm run build`
4. Sync: `npx cap sync android`
5. Test on Android device
6. Increment version in `android/app/build.gradle`
7. Generate new signed APK/AAB
8. Deploy

## Environment Variables

For different environments (dev, staging, prod), you can use Angular environments:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  appName: 'SignalNoise Dev'
};
```

## Testing

Run unit tests:
```powershell
npm test
```

Run end-to-end tests:
```powershell
npm run e2e
```

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Preferences API](https://capacitorjs.com/docs/apis/preferences)
- [Android Studio Guide](https://developer.android.com/studio/intro)

## Support & Contribution

For issues or suggestions:
1. Check existing issues
2. Create a new issue with detailed description
3. Include error logs and screenshots

## License

[Specify your license here]

---

**Happy Task Managing! 🎯📝**
