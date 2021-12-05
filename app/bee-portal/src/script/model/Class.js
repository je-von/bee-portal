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
          const data = doc.data()

          //   const students = []
          //   // data['students'].forEach(async (s) => {
          //   //   students.push(await getDoc(s))
          //   // })
          //   data['students'].forEach((s) => {
          //     students.push(s.id)
          //   })
          //   const course = await getDoc(data['course'])
          //   const lecturer = await getDoc(data['lecturer'])
          const c = new Class(
            doc.id,
            data['classCode'],
            data['course'],
            data['students'],
            data['lecturer'],
            data['day'],
            data['shift'],
            data['runningPeriod']
          )
          console.log('asd')
          // console.log(x.data()['name'])
          classes.push(c)
        })
      }

      return classes
    } catch (e) {
      console.log(e)
      return null
    }
  }

  static async convertCourse(data) {
    const c = await getDoc(data)
    return c
  }
}
