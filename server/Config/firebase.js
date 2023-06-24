require('dotenv').config()

const initializeApp = require("firebase/app").initializeApp;
const getStorage = require("firebase/storage").getStorage;

const firebaseConfig = {

    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESS_SEND_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Storage = getStorage(app)

module.exports = Storage; 