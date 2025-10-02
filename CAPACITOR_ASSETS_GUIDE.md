# Capacitor Assets Generation Guide

This document explains how to generate app icons and splash screens for your Signal Noise Android application using Capacitor Assets.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)
- [Generating Assets](#generating-assets)
- [Asset Requirements](#asset-requirements)
- [Folder Structure](#folder-structure)
- [Troubleshooting](#troubleshooting)
- [Manual Alternative](#manual-alternative)

## Prerequisites

- Node.js and npm installed
- Capacitor project initialized
- Android platform added to your project

## Installation

Install the Capacitor Assets package as a dev dependency:

```bash
npm install @capacitor/assets --save-dev
```

## Setup

### 1. Create Assets Folder

Create an `assets` folder in the root of your project:

```bash
mkdir assets
```

### 2. Prepare Your Assets

You need two main images:

#### **Icon (Required)**
- **Filename**: `icon.png` or `icon-only.png`
- **Location**: `assets/icon.png`
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Purpose**: App icon shown on device home screen

#### **Splash Screen (Optional)**
- **Filename**: `splash.png` or `splash-dark.png`
- **Location**: `assets/splash.png`
- **Size**: 2732x2732 pixels (minimum)
- **Format**: PNG
- **Purpose**: Shown when app is launching

### 3. Icon Design Guidelines

**DO:**
- ✅ Use simple, recognizable design
- ✅ Use high contrast colors
- ✅ Ensure icon looks good at small sizes (48x48px)
- ✅ Use transparent background if possible
- ✅ Keep design centered within the 1024x1024 canvas
- ✅ Test on different background colors

**DON'T:**
- ❌ Use text that's too small
- ❌ Include padding (Capacitor handles this)
- ❌ Use complex gradients that don't scale well
- ❌ Use copyrighted images

## Generating Assets

### Basic Generation

Generate all assets for all platforms:

```bash
npx capacitor-assets generate
```

### Platform-Specific Generation

Generate assets only for Android:

```bash
npx capacitor-assets generate --android
```

### With Custom Path

If your assets are in a different location:

```bash
npx capacitor-assets generate --assetPath ./my-assets
```

### Verbose Output

See detailed generation information:

```bash
npx capacitor-assets generate --verbose
```

## Asset Requirements

### Minimum Files Needed

```
assets/
├── icon.png          # 1024x1024px (Required)
└── splash.png        # 2732x2732px (Optional)
```

### Optional Additional Files

```
assets/
├── icon.png              # Light mode icon
├── icon-only.png         # Icon without background
├── icon-foreground.png   # Adaptive icon foreground
├── icon-background.png   # Adaptive icon background
├── splash.png            # Light mode splash
├── splash-dark.png       # Dark mode splash
└── logo.png              # Logo for splash screen
```

## Folder Structure

After running `npx capacitor-assets generate`, your project structure will look like:

```
signalnoise/
├── assets/
│   ├── icon.png                    # Your source icon
│   └── splash.png                  # Your source splash (optional)
├── android/
│   └── app/
│       └── src/
│           └── main/
│               └── res/
│                   ├── mipmap-mdpi/
│                   │   └── ic_launcher.png       # 48x48
│                   ├── mipmap-hdpi/
│                   │   └── ic_launcher.png       # 72x72
│                   ├── mipmap-xhdpi/
│                   │   └── ic_launcher.png       # 96x96
│                   ├── mipmap-xxhdpi/
│                   │   └── ic_launcher.png       # 144x144
│                   ├── mipmap-xxxhdpi/
│                   │   └── ic_launcher.png       # 192x192
│                   └── drawable/
│                       └── splash.png
└── capacitor.config.ts
```

## Complete Workflow

### Step-by-Step Process

1. **Create your icon:**
   ```bash
   # Place your 1024x1024 icon at assets/icon.png
   ```

2. **Generate assets:**
   ```bash
   npx capacitor-assets generate --android
   ```

3. **Sync with Capacitor:**
   ```bash
   npx cap sync android
   ```

4. **Build your Angular app:**
   ```bash
   ng build --configuration production
   ```

5. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

6. **Build APK/AAB in Android Studio**

## Troubleshooting

### Issue: "No source image found"

**Solution:**
- Ensure `assets/icon.png` exists
- Check file is actually PNG format (not renamed JPG)
- Verify file path is correct
- Try absolute path: `npx capacitor-assets generate --assetPath "D:\REPOSITORIES\ANGULAR\signalnoise\assets"`

### Issue: "Permission denied" or "Cannot copy"

**Solution:**
```bash
# Run as administrator or check file permissions
# Close Android Studio before generating
npx cap sync android --force
```

### Issue: Icon not updating in app

**Solution:**
```bash
# Clean and rebuild
npx cap sync android
# In Android Studio: Build > Clean Project
# Then: Build > Rebuild Project
```

### Issue: Icons appear pixelated

**Solution:**
- Ensure source icon is exactly 1024x1024
- Use PNG format with high quality
- Don't use JPG compressed images
- Recreate icon at higher resolution

## Manual Alternative

If automated generation fails, manually create icons:

### Using Online Tools

1. **App Icon Generator**: https://appicon.co/
2. **Easyappicon**: https://easyappicon.com/
3. **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/

Upload your 1024x1024 icon and download the generated assets.

### Manual Placement

Place icons in these locations:

- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

## Package.json Scripts

Add these helpful scripts to your `package.json`:

```json
{
  "scripts": {
    "assets:generate": "capacitor-assets generate --android",
    "assets:generate:all": "capacitor-assets generate",
    "android:build": "ng build --configuration production && npx cap sync android",
    "android:open": "npx cap open android",
    "android:sync": "npx cap sync android"
  }
}
```

Usage:
```bash
npm run assets:generate
npm run android:build
npm run android:open
```

## Capacitor Configuration

Ensure your `capacitor.config.ts` is properly configured:

```typescript
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.signalnoise',
  appName: 'Signal Noise',
  webDir: 'dist/signalnoise/browser',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2563eb",
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
```

## Quick Reference Commands

```bash
# Install
npm install @capacitor/assets --save-dev

# Generate assets
npx capacitor-assets generate --android

# Sync changes
npx cap sync android

# Open in Android Studio
npx cap open android

# Full rebuild
ng build --production && npx cap sync android && npx cap open android
```

## Additional Resources

- **Capacitor Assets Docs**: https://github.com/ionic-team/capacitor-assets
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Icon Guidelines**: https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher
- **Material Design Icons**: https://m3.material.io/styles/icons/overview

## Tips for Best Results

1. **Design at 1024x1024**: Always start with the highest resolution
2. **Test on Real Device**: Icons may look different on actual devices
3. **Use Simple Designs**: Complex designs don't scale well to small sizes
4. **Consider Safe Zone**: Keep important elements in the center 80% of the canvas
5. **Test Both Themes**: Check how your icon looks on light and dark backgrounds
6. **Version Control**: Keep your source assets in version control
7. **Document Colors**: Note your brand colors in this file for consistency

## Your App's Branding

### Signal Noise App Colors

- **Primary Blue**: `#2563eb`
- **Dark Blue**: `#1e40af`
- **Light Gray**: `#f1f5f9`
- **Border**: `#e2e8f0`
- **Success Green**: `#22c55e`
- **Danger Red**: `#ef4444`

### Icon Concept

The Signal Noise app uses a clipboard emoji (📋) as its primary icon concept, representing task organization and daily planning.

### Current Icon Location

Your current icon files are located at:
- Source: `assets/icon.png` (1024x1024)
- Splash: `assets/splash.png` (2732x2732)

## Build Process Summary

### Development Build

```bash
# 1. Build Angular app
ng build

# 2. Sync with Capacitor
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. Run on device/emulator from Android Studio
```

### Production Build

```bash
# 1. Build Angular app for production
ng build --configuration production

# 2. Generate/update assets
npx capacitor-assets generate --android

# 3. Sync with Capacitor
npx cap sync android

# 4. Open in Android Studio
npx cap open android

# 5. Generate signed APK/AAB from Android Studio
# Build > Generate Signed Bundle/APK
```

---

**Last Updated**: October 2, 2025  
**Capacitor Version**: Latest  
**Project**: Signal Noise - Daily Task Organizer  
**Platform**: Android
