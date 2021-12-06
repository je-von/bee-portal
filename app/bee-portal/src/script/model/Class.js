import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  getFirestore,
  DocumentReference,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../Database.js'

export class Class {
  constructor(
    classId,
    classCode,
    courseCode,
    studentIds,
    lecturerId,
    day,
    shift,
    runningPeriod
  ) {
    this.classId = classId
    this.classCode = classCode
    this.courseCode = courseCode
    this.studentIds = studentIds
    this.lecturerId = lecturerId
    this.day = day
    this.shift = shift
    this.runningPeriod = runningPeriod
  }

  static async getAllByStudentId(studentId) {
    try {
      const q = query(
        collection(Database.getDB(), 'classes'),
        where(
          'students',
          'array-contains',
          doc(Database.getDB(), 'users', studentId)
        )
      )
      console.log(q)
      const querySnapshot = await getDocs(q)
      const classes = []
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          console.log(doc)
          const c = this.snapshotToClass(doc)
          classes.push(c)
        })
      }

      return classes
    } catch (e) {
      console.log(e)
      return null
    }
  }
  static async get(classId) {
    const docRef = doc(Database.getDB(), 'classes', classId)
    const docSnap = await getDoc(docRef)

    let c = null
    if (docSnap.exists()) {
      c = this.snapshotToClass(docSnap)
    }
    return c
  }

  static snapshotToClass(doc) {
    const data = doc.data()
    const students = []
    data['students'].forEach((s) => {
      students.push(s.id)
    })

    const c = new Class(
      doc.id,
      data['classCode'],
      data['course'].id,
      students,
      data['lecturer'].id,
      data['day'],
      data['shift'],
      data['runningPeriod']
    )

    return c
  }
}
