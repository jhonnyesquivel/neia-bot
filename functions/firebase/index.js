const config = require('../config');
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(config.serviceAccount),
  databaseURL: config.databaseURL
});

const bucket = admin.storage().bucket(config.storageBucket);
exports.firebaseTools = { Functions: functions, Bucket: bucket };
