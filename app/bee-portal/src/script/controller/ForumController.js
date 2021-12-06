import { ForumThread } from '../model/ForumThread.js'
import { CourseController } from './coursecontroller.js'
import { UserController } from './UserController.js'
import { ClassController } from './ClassController.js'
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

        container.appendChild(clone)
        document.querySelector('#loading-spinner').remove()
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
