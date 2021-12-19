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
      const q = query(
        collection(Database.getDB(), 'curriculums'),
        where('majorId', '==', doc(Database.getDB(), 'majors', majorId)),
        orderBy('semester', 'asc')
      )
      const querySnapshot = await getDocs(q)
      let curr = []

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          curr.push(new Curriculum(doc.id, data['majorId'].id, data['semester'], data['courseIds'] ? data['courseIds'].map((c) => c.id) : []))
        })
      }

      return curr
    } catch (e) {
      console.log(e)
      return []
    }
  }

  static async get(curriculumId) {
    const docRef = doc(Database.getDB(), 'curriculums', curriculumId)
    const docSnap = await getDoc(docRef)

    let c = null
    if (docSnap.exists()) {
      const data = docSnap.data()
      c = new Curriculum(docSnap.id, data['majorId'].id, data['semester'], data['courseIds'] ? data['courseIds'].map((c) => c.id) : [])
    }
    return c
  }

  async insert() {
    try {
      const docRef = await addDoc(collection(Database.getDB(), 'curriculums'), {
        majorId: doc(Database.getDB(), 'majors', this.majorId),
        semester: this.semester,
      })
      this.curriculumId = docRef.id
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
