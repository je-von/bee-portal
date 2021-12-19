import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  addDoc,
  getDoc,
  getFirestore,
  Timestamp,
  orderBy,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'

export class Curriculum {
  constructor(curriculumId, majorId, semester, courseIds) {
    this.curriculumId = curriculumId
    this.majorId = majorId
    this.semester = semester
    this.courseIds = courseIds
  }

  static async getAll(majorId) {
    try {
      const q = query(collection(Database.getDB(), 'curriculums'), where('majorId', '==', doc(Database.getDB(), 'majors', majorId)))
      const querySnapshot = await getDocs(q)
      let curr = []

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          curr.push(
            new Curriculum(
              doc.id,
              data['majorId'].id,
              data['semester'],
              data['courseIds'].map((c) => c.id)
            )
          )
        })
      }

      return curr
    } catch (e) {
      console.log(e)
      return []
    }
  }
}
