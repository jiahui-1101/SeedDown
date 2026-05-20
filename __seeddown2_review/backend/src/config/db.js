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
    const serviceAccount = parseServiceAccountJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    console.log('Firebase credential source: FIREBASE_SERVICE_ACCOUNT_JSON');
    console.log('Firebase service account project:', serviceAccount.project_id);
    console.log('Firebase service account email:', serviceAccount.client_email);
    return cert(serviceAccount);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credentialPath = resolveCredentialPath(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('Firebase credential source: GOOGLE_APPLICATION_CREDENTIALS');
    console.log('Firebase credential path:', credentialPath || process.env.GOOGLE_APPLICATION_CREDENTIALS);

    if (!credentialPath) {
      throw new Error(`Firebase service account file not found: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
    }
    return cert(require(credentialPath));
  }

  const localCredentialPath = resolveCredentialPath('firebase-service-account.json');
  if (localCredentialPath) {
    console.log('Firebase credential source: local firebase-service-account.json');
    return cert(require(localCredentialPath));
  }

  console.warn('Firebase credential source: applicationDefault()');
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
