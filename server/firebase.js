const { initializeApp } = require('firebase/app');
require('firebase/auth');
const admin = require("firebase-admin");

initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_SENDER_ID,
  appId: process.env.APP_ID,
});

const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {
    admin
}