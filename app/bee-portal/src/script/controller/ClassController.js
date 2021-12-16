import { Class } from '../model/class.js'
import { CourseController } from './coursecontroller.js'
import { UserController } from './UserController.js'
import { Syllabus } from '../model/Syllabus.js'
import { getSchedule } from '../util/Utility.js'
import { ForumController } from './ForumController.js'
import { MajorController } from './majorcontroller.js'
import { days, shifts, dialogs } from '../util/Utility.js'

//singleton
export const ClassController = (function () {
  var instance
  function create() {
    return {
      getAllClasses: async function () {
        try {
          const classes = await Class.getAll()
          console.log(classes)
          return classes
        } catch (e) {
          console.log(e)
          return []
        }
      },
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

      showClassDetailPage: async function (classId, role) {
        const c = await this.getClassById(classId)
        let template = document.getElementById('template')
        let container = document.getElementById('container')
        const clone = template.content.cloneNode(true)

        const course = await CourseController.getInstance().getCourseById(c.courseCode)

        clone.querySelector('#course-name').textContent = c.courseCode + ' - ' + course.name
        clone.querySelector('#class-code').textContent = c.classCode
        clone.querySelector('#course-credits').textContent = course.creditsPerSemester + ' Credits'

        clone.querySelector('#class-schedule').textContent = getSchedule(c.schedule.day, c.schedule.shift)

        const lecturer = await UserController.getInstance().getUserById(c.lecturerId)
        if (lecturer != null) clone.querySelector('#lecturer-name').textContent = lecturer.lecturerCode + ' - ' + lecturer.name

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
        if (role === 'Administrative Department') {
          clone.querySelector('#forum-tab-container').remove()
          clone.querySelector('#attendance-tab-container').remove()
          clone.querySelector('#assignment-tab-container').remove()
          clone.querySelector('#group-tab-container').remove()

          clone.querySelector('#allocate-class-btn').setAttribute('href', './allocate.html?id=' + classId)
        } else {
          clone.querySelector('#manage-class-div').remove()
          clone.querySelector('#allocate-class-btn').remove()

          //forum tab
          clone.querySelector('#create-forum-btn').setAttribute('href', '../forum/insert.html?id=' + classId)

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
        }

        //people tab
        let i = 1
        c.studentIds.forEach(async (s) => {
          const student = await UserController.getInstance().getUserById(s)
          let major = await MajorController.getInstance().getMajor(student.major)

          let studentContainer = document.getElementById('student-container')
          // console.log(studentContainer)
          let row = document.getElementById('student-template')
          // console.log(row)
          const rowClone = row.content.cloneNode(true)

          rowClone.querySelector('#student-index').textContent = i
          rowClone.querySelector('#student-name').textContent = student.name
          rowClone.querySelector('#student-nim').textContent = student.NIM

          rowClone.querySelector('#student-major').textContent = major.name

          studentContainer.appendChild(rowClone)
          i++
        })
        // console.log(c.studentIds)

        container.appendChild(clone)

        document.querySelector('#loading-spinner').remove()
      },

      showInsertClassPage: async function () {
        let container = document.getElementById('container')
        let template = document.getElementById('class-template')

        let clone = template.content.cloneNode(true)

        let courses = await CourseController.getInstance().getAllCourses()
        courses.forEach((c) => {
          let opt = document.createElement('option')
          opt.setAttribute('value', c.courseCode)
          opt.textContent = c.courseCode + ' - ' + c.name
          clone.querySelector('#class-course').appendChild(opt)
        })

        let i = 1
        days.forEach((d) => {
          let opt = document.createElement('option')
          opt.setAttribute('value', i)
          opt.textContent = d
          clone.querySelector('#class-day').appendChild(opt)
          i++
        })

        i = 1
        shifts.forEach((d) => {
          let opt = document.createElement('option')
          opt.setAttribute('value', i)
          opt.textContent = d
          clone.querySelector('#class-shift').appendChild(opt)
          i++
        })

        container.appendChild(clone)

        document.querySelector('#loading-spinner').remove()
      },

      showAllocateClassPage: async function (classId) {
        const c = await this.getClassById(classId)
        let template = document.getElementById('class-template')
        let container = document.getElementById('container')
        const clone = template.content.cloneNode(true)

        const course = await CourseController.getInstance().getCourseById(c.courseCode)

        clone.querySelector('#course-name').textContent = c.courseCode + ' - ' + course.name
        clone.querySelector('#class-code').textContent = c.classCode

        let lecturers = await UserController.getInstance().getAllUsersByRole('Lecturer')
        lecturers.forEach((l) => {
          let opt = document.createElement('option')
          opt.setAttribute('value', l.userId)
          if (c.lecturerId == l.userId) opt.setAttribute('selected', 'selected')
          opt.textContent = l.lecturerCode + ' - ' + l.name
          clone.querySelector('#class-lecturer').appendChild(opt)
        })

        let students = await UserController.getInstance().getAllUsersByRole('Student')
        students.forEach((s) => {
          let opt = document.createElement('option')
          opt.setAttribute('value', s.userId)
          if (c.studentIds.includes(s.userId)) opt.setAttribute('selected', 'selected')

          opt.textContent = s.NIM + ' - ' + s.name
          clone.querySelector('#class-students').appendChild(opt)
        })

        container.appendChild(clone)

        document.querySelector('#loading-spinner').remove()
      },
      insertClass: async function (classCode, courseCode, schedule, runningPeriod) {
        // if (title.length < 5) {
        //   dialogs.alert('Title must be at least 5 characters!')
        //   return
        // }
        // if (content.length < 5) {
        //   dialogs.alert('Content must be at least 5 characters!')
        //   return
        // }
        const c = new Class('', classCode, courseCode, [], [], schedule, runningPeriod)

        const success = await c.insert()

        if (success) {
          dialogs.alert('Create Class Success!', () => {
            history.back()
          })
        } else {
          dialogs.alert('Create error!')
        }
      },
      allocateLecturerAndStudents: async function (classId, lecturerId, studentIds) {
        const c = await Class.get(classId)
        c.lecturerId = lecturerId
        // c.studentIds = [...new Set(c.studentIds.concat(studentIds))]
        c.studentIds = studentIds

        const success = await c.allocate()

        if (success) {
          dialogs.alert('Allocation Success!', () => {
            history.back()
          })
        } else {
          dialogs.alert('Allocate error!')
        }
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
