# Firebase Setup Guide for Rating & Review System

## 🚀 Quick Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `book-publisher-ratings`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (`</>`)
4. Enter app nickname: `book-publisher-web`
5. Click "Register app"
6. Copy the configuration object

### 4. Update Configuration
Replace the placeholder values in `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-actual-sender-id",
    appId: "your-actual-app-id"
};
```

### 5. Set Up Security Rules (Important!)
In Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to ratings and reviews
    match /ratings/{document} {
      allow read: if true;
      allow write: if true; // For development - restrict in production
    }
    match /reviews/{document} {
      allow read: if true;
      allow write: if true; // For development - restrict in production
    }
  }
}
```

### 6. Test the System
1. Open your website
2. Try rating a story
3. Try writing a review
4. Check Firebase Console → Firestore to see data

## 📊 Database Structure

### Ratings Collection
```json
{
  "storyId": "saraswati",
  "userId": "user_1234567890_abc123",
  "rating": 5,
  "timestamp": "2024-01-15T10:30:00Z",
  "userAgent": "Mozilla/5.0..."
}
```

### Reviews Collection
```json
{
  "storyId": "saraswati",
  "userName": "John Doe",
  "reviewText": "Amazing story! Loved the mystery elements.",
  "timestamp": "2024-01-15T10:30:00Z",
  "userAgent": "Mozilla/5.0..."
}
```

## 🔒 Production Security (Optional)

For production, update Firestore rules to be more secure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ratings/{document} {
      allow read: if true;
      allow write: if request.time < timestamp.date(2024, 12, 31);
    }
    match /reviews/{document} {
      allow read: if true;
      allow write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

## 🎯 Features Included

- ✅ Star ratings (1-5 stars)
- ✅ Written reviews
- ✅ Real-time updates
- ✅ User identification
- ✅ Timestamp tracking
- ✅ Responsive design
- ✅ Error handling

## 🚨 Important Notes

1. **Free Tier**: Firebase has a generous free tier
2. **Data Persistence**: Reviews are stored permanently
3. **Real-time**: Changes appear immediately
4. **Scalable**: Handles thousands of reviews
5. **Secure**: Data is encrypted in transit and at rest

## 🔧 Troubleshooting

### Common Issues:
1. **"Firebase not loaded"** → Check configuration values
2. **"Permission denied"** → Check Firestore rules
3. **"Network error"** → Check internet connection
4. **"Module not found"** → Ensure files are in correct location

### Debug Mode:
Open browser console to see detailed error messages.

## 📈 Analytics (Optional)

To see usage statistics:
1. Go to Firebase Console → Analytics
2. View user engagement
3. Monitor review activity
4. Track popular stories

---

**Need Help?** Check the [Firebase Documentation](https://firebase.google.com/docs) or contact support.
