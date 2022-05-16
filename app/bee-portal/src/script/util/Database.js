import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'

//Singleton
export const Database = (function () {
  var db

  function create() {
    require('dotenv').config()
    const firebaseApp = initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.API_ID,
      measurementId: process.env.MEASUREMENT_ID,
    })
    db = getFirestore(firebaseApp)
  }

  return {
    getDB: function () {
      if (!db) create()

      return db
    },
  }
})()
