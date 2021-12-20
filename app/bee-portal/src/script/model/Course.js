import { collection, query, where, getDocs, doc, getDoc, getFirestore, setDoc } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'

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

  static async getAll() {
    try {
      const q = query(collection(Database.getDB(), 'courses'))
      const querySnapshot = await getDocs(q)
      const courses = []
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const data = doc.data()
          const c = new Course(doc.id, data['name'], data['creditsPerSemester'])
          courses.push(c)
        })
      }

      return courses
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async insert() {
    try {
      await setDoc(doc(Database.getDB(), 'courses', this.courseCode), {
        name: this.name,
        creditsPerSemester: this.creditsPerSemester,
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  calculateCreditsAndAbsence() {
    let totalSession = this.creditsPerSemester * 6
    let absenceLimit = this.creditsPerSemester * 2

    return { totalSession, absenceLimit }
  }
}
