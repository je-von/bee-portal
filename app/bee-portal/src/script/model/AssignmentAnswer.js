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

  static async get(assignmentId, studentId) {
    const q = query(
      collection(Database.getDB(), 'users'),
      where('assignmentId', '==', doc(Database.getDB(), 'assignments', assignmentId)),
      where('studentId', '==', doc(Database.getDB(), 'users', studentId)),
      limit(1)
    )

    const querySnapshot = await getDocs(q)

    let ans = null
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        ans = new IndividualAnswer(doc.id, data['assignmentId'].id, data['answer'], data['uploadDate'], data['studentId'].id)
      })
    }

    return ans
  }
}
export class GroupAnswer extends AssignmentAnswer {
  constructor(answerId, assignmentId, answerFile, uploadDate, groupId) {
    super(answerId, assignmentId, answerFile, uploadDate)
    this.groupId = groupId
  }
}
