# 🚀 Firebase + Capacitor Android App Setup Guide

## 📋 Prerequisites Checklist

- [ ] Firebase account (free tier is fine)
- [ ] Android Studio installed
- [ ] Node.js 18+ installed
- [ ] Java JDK 11+ installed

---

## Phase 1: Firebase Project Setup (10 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Project name: `ProdyJEE-App`
4. Disable Google Analytics (optional, can enable later)
5. Click "Create Project"

### Step 2: Add Web App to Firebase

1. In Firebase Console, click the **Web icon** (`</>`)
2. App nickname: `ProdyJEE Web`
3. ✅ Check "Also set up Firebase Hosting"
4. Click "Register app"
5. **Copy the firebaseConfig object** (you'll need this next)

### Step 3: Configure Firebase in Code

Open `lib/firebase.js` and replace the config:

```javascript
const firebaseConfig = {
  apiKey: "AIza...your-key-here",
  authDomain: "prodyjee-app.firebaseapp.com",
  projectId: "prodyjee-app",
  storageBucket: "prodyjee-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 4: Enable Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. **Start in test mode** (we'll secure it later)
4. Choose location: `us-central1` (or closest to your users)
5. Click "Enable"

### Step 5: Enable Authentication

1. Go to **Build > Authentication**
2. Click "Get started"
3. Enable these sign-in methods:
   - ✅ **Email/Password** (for account creation)
   - ✅ **Anonymous** (for quick start without account)

### Step 6: Set Firestore Security Rules

Go to **Firestore Database > Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Study plans: Users can only read/write their own data
    match /studyPlans/{planId} {
      allow read, write: if request.auth != null && 
                         request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

Click "Publish"

---

## Phase 2: Install Dependencies (5 minutes)

### Step 1: Install Firebase SDK

```bash
npm install firebase
```

### Step 2: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
# App name: ProdyJEE
# Package ID: com.prodyjee.app
```

### Step 3: Install Android Platform

```bash
npm install @capacitor/android
npx cap add android
```

### Step 4: Install Additional Plugins

```bash
npm install @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar
```

---

## Phase 3: Migrate Data from Prisma to Firestore (15 minutes)

### Step 1: Export Current Data

Run the existing export script:
```bash
node export-db-to-json.js
```

This creates `public/database-export.json`

### Step 2: Create Migration Script

Create `migrate-to-firestore.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');
const studyPlansData = require('./public/database-export.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrate() {
  const batch = db.batch();
  
  // Create a default user ID for migration
  const defaultUserId = 'migration-user-001';
  
  studyPlansData.forEach(plan => {
    const docRef = db.collection('studyPlans').doc(plan.unique_id);
    batch.set(docRef, {
      ...plan,
      userId: defaultUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });
  
  await batch.commit();
  console.log(`✅ Migrated ${studyPlansData.length} study plans to Firestore`);
}

migrate().catch(console.error);
```

### Step 3: Get Firebase Service Account Key

1. Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save as `firebase-service-account.json` (DON'T commit to git!)
4. Add to `.gitignore`:
   ```
   firebase-service-account.json
   ```

### Step 4: Run Migration

```bash
npm install firebase-admin
node migrate-to-firestore.js
```

---

## Phase 4: Update Application Code (Already Done! ✅)

Files created:
- ✅ `lib/firebase.js` - Firebase initialization with offline persistence
- ✅ `lib/firestore-service.js` - Data layer (replaces Prisma API calls)
- ✅ `lib/useAuth.js` - Authentication hook

**Next:** Update `pages/index.js` to use these new services

---

## Phase 5: Build Android App (20 minutes)

### Step 1: Update next.config.js for Mobile

```javascript
module.exports = {
  reactStrictMode: true,
  output: 'export',  // Re-enable for Capacitor
  images: {
    unoptimized: true  // Required for static export
  },
  trailingSlash: true  // Better for Capacitor
};
```

### Step 2: Build the App

```bash
npm run build
npx cap sync
```

### Step 3: Open Android Studio

```bash
npx cap open android
```

### Step 4: Configure Android App

In Android Studio:
1. Update `android/app/src/main/AndroidManifest.xml`:
   - Set app name
   - Set permissions (Internet, Network State)
2. Update `android/app/build.gradle`:
   - Set `minSdkVersion 22`
   - Set `targetSdkVersion 34`

### Step 5: Test in Emulator

1. In Android Studio, click "Run App" (green play button)
2. Select emulator or connected device
3. Wait for build and installation

---

## Phase 6: Google Play Store Submission (30 minutes)

### Step 1: Create App Bundle

In Android Studio:
```
Build > Generate Signed Bundle / APK > Android App Bundle
```

### Step 2: Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill in:
   - App name: ProdyJEE - JEE Study Planner
   - Category: Education
   - Description: (write compelling description)
   - Screenshots: Take from app (min 2, max 8)
   - Icon: 512x512 PNG

### Step 3: Upload Bundle

1. Go to **Release > Production**
2. Click "Create new release"
3. Upload your `.aab` file
4. Review and roll out

### Step 4: Wait for Review

- First review: 3-7 days
- Updates: 1-2 days

---

## 🎯 Current Status

✅ Firebase configuration files created
✅ Firestore service layer created
✅ Authentication hook created
⏳ Need to update pages/index.js to use Firebase
⏳ Need to install npm packages
⏳ Need to setup Capacitor
⏳ Need to test and build Android app

---

## 📞 Next Steps

Run these commands in order:

```bash
# 1. Install Firebase
npm install firebase

# 2. Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init

# 3. Add Android platform
npm install @capacitor/android
npx cap add android
```

Then I'll help you update the code to use Firebase instead of localStorage!
