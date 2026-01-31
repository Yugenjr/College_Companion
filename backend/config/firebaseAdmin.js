import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseApp = null;

/**
 * Initialize Firebase Admin SDK
 * Uses service account JSON file or environment variables
 */
export const initializeFirebaseAdmin = () => {
  if (firebaseApp) {
    console.log('⚠️  Firebase Admin already initialized');
    return firebaseApp;
  }

  try {
    let serviceAccount;

    // Option 1: Load from service account JSON file
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccountPath = join(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    }
    // Option 2: Load from environment variables
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {

      let privateKey = process.env.FIREBASE_PRIVATE_KEY;

      // FIX: Clean up the key if it was pasted with quotes or bad formatting
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }

      // FIX: Convert literal "\n" to actual newlines if present
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }

      serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      };
    } else {
      throw new Error('Firebase Admin credentials not found. Provide FIREBASE_SERVICE_ACCOUNT_PATH or individual env vars.');
    }

    const databaseURL = process.env.RTDB_URL || process.env.FIREBASE_DATABASE_URL;

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: databaseURL,
    });

    console.log('✅ Firebase Admin SDK initialized');
    console.log(`📦 Project: ${serviceAccount.project_id}`);

    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
    throw error;
  }
};

/**
 * Get Firebase Admin instance
 */
export const getFirebaseAdmin = () => {
  if (!firebaseApp) {
    throw new Error('Firebase Admin not initialized. Call initializeFirebaseAdmin() first.');
  }
  return admin;
};

/**
 * Get Firestore instance
 */
export const getFirestore = () => {
  return getFirebaseAdmin().firestore();
};

/**
 * Get Realtime Database instance
 */
export const getDatabase = () => {
  return getFirebaseAdmin().database();
};

/**
 * Get Auth instance
 */
export const getAuth = () => {
  return getFirebaseAdmin().auth();
};

export default {
  initializeFirebaseAdmin,
  getFirebaseAdmin,
  getFirestore,
  getDatabase,
  getAuth
};
