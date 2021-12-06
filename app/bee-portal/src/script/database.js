import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  getFirestore,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'

//Singleton
export const Database = (function () {
  var db

  async function create() {
    const firebaseApp = initializeApp({
      apiKey: 'AIzaSyCfP4MYBzuwRNNb_aBjE8zGxDFfex86upk',
      authDomain: 'bee-portal-jv.firebaseapp.com',
      projectId: 'bee-portal-jv',
      storageBucket: 'bee-portal-jv.appspot.com',
      messagingSenderId: '3478890079',
      appId: '1:3478890079:web:958bb067358f1e91f9ddea',
      measurementId: 'G-RQH3850JL4',
    })
    db = getFirestore(firebaseApp)

    // seedUsers()

    // const docRef = addDoc(collection(db, 'tes'), {
    //   name: 'asd',
    //   user: doc(Database.getDB(), 'users', '1Niqlyc6RCp2r83Sof7O'),
    // })

    // const q = query(collection(Database.getDB(), 'users'), where('role', '==', 'Student'))

    // const querySnapshot = await getDocs(q)
    // if (!querySnapshot.empty) {
    //   let i = 1
    //   querySnapshot.forEach((docSnap) => {
    //     let major = ''
    //     if (i % 2 == 0) major = 'Computer Science'
    //     else major = 'Information System'
    //     updateDoc(doc(Database.getDB(), 'users', docSnap.id), { major: major })
    //     i++
    //   })
    // }

    // const querySnapshot = await getDocs(q)
    // if (!querySnapshot.empty) {
    //   const users = []
    //   querySnapshot.forEach((docSnap) => {
    //     users.push(doc(Database.getDB(), 'users', docSnap.id))
    //   })
    //   const docRef = addDoc(collection(db, 'classes'), {
    //     classCode: 'LQ01',
    //     course: doc(Database.getDB(), 'courses', 'ISYS6169'),
    //     students: users,
    //     lecturer: doc(Database.getDB(), 'users', 'nFmiz3EKKU0w76tNjxO6'),
    //     day: 5,
    //     shift: 1,
    //     runningPeriod: { year: 2021, semester: 'Odd' },
    //   })
    //   console.log('berhasil')
    // }
  }

  function seedUsers() {
    const faker = require('faker')
    const bcrypt = require('bcrypt-nodejs')

    // var salt = bcrypt.genSaltSync(10)
    // const hash = bcrypt.hashSync('jevon123', salt)
    // const docRef = addDoc(collection(db, 'users'), {
    //   name: 'Jevon Levin',
    //   password: hash,
    //   email: 'jevon.levin@slc.ac.id',
    //   role: 'Student',
    //   enrolledYear: 2020,
    //   NIM: 2440013600,
    // })

    // loop sbyk data yg mau dicreate
    for (let i = 0; i < 5; i++) {
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()

      //passwordnya firstname123 trs dihash
      const salt = bcrypt.genSaltSync(10)
      const originalPassword = firstName.toLowerCase() + '123'
      const hashedPassword = bcrypt.hashSync(originalPassword, salt)

      const docRef = addDoc(collection(db, 'users'), {
        name: firstName + ' ' + lastName,
        password: hashedPassword,
        email: firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@slc.edu', //.edu or .ac.id
        role: 'Academic Department',
        // lecturerCode: 'D' + faker.datatype.number({ min: 1000, max: 9999 }),
        // enrolledYear: 2019, //2019 2020 2021
        // NIM: faker.datatype.number({ min: 2300000000, max: 2399999999 }), //23 24 25
      })
    }
  }

  return {
    getDB: function () {
      if (!db) create()

      return db
    },
  }
})()
