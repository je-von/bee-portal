import { collection, query, where, limit, getDocs, doc, getDoc, getFirestore } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
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
      console.log(querySnapshot.empty)
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

        console.log(groups)
      }

      return groups
    } catch (e) {
      console.log(e)
      return []
    }
  }
}
