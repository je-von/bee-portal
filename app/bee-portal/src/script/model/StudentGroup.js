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
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'

export class StudentGroup {
  constructor(groupId, classId, studentIds) {
    this.groupId = groupId
    this.classId = classId
    this.studentIds = studentIds
  }

  static async getAll(classId) {
    try {
      const q = query(collection(Database.getDB(), 'studentgroups'), where('classId', '==', doc(Database.getDB(), 'classes', classId)))
      const querySnapshot = await getDocs(q)
      let groups = []
      // console.log(querySnapshot.empty)
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          groups.push(
            new StudentGroup(
              doc.id,
              data['classId'].id,
              data['studentIds'].map((s) => s.id)
            )
          )
        })

        // console.log(groups)
      }

      return groups
    } catch (e) {
      console.log(e)
      return []
    }
  }

  static async getByStudentId(classId, studentId) {
    try {
      const q = query(
        collection(Database.getDB(), 'studentgroups'),
        where('studentIds', 'array-contains', doc(Database.getDB(), 'users', studentId)),
        where('classId', '==', doc(Database.getDB(), 'classes', classId)),
        limit(1)
      )
      // console.log(q)
      const querySnapshot = await getDocs(q)
      let group = null
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const data = doc.data()
          group = new StudentGroup(
            doc.id,
            data['classId'].id,
            data['studentIds'].map((s) => s.id)
          )
        })
      }
      console.log(group)
      return group
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async insert() {
    try {
      const docRef = await addDoc(collection(Database.getDB(), 'studentgroups'), {
        classId: doc(Database.getDB(), 'classes', this.classId),
        studentIds: this.studentIds.map((s) => doc(Database.getDB(), 'users', s)),
      })
      this.groupId = docRef.id
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
