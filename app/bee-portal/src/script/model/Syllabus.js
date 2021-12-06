import { collection, query, where, getDocs, doc, getDoc, getFirestore } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../Database.js'

export class Syllabus {
  constructor(syllabusId, courseCode, session, courseOutline) {
    this.syllabusId = syllabusId
    this.courseCode = courseCode
    this.session = session
    this.courseOutline = courseOutline
  }

  static async getAll(courseCode) {
    try {
      const q = query(
        collection(Database.getDB(), 'syllabuses'),
        where('course', '==', doc(Database.getDB(), 'courses', courseCode)),
        orderBy('session')
      )
      const querySnapshot = await getDocs(q)
      const syllabuses = []
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const data = doc.data()
          const s = new Syllabus(doc.id, data['course'].id, data['session'], data['courseOutline'])
          console.log('syl')
          syllabuses.push(s)
        })
      }

      return syllabuses
    } catch (e) {
      return null
    }
  }
}
