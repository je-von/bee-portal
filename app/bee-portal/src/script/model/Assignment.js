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

export class Assignment {
  constructor(assignmentId, classId, deadlineDate, title, caseFile, assignmentType) {
    this.assignmentId = assignmentId
    this.classId = classId
    this.deadlineDate = deadlineDate
    this.title = title
    this.caseFile = caseFile
    this.assignmentType = assignmentType
  }

  static async getAll(classId) {
    try {
      const q = query(collection(Database.getDB(), 'assignments'), where('classId', '==', doc(Database.getDB(), 'classes', classId)))
      const querySnapshot = await getDocs(q)
      let asg = []
      // console.log(querySnapshot.empty)
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          asg.push(new Assignment(doc.id, data['classId'].id, data['deadlineDate'], data['title'], data['case'], data['assignmentType']))
        })

        // console.log(asg)
      }

      return asg
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async insert() {
    try {
      const docRef = await addDoc(collection(Database.getDB(), 'assignments'), {
        classId: doc(Database.getDB(), 'classes', this.classId),
        deadlineDate: this.deadlineDate,
        title: this.title,
        case: this.caseFile,
        assignmentType: this.assignmentType,
      })
      this.answerId = docRef.id
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
