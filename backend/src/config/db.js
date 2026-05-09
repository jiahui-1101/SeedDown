<<<<<<< HEAD
const path = require('path');
const { initializeApp, applicationDefault, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');
=======
const path = require("path");
const {
  initializeApp,
  applicationDefault,
  cert,
  getApps,
} = require("firebase-admin/app");
const {
  getFirestore,
  FieldValue,
  Timestamp,
} = require("firebase-admin/firestore");
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942

let firestore;

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
<<<<<<< HEAD
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
=======
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    );
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        "\n",
      );
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
    }
    return cert(serviceAccount);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
<<<<<<< HEAD
    return cert(require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)));
=======
    return cert(
      require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)),
    );
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
  }

  return applicationDefault();
}

function connectDB() {
  if (!getApps().length) {
    initializeApp({
      credential: getCredential(),
<<<<<<< HEAD
      projectId: process.env.FIREBASE_PROJECT_ID
=======
      projectId: process.env.FIREBASE_PROJECT_ID,
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
    });
  }

  firestore = getFirestore();
<<<<<<< HEAD
  console.log('Firebase Firestore connected');
=======
  firestore.settings({ ignoreUndefinedProperties: true });
  console.log("Firebase Firestore connected");
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
  return firestore;
}

function getDb() {
  return firestore || connectDB();
}

module.exports = {
  connectDB,
  getDb,
  FieldValue,
<<<<<<< HEAD
  Timestamp
=======
  Timestamp,
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
};
