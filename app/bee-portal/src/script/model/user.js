import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  getFirestore,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'
import { UserFactory } from '../factory/UserFactory.js'
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
      where('email', '==', email.toLowerCase()),
      limit(1)
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
          let factory = new UserFactory()
          u = factory.createUser(doc)
          console.log(u)
        }
      })
    }

    return u
  }

  static async getById(id) {
    // console.log(id)
    const docRef = doc(Database.getDB(), 'users', id)
    const docSnap = await getDoc(docRef)

    let u = null
    if (docSnap.exists()) {
      const data = docSnap.data()
      let factory = new UserFactory()
      u = factory.createUser(docSnap)
    }
    return u
  }

  static async getAllByRole(role) {
    const q = query(collection(Database.getDB(), 'users'), where('role', '==', role))

    const querySnapshot = await getDocs(q)
    const users = []
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        let factory = new UserFactory()
        let u = factory.createUser(doc)
        users.push(u)
      })
    }
    // console.log(users)
    return users
  }

  static async getAll() {
    const querySnapshot = await getDocs(collection(Database.getDB(), 'users'))
    const users = []
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        let factory = new UserFactory()
        let u = factory.createUser(doc)
        users.push(u)
      })
    }
    // console.log(users)
    return users
  }

  async checkNotification() {
    const q = query(
      collection(Database.getDB(), 'notifications'),
      where('userId', '==', doc(Database.getDB(), 'users', this.userId))
      // where('seen', '==', false)
    )

    const querySnapshot = await getDocs(q)

    let notif = []
    if (!querySnapshot.empty) {
      querySnapshot.forEach((docSnap) => {
        console.log(docSnap.data()['content'])
        notif.push(docSnap.data()['content'])

        deleteDoc(doc(Database.getDB(), 'notifications', docSnap.id))
      })
    }

    return notif
  }

  async notify(content) {
    try {
      const docRef = await addDoc(collection(Database.getDB(), 'notifications'), {
        content: content,
        // seen: false,
        userId: doc(Database.getDB(), 'users', this.userId),
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

export class Student extends User {
  constructor(userId, email, password, name, role, NIM, enrolledYear, major) {
    super(userId, email, password, name, role)
    this.NIM = NIM
    this.enrolledYear = enrolledYear
    this.major = major
  }
}
export class Lecturer extends User {
  constructor(userId, email, password, name, role, lecturerCode) {
    super(userId, email, password, name, role)
    this.lecturerCode = lecturerCode
  }
}
