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

let firestore;

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    );
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        "\n",
      );
    }
    return cert(serviceAccount);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    return cert(
      require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)),
    );
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
  console.log("Firebase Firestore connected");
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
