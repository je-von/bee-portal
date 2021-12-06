import { Class } from '../model/class.js'
import { CourseController } from './coursecontroller.js'
import { UserController } from './UserController.js'
import { Syllabus } from '../model/Syllabus.js'
import { getSchedule } from '../util/Utility.js'
import { ForumController } from './ForumController.js'
//singleton
export const ClassController = (function () {
  var instance
  function create() {
    return {
      getAllClassesByStudent: async function (studentId) {
        try {
          const classes = await Class.getAllByStudentId(studentId)
          // console.log('selesai')
          console.log(classes)
          return classes
        } catch (e) {
          console.log(e)
          return []
        }
      },
      getAllClassesByLecturer: async function (lecturerId) {
        try {
          const classes = await Class.getAllByLecturerId(lecturerId)
          // console.log('selesai')
          console.log(classes)
          return classes
        } catch (e) {
          console.log(e)
          return []
        }
      },
      getClassById: async function (classId) {
        const c = await Class.get(classId)
        return c
      },

      showClassDetailPage: async function (classId) {
        const c = await this.getClassById(classId)
        let template = document.getElementById('template')
        let container = document.getElementById('container')
        const clone = template.content.cloneNode(true)

        const course = await CourseController.getInstance().getCourseById(c.courseCode)

        clone.querySelector('#course-name').textContent = c.courseCode + ' - ' + course.name
        clone.querySelector('#class-code').textContent = c.classCode
        clone.querySelector('#course-credits').textContent = course.creditsPerSemester + ' Credits'

        clone.querySelector('#class-schedule').textContent = getSchedule(c.day, c.shift)

        const lecturer = await UserController.getInstance().getUserById(c.lecturerId)

        clone.querySelector('#lecturer-name').textContent = lecturer.lecturerCode + ' - ' + lecturer.name

        //syllabus tab
        const syllabus = await Syllabus.getAll(c.courseCode)
        console.log(syllabus)
        if (syllabus) {
          clone.querySelector('#course-desc').textContent = syllabus.courseDescription

          syllabus.learningOutcomes.forEach((l) => {
            let loContainer = clone.getElementById('lo-container')
            let list = clone.getElementById('lo-template')

            const listClone = list.content.cloneNode(true)

            listClone.querySelector('#list').textContent = l
            loContainer.appendChild(listClone)
          })

          syllabus.strategies.forEach((s) => {
            let sContainer = clone.getElementById('strategies-container')
            let list = clone.getElementById('strategies-template')

            const listClone = list.content.cloneNode(true)

            listClone.querySelector('#list').textContent = s
            sContainer.appendChild(listClone)
          })

          syllabus.textbooks.forEach((t) => {
            let tContainer = clone.getElementById('textbooks-container')
            let list = clone.getElementById('textbooks-template')

            const listClone = list.content.cloneNode(true)

            listClone.querySelector('#list').textContent = t
            tContainer.appendChild(listClone)
          })
        }
        //forum tab
        const forums = await ForumController.getInstance().getAllForumThread(classId)
        console.log(forums)
        forums.forEach(async (f) => {
          let forumContainer = clone.getElementById('forum')
          let template = clone.getElementById('forum-template')

          let forumClone = template.content.cloneNode(true)

          forumClone.querySelector('#forum-title').textContent = f.title
          forumClone.querySelector('#forum-date').textContent = new Date(f.postDate.seconds * 1000).toLocaleString()
          // console.log(f.postDate)
          const user = await UserController.getInstance().getUserById(f.userId)
          forumClone.querySelector('#forum-user').textContent = user.name
          if (user.role == 'Lecturer') forumClone.querySelector('#forum-user').textContent += ' • Lecturer'

          forumClone.querySelector('#forum-link').setAttribute('href', '../forum/detail.html?id=' + f.forumId)

          forumContainer.appendChild(forumClone)
        })

        //people tab
        let i = 1
        c.studentIds.forEach(async (s) => {
          const student = await UserController.getInstance().getUserById(s)

          let studentContainer = document.getElementById('student-container')
          // console.log(studentContainer)
          let row = document.getElementById('student-template')
          // console.log(row)
          const rowClone = row.content.cloneNode(true)

          rowClone.querySelector('#student-index').textContent = i
          rowClone.querySelector('#student-name').textContent = student.name
          rowClone.querySelector('#student-nim').textContent = student.NIM
          rowClone.querySelector('#student-major').textContent = student.major

          studentContainer.appendChild(rowClone)
          i++
        })
        // console.log(c.studentIds)

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
