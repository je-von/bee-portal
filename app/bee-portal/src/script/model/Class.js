import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  getFirestore,
  DocumentReference,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'
import { ClassFactory } from '../factory/ClassFactory.js'
import { Observable } from '../observer/NotificationObservable.js'

export class Class {
  constructor(classId, classCode, courseCode, studentIds, lecturerId, schedule, runningPeriod) {
    this.classId = classId
    this.classCode = classCode
    this.courseCode = courseCode
    this.studentIds = studentIds
    this.lecturerId = lecturerId
    this.schedule = schedule
    this.runningPeriod = runningPeriod

    this.observable = new Observable()

    this.observable.subscribe(lecturerId)
    studentIds.forEach((s) => {
      this.observable.subscribe(s)
    })

    // console.log(this.observable)
  }

  static async getAllByStudentId(studentId) {
    try {
      const q = query(collection(Database.getDB(), 'classes'), where('students', 'array-contains', doc(Database.getDB(), 'users', studentId)))
      console.log(q)
      const querySnapshot = await getDocs(q)
      const classes = []
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          // console.log(doc)
          let factory = new ClassFactory()
          let c = factory.createClass(doc)
          classes.push(c)
        })
      }

      return classes
    } catch (e) {
      console.log(e)
      return null
    }
  }
  static async getAllByLecturerId(lecturerId) {
    try {
      const q = query(collection(Database.getDB(), 'classes'), where('lecturer', '==', doc(Database.getDB(), 'users', lecturerId)))
      // console.log(q)
      const querySnapshot = await getDocs(q)
      const classes = []
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          // console.log(doc)
          let factory = new ClassFactory()
          let c = factory.createClass(doc)
          classes.push(c)
        })
      }

      return classes
    } catch (e) {
      console.log(e)
      return null
    }
  }
  static async getAll() {
    try {
      const q = query(collection(Database.getDB(), 'classes'))
      console.log(q)
      const querySnapshot = await getDocs(q)
      const classes = []
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          console.log(doc)
          let factory = new ClassFactory()
          let c = factory.createClass(doc)
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
      let factory = new ClassFactory()
      c = factory.createClass(docSnap)
    }
    return c
  }

  async insert() {
    try {
      const docRef = await addDoc(collection(Database.getDB(), 'classes'), {
        classCode: this.classCode,
        course: doc(Database.getDB(), 'courses', this.courseCode),

        schedule: this.schedule,
        runningPeriod: this.runningPeriod,
      })
      this.classId = docRef.id
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async allocate() {
    console.log(this.studentIds.map((s) => doc(Database.getDB(), 'users', s)))
    try {
      await updateDoc(doc(Database.getDB(), 'classes', this.classId), {
        lecturer: doc(Database.getDB(), 'users', this.lecturerId),
        students: this.studentIds.map((s) => doc(Database.getDB(), 'users', s)),
      })

      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
