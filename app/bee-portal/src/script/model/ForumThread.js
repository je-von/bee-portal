import { collection, query, where, getDocs, doc, getDoc, orderBy, getFirestore } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../Database.js'

export class ForumThread {
  constructor(forumId, classId, userId, title, content, postDate, isLocked, isReplyHidden) {
    this.forumId = forumId
    this.classId = classId
    this.userId = userId
    this.title = title
    this.content = content
    this.postDate = postDate
    this.isLocked = isLocked
    this.isReplyHidden = isReplyHidden
  }

  static async getAll(classId) {
    console.log(classId)
    try {
      const q = query(collection(Database.getDB(), 'forumthreads'), where('classId', '==', doc(Database.getDB(), 'classes', classId)))
      const querySnapshot = await getDocs(q)
      const forums = []
      console.log(querySnapshot.empty)
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const data = doc.data()
          const f = new ForumThread(
            doc.id,
            data['classId'].id,
            data['userId'].id,
            data['title'],
            data['content'],
            data['postDate'],
            data['isLocked'],
            data['isReplyHidden']
          )
          forums.push(f)
        })
      }

      return forums
    } catch (e) {
      console.log(e)
      return null
    }
  }
  static async get(forumId) {
    const docRef = doc(Database.getDB(), 'forumthreads', forumId)
    const docSnap = await getDoc(docRef)

    let f = null
    if (docSnap.exists()) {
      const data = docSnap.data()
      console.log('asd')
      f = new ForumThread(
        docSnap.id,
        data['classId'].id,
        data['userId'].id,
        data['title'],
        data['content'],
        data['postDate'],
        data['isLocked'],
        data['isReplyHidden']
      )
    }
    return f
  }
}
