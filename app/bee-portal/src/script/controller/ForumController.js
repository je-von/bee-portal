import { ForumThread } from '../model/ForumThread.js'

//singleton
export const ForumController = (function () {
  var instance
  function create() {
    return {
      getAllForumThread: function (classId) {
        return ForumThread.getAll(classId)
      },

      getForumThread: function (id) {
        return ForumThread.get(id)
      },
    }
  }

  return {
    getInstance: function () {
      if (!instance) instance = create()
      return instance
    },
  }
})()
