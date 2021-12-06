import { collection, query, where, getDocs, doc, getDoc, orderBy, getFirestore } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Database } from '../util/Database.js'

export class ForumReply {
  constructor(replyId, forumId, userId, content, replyDate) {
    this.replyId = replyId
    this.forumId = forumId
    this.userId = userId
    this.content = content
    this.replyDate = replyDate
  }

  static async getAll(forumId) {
    console.log(forumId)
    try {
      const q = query(collection(Database.getDB(), 'forumreplies'), where('forumId', '==', doc(Database.getDB(), 'forumthreads', forumId)))
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
}
