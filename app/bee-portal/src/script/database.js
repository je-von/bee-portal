import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
//Singleton
export const Database = (function () {
  var db

  function create() {
    const firebaseApp = initializeApp({
      apiKey: 'AIzaSyCfP4MYBzuwRNNb_aBjE8zGxDFfex86upk',
      authDomain: 'bee-portal-jv.firebaseapp.com',
      projectId: 'bee-portal-jv',
      storageBucket: 'bee-portal-jv.appspot.com',
      messagingSenderId: '3478890079',
      appId: '1:3478890079:web:958bb067358f1e91f9ddea',
      measurementId: 'G-RQH3850JL4',
    })
    return getFirestore(firebaseApp)
  }

  return {
    getDB: function () {
      if (!db) db = create()

      return db
    },
    currentUser: null,
  }
})()
