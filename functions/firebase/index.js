
const firebase = require("firebase");
require('firebase/storage');

const functions = require("firebase-functions");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyBYRnk1ssMHWVmP9xpt2JQ5sLQ41-wqHDY',
  authDomain: 'mftd-esp.firebaseapp.com',
  databaseURL: 'https://mftd-esp.firebaseio.com',
  storageBucket: 'mftd-esp.appspot.com'
});

var storage = firebase.storage();
storage.setMaxOperationRetryTime(300000);
exports.firebaseTools = { Functions: functions, Storage: storage};