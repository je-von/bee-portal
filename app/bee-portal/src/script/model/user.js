import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  getFirestore,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../Database.js'

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
          u = this.snapshotToUser(doc)
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
      u = this.snapshotToUser(docSnap)
    }
    return u
  }

  static async getAllByRole(role) {
    const q = query(
      collection(Database.getDB(), 'users'),
      where('role', '==', role)
    )

    const querySnapshot = await getDocs(q)
    const users = []
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        let u = this.snapshotToUser(doc)
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
        let u = this.snapshotToUser(doc)
        users.push(u)
      })
    }
    // console.log(users)
    return users
  }

  static snapshotToUser(doc) {
    const data = doc.data()
    if (data.role == 'Student') {
      return new Student(
        doc.id,
        data['email'],
        data['password'],
        data['name'],
        data['role'],
        data['NIM'],
        data['enrolledYear']
      )
    } else if (data.role == 'Lecturer') {
      return new Lecturer(
        doc.id,
        data['email'],
        data['password'],
        data['name'],
        data['role'],
        data['lecturerCode']
      )
    } else {
      return new User(
        doc.id,
        data['email'],
        data['password'],
        data['name'],
        data['role']
      )
    }
  }
}

export class Student extends User {
  constructor(userId, email, password, name, role, NIM, enrolledYear) {
    super(userId, email, password, name, role)
    this.NIM = NIM
    this.enrolledYear = enrolledYear
  }
}
export class Lecturer extends User {
  constructor(userId, email, password, name, role, lecturerCode) {
    super(userId, email, password, name, role)
    this.lecturerCode = lecturerCode
  }
}
