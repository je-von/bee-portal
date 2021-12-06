import { collection, query, where, limit, getDocs, doc, getDoc, getFirestore } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../Database.js'

export class Syllabus {
  constructor(syllabusId, courseCode, courseDescription, learningOutcomes, strategies, textbooks) {
    this.syllabusId = syllabusId
    this.courseCode = courseCode
    this.courseDescription = courseDescription
    this.learningOutcomes = learningOutcomes
    this.strategies = strategies
    this.textbooks = textbooks
  }

  static async getAll(courseCode) {
    try {
      const q = query(collection(Database.getDB(), 'syllabuses'), where('course', '==', doc(Database.getDB(), 'courses', courseCode)), limit(1))
      const querySnapshot = await getDocs(q)
      let syllabus = null
      console.log(querySnapshot.empty)
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          syllabus = new Syllabus(
            doc.id,
            data['course'].id,
            data['courseDescription'],
            data['learningOutcomes'],
            data['strategies'],
            data['textbooks']
          )
        })

        console.log(syllabus)
      }

      return syllabus
    } catch (e) {
      console.log(e)
      return null
    }
  }
}
