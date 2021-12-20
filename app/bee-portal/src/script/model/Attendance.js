import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  getDoc,
  getFirestore,
  orderBy,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'

export class Attendance {
  constructor(attendanceId, classId, studentId, session, isPresent) {
    this.attendanceId = attendanceId
    this.classId = classId
    this.studentId = studentId
    this.session = session
    this.isPresent = isPresent
  }

  static async getAllByClassSession(classId, session) {
    try {
      const q = query(
        collection(Database.getDB(), 'attendances'),
        where('classId', '==', doc(Database.getDB(), 'classes', classId)),
        where('session', '==', session)
      )
      const querySnapshot = await getDocs(q)
      const att = []
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const data = doc.data()
          att.push(new Attendance(doc.id, data['classId'].id, data['studentId'].id, data['session'], data['isPresent']))
        })
      }
      //   console.log(att)
      return att
    } catch (e) {
      console.log(e)
      return null
    }
  }

  static async getAllByClassStudent(classId, studentId) {
    try {
      const q = query(
        collection(Database.getDB(), 'attendances'),
        where('classId', '==', doc(Database.getDB(), 'classes', classId)),
        where('studentId', '==', doc(Database.getDB(), 'users', studentId))
      )
      const querySnapshot = await getDocs(q)
      const att = []
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const data = doc.data()
          att.push(new Attendance(doc.id, data['classId'].id, data['studentId'].id, data['session'], data['isPresent']))
        })
      }
      //   console.log(att)
      return att
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async insert() {
    try {
      const docRef = await addDoc(collection(Database.getDB(), 'attendances'), {
        studentId: doc(Database.getDB(), 'users', this.studentId),
        classId: doc(Database.getDB(), 'classes', this.classId),
        session: this.session,
        isPresent: this.isPresent,
      })
      this.attendanceId = docRef.id
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async update() {
    console.log('asd')
    try {
      await updateDoc(doc(Database.getDB(), 'attendances', this.attendanceId), {
        isPresent: this.isPresent,
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
