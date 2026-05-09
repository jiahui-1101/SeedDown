const fs = require('fs');
const path = require('path');
const { initializeApp, applicationDefault, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');

let firestore;

function parseServiceAccountJson(rawJson) {
  const serviceAccount = JSON.parse(rawJson);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
  return serviceAccount;
}

function resolveCredentialPath(credentialPath) {
  const candidates = [
    path.resolve(process.cwd(), credentialPath),
    path.resolve(__dirname, credentialPath),
    path.resolve(__dirname, '..', '..', credentialPath),
    path.resolve(__dirname, '..', '..', '..', credentialPath),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate));
}

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return cert(parseServiceAccountJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credentialPath = resolveCredentialPath(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    if (!credentialPath) {
      throw new Error(`Firebase service account file not found: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
    }
    return cert(require(credentialPath));
  }

  return applicationDefault();
}

function connectDB() {
  if (!getApps().length) {
    initializeApp({
      credential: getCredential(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  firestore = getFirestore();
  firestore.settings({ ignoreUndefinedProperties: true });
  console.log('Firebase Firestore connected');
  return firestore;
}

function getDb() {
  return firestore || connectDB();
}

module.exports = {
  connectDB,
  getDb,
  FieldValue,
  Timestamp,
};
