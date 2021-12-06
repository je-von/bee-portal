import { ForumThread } from '../model/ForumThread.js'
import { CourseController } from './coursecontroller.js'
import { UserController } from './UserController.js'
import { ClassController } from './ClassController.js'
import { ForumReply } from '../model/ForumReply.js'
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

      getAllForumReply: function (forumId) {
        return ForumReply.getAll(forumId)
      },

      showForumDetailPage: async function (id) {
        const forum = await this.getForumThread(id)

        let container = document.getElementById('container')
        let template = document.getElementById('forum-template')

        let clone = template.content.cloneNode(true)

        const c = await ClassController.getInstance().getClassById(forum.classId)
        clone.querySelector('#class-code').textContent = c.classCode

        const course = await CourseController.getInstance().getCourseById(c.courseCode)
        clone.querySelector('#course-name').textContent = course.courseCode + ' - ' + course.name

        const user = await UserController.getInstance().getUserById(forum.userId)
        clone.querySelector('#forum-user').textContent = user.name
        if (user.role == 'Lecturer') clone.querySelector('#forum-user').textContent += ' • Lecturer'

        clone.querySelector('#forum-title').textContent = forum.title

        clone.querySelector('#forum-content').textContent = forum.content

        clone.querySelector('#forum-date').textContent = new Date(forum.postDate.seconds * 1000).toLocaleString()

        if (!forum.isReplyHidden) {
          const replies = await this.getAllForumReply(id)
          replies.forEach(async (r) => {
            let replyContainer = clone.querySelector('#reply-container')
            let replyTemplate = clone.querySelector('#reply-template')
            let replyClone = replyTemplate.content.cloneNode(true)

            const u = await UserController.getInstance().getUserById(r.userId)

            replyClone.querySelector('#reply-user').textContent = u.name
            if (u.role == 'Lecturer') replyClone.querySelector('#reply-user').textContent += ' • Lecturer'
            replyClone.querySelector('#reply-date').textContent = new Date(r.replyDate.seconds * 1000).toLocaleString()
            replyClone.querySelector('#reply-content').textContent = r.content

            replyContainer.appendChild(replyClone)
          })
        } else {
          let i = document.createElement('i')
          i.setAttribute('class', 'far fa-eye-slash mr-3')

          clone.getElementById('reply-lbl').textContent = 'Replies to this thread are hidden.'
          clone.getElementById('reply-lbl').prepend(i)
        }

        container.appendChild(clone)
        document.querySelector('#loading-spinner').remove()
      },

      insertReply: async function (forumId, userId, content) {
        if (content.length < 5) {
          alert('Reply must be at least 5 characters!')
          return
        }
        const r = new ForumReply('', forumId, userId, content)

        const success = await r.insert()

        if (success) {
          alert('Reply Success!')
          location.reload()
        } else {
          alert('Reply error!')
        }

        return success
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
