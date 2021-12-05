import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  getFirestore,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../database.js'

export class User {
  constructor(userId, email, password, name, role) {
    this.userId = userId
    this.name = name
    this.email = email
    this.password = password
    this.role = role
  }

  static async auth(email, password) {
    const q = query(
      collection(Database.getDB(), 'users'),
      where('email', '==', email)
      //   where('password', '==', password)
    )

    const querySnapshot = await getDocs(q)
    console.log(querySnapshot.empty)
    let u = null
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data())
        const data = doc.data()
        const bcrypt = require('bcrypt-nodejs')

        if (bcrypt.compareSync(password, data.password)) {
          u = new User(
            doc.id,
            data['email'],
            data['password'],
            data['name'],
            data['role']
          )
          console.log(u)
        }
      })
    }

    return u
  }

  static async getById(id) {
    console.log(id)
    const docRef = doc(Database.getDB(), 'users', id)
    const docSnap = await getDoc(docRef)

    let u = null
    if (docSnap.exists()) {
      const data = docSnap.data()
      u = new User(
        docSnap.id,
        data['email'],
        data['password'],
        data['name'],
        data['role']
      )
    }
    return u
  }
}
