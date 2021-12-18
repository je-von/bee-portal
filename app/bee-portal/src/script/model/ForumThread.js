import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  orderBy,
  getFirestore,
  deleteDoc,
  updateDoc,
  Timestamp,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'

export class ForumThread {
  constructor(forumId = '', classId, userId, title, content, isLocked, isReplyHidden, postDate = Timestamp.now()) {
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
    // console.log(classId)
    try {
      const q = query(
        collection(Database.getDB(), 'forumthreads'),
        where('classId', '==', doc(Database.getDB(), 'classes', classId)),
        orderBy('postDate', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const forums = []
      // console.log(querySnapshot.empty)
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          const f = new ForumThread(
            doc.id,
            data['classId'].id,
            data['userId'].id,
            data['title'],
            data['content'],
            data['isLocked'],
            data['isReplyHidden'],
            data['postDate']
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
        data['isLocked'],
        data['isReplyHidden'],
        data['postDate']
      )
    }
    return f
  }

  async insert() {
    try {
      const docRef = await addDoc(collection(Database.getDB(), 'forumthreads'), {
        userId: doc(Database.getDB(), 'users', this.userId),
        classId: doc(Database.getDB(), 'classes', this.classId),
        title: this.title,
        content: this.content,
        postDate: this.postDate,
        isReplyHidden: this.isReplyHidden,
        isLocked: this.isLocked,
      })
      this.forumId = docRef.id
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async delete() {
    try {
      await deleteDoc(doc(Database.getDB(), 'forumthreads', this.forumId))
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async update() {
    try {
      await updateDoc(doc(Database.getDB(), 'forumthreads', this.forumId), {
        title: this.title,
        content: this.content,
        isReplyHidden: this.isReplyHidden,
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
