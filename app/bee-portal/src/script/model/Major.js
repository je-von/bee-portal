import { collection, query, where, getDocs, doc, getDoc, getFirestore, orderBy } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'

export class Major {
  constructor(majorId, name, totalCredits) {
    this.majorId = majorId
    this.name = name
    this.totalCredits = totalCredits
  }

  static async get(majorId) {
    const docRef = doc(Database.getDB(), 'majors', majorId)
    const docSnap = await getDoc(docRef)

    let major = null
    if (docSnap.exists()) {
      const data = docSnap.data()
      major = new Major(docSnap.id, data['name'], data['totalCredits'])
    }
    return major
  }

  static async getAll() {
    try {
      const q = query(collection(Database.getDB(), 'majors'), orderBy('name', 'asc'))
      const querySnapshot = await getDocs(q)
      const majors = []
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const data = doc.data()
          const m = new Major(doc.id, data['name'], data['totalCredits'])
          majors.push(m)
        })
      }

      return majors
    } catch (e) {
      console.log(e)
      return null
    }
  }
}
