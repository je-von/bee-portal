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

export class Course {
  constructor(courseCode, name, creditsPerSemester) {
    this.courseCode = courseCode
    this.name = name
    this.creditsPerSemester = creditsPerSemester
  }

  static async get(courseCode) {
    const docRef = doc(Database.getDB(), 'courses', courseCode)
    const docSnap = await getDoc(docRef)

    let course = null
    if (docSnap.exists()) {
      const data = docSnap.data()
      course = new Course(docSnap.id, data['name'], data['creditsPerSemester'])
    }
    return course
  }
}
