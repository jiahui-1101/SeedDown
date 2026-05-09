const path = require('path');
const { initializeApp, applicationDefault, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');

let firestore;

/*function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    return cert(serviceAccount);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return cert(require(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)));
  }

  return applicationDefault();
}*/

function getCredential() {
  // 终极暴力破解法：既然找不到环境变量，我们就直接在同级目录读取文件！
  const serviceAccount = require('./firebase-service-account.json');
  return cert(serviceAccount);
}

function connectDB() {
  if (!getApps().length) {
    initializeApp({
      credential: getCredential(),
      projectId: process.env.FIREBASE_PROJECT_ID
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
  Timestamp
};