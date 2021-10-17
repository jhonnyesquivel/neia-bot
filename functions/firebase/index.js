const config = require('../config');
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mftd-esp.firebaseio.com"
});

const bucket = admin.storage().bucket("mftd-esp.appspot.com");
exports.firebaseTools = { Functions: functions, Bucket: bucket };
