import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  orderBy,
  deleteDoc,
  getFirestore,
  updateDoc,
  Timestamp,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'

export class ForumReply {
  constructor(replyId = '', forumId, userId, content, replyDate = Timestamp.now()) {
    this.replyId = replyId
    this.forumId = forumId
    this.userId = userId
    this.content = content
    this.replyDate = replyDate
  }

  static async getAll(forumId) {
    console.log(forumId)
    try {
      const q = query(
        collection(Database.getDB(), 'forumreplies'),
        where('forumId', '==', doc(Database.getDB(), 'forumthreads', forumId)),
        orderBy('replyDate', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const replies = []
      console.log(querySnapshot.empty)
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const data = doc.data()
          const r = new ForumReply(doc.id, data['forumId'].id, data['userId'].id, data['content'], data['replyDate'])
          replies.push(r)
        })
      }

      return replies
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async insert() {
    try {
      const docRef = await addDoc(collection(Database.getDB(), 'forumreplies'), {
        forumId: doc(Database.getDB(), 'forumthreads', this.forumId),
        userId: doc(Database.getDB(), 'users', this.userId),
        content: this.content,
        replyDate: this.replyDate,
      })
      this.replyId = docRef.id
      //   alert('berhasil')
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  static async get(replyId) {
    const docRef = doc(Database.getDB(), 'forumreplies', replyId)
    const docSnap = await getDoc(docRef)

    let r = null
    if (docSnap.exists()) {
      const data = docSnap.data()
      // console.log('asd')
      r = new ForumReply(docSnap.id, data['forumId'].id, data['userId'].id, data['content'], data['replyDate'])
    }
    return r
  }

  async delete() {
    try {
      await deleteDoc(doc(Database.getDB(), 'forumreplies', this.replyId))
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async update() {
    try {
      await updateDoc(doc(Database.getDB(), 'forumreplies', this.replyId), {
        content: this.content,
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
