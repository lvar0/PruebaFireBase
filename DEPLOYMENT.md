# FrikiFigures Deployment and Firebase Setup Guide

This guide provides step-by-step instructions to deploy your FrikiFigures application to Firebase and configure the necessary services.

## 1. Firebase Project Setup

1.  **Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click on "Add project" and follow the on-screen instructions to create a new project. Give it a name like "FrikiFigures".
    *   Disable Google Analytics for this project if you don't need it (to keep it simple).

2.  **Create a Web App in Firebase:**
    *   Inside your new project, click the Web icon (`</>`) to add a new web app.
    *   Register your app. Give it a nickname, e.g., "FrikiFigures Web".
    *   Check the box for "Also set up **Firebase Hosting** for this app".
    *   After registering, Firebase will show you your configuration object. **Copy these values.** You will need them in the next step.

## 2. Configure Your Local Environment

1.  **Create an Environment File:**
    In the root of your project, create a new file named `.env.local`.

2.  **Add Firebase Configuration:**
    Paste the configuration you copied from Firebase into `.env.local` like this:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    ```
    The application is already configured to read these variables from `src/lib/firebase/config.ts`.

## 3. Enable Firebase Services

You need to enable Authentication, Firestore, and Storage for the app to work. All of these services can be found in the "Build" section of the left-hand menu in your Firebase Console.

### A. Firebase Authentication

1.  Go to the **Authentication** section.
2.  Click "Get started".
3.  On the "Sign-in method" tab, enable the following providers:
    *   **Email/Password**: Just click the toggle to enable it.
    *   **Google**: Click the toggle, select a project support email, and save.

### B. Firestore Database

1.  Go to the **Firestore Database** section.
2.  Click "Create database".
3.  Choose to start in **Production mode**. This is important for security.
4.  Select a location for your database (e.g., `us-central`).
5.  Click "Enable".

### C. Firebase Storage

1.  Go to the **Storage** section.
2.  Click "Get started".
3.  Follow the prompts to create a default storage bucket. Use the suggested security rules for now; we will update them later.

## 4. Set Up Security Rules (Important!)

By default, your database and storage are locked down. You need to add rules to allow your app to read and write data securely. Go to the "Rules" tab in both the Firestore and Storage sections.

### A. Firestore Security Rules

Replace the default rules with these. These rules allow:
- Anyone to read figure data (`figuras`).
- Only authenticated users to read their own user profile (`usuarios`).
- Only authenticated users to create their own user profile.
- Only authenticated users to create new figures (assuming they are admins, you might want to add more specific admin role checks later).

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Figures can be read by anyone, but only created by logged-in users.
    // For a real app, you'd restrict write access to admins.
    match /figuras/{figureId} {
      allow read: if true;
      allow create: if request.auth != null;
      // To restrict to admins, you'd add a "roles" field to the user profile:
      // allow write: if get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin';
    }

    // Users can only read and write their own profile data.
    match /usuarios/{userId} {
      allow read, create: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### B. Storage Security Rules

Replace the default rules with these. These rules allow:
- Anyone to read images.
- Only authenticated users to upload images, as long as they are smaller than 5MB and are of an image type.

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }

    // Only allow authenticated users to upload images to the 'figures' folder
    match /figures/{fileName} {
      allow write: if request.auth != null &&
                      request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 5. Deploy to Firebase Hosting

1.  **Install Firebase CLI:**
    If you don't have it, install it globally:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase:**
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in your project:**
    This has already been done for you by Firebase Studio. If you were starting from scratch, you would run `firebase init`.

4.  **Build Your Next.js App:**
    Before deploying, you need to create a production build of your app.
    ```bash
    npm run build
    ```

5.  **Deploy:**
    Finally, deploy your app to Firebase Hosting.
    ```bash
    firebase deploy --only hosting
    ```
    Firebase will give you a URL where your live site is hosted. That's it!
