import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  orderBy,
  getFirestore,
  Timestamp,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'
export class AssignmentAnswer {
  constructor(answerId, assignmentId, answerFile, uploadDate) {
    this.answerId = answerId
    this.assignmentId = assignmentId
    this.answerFile = answerFile
    this.uploadDate = uploadDate
  }

  static async getAll(assignmentId) {
    let q = query(collection(Database.getDB(), 'assignmentanswers'), where('assignmentId', '==', doc(Database.getDB(), 'assignments', assignmentId)))
    const querySnapshot = await getDocs(q)
    const ans = []
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        // let a = new AssignmentAnswer
        // ans.push(a)
      })
    }
    // console.log(users)
    return ans
  }
}

export class IndividualAnswer extends AssignmentAnswer {
  constructor(answerId, assignmentId, answerFile, uploadDate, studentId) {
    super(answerId, assignmentId, answerFile, uploadDate)
    this.studentId = studentId
  }

  static async getAllStudentAnswer(assignmentId, studentId) {
    const q = query(
      collection(Database.getDB(), 'assignmentanswers'),
      where('assignmentId', '==', doc(Database.getDB(), 'assignments', assignmentId)),
      where('studentId', '==', doc(Database.getDB(), 'users', studentId)),
      orderBy('uploadDate', 'desc')
      // limit(1)
    )

    const querySnapshot = await getDocs(q)

    let ans = []
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        ans.push(new IndividualAnswer(doc.id, data['assignmentId'].id, data['answer'], data['uploadDate'], data['studentId'].id))
      })
    }

    return ans
  }

  async insert() {
    try {
      const docRef = await addDoc(collection(Database.getDB(), 'assignmentanswers'), {
        assignmentId: doc(Database.getDB(), 'assignments', this.assignmentId),
        answer: this.answerFile,
        uploadDate: Timestamp.now(),
        studentId: doc(Database.getDB(), 'users', this.studentId),
      })
      this.answerId = docRef.id
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
export class GroupAnswer extends AssignmentAnswer {
  constructor(answerId, assignmentId, answerFile, uploadDate, groupId) {
    super(answerId, assignmentId, answerFile, uploadDate)
    this.groupId = groupId
  }
}
