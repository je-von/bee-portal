import { User } from '../model/user.js'
import { dialogs } from '../util/Utility.js'
import { createNotification } from '../util/Utility.js'
import { CourseController } from './CourseController.js'
import { ClassController } from './ClassController.js'
import { MajorController } from './majorcontroller.js'
//singleton
export const UserController = (function () {
  var instance
  function create() {
    return {
      auth: async function (email, password) {
        if (!email || !password) {
          dialogs.alert('Email and password must be filled!')
          return
        }

        const u = await User.auth(email, password)
        if (u != null) {
          localStorage.setItem('currentUser', u.userId)

          createNotification('Welcome to bee-portal, ' + u.name + ' !')

          console.log(localStorage.getItem('currentUser'))
          window.location.assign('./home.html')
        } else {
          dialogs.alert('Email or password is incorrect!')
        }
      },

      getUserById: function (id) {
        return User.getById(id)
      },

      checkNotification: async function (id) {
        let u = await this.getUserById(id)
        console.log(u)
        let notif = await u.checkNotification()

        notif.forEach((n) => {
          createNotification(n)
        })
      },

      notify: async function (content, userId) {
        let u = await this.getUserById(userId)
        u.notify(content)
      },

      getAllUsersByRole: function (role) {
        return User.getAllByRole(role)
      },

      showLearningReportPage: async function (userId) {
        const u = await UserController.getInstance().getUserById(userId)

        let template = document.getElementById('learning-report')
        let container = document.getElementById('container')
        const clone = template.content.cloneNode(true)

        const faker = require('faker')
        let reportId = faker.datatype.uuid()

        clone.querySelector('#report-id').textContent = reportId
        clone.querySelector('#report-date').textContent = new Date().toLocaleString()

        clone.querySelector('#student-name').textContent = u.name
        clone.querySelector('#student-nim').textContent = u.NIM

        let major = await MajorController.getInstance().getMajor(u.major)
        clone.querySelector('#student-major').textContent = major.name
        clone.querySelector('#student-email').textContent = u.email

        let classes = await ClassController.getInstance().getAllClassesByStudent(u.userId)
        // console.log(courses)

        classes.forEach(async (c) => {
          let courseTemplate = clone.getElementById('course-template')
          let courseContainer = clone.getElementById('course-container')
          const courseClone = courseTemplate.content.cloneNode(true)

          const course = await CourseController.getInstance().getCourseById(c.courseCode)

          courseClone.querySelector('#course-code').textContent = c.courseCode + ' - ' + course.name
          courseClone.querySelector('#course-credits').textContent = course.creditsPerSemester

          courseContainer.appendChild(courseClone)
        })

        container.appendChild(clone)
        document.querySelector('#loading-spinner').remove()

        document.querySelector('#export-btn').addEventListener('click', () => {
          let element = document.getElementById('container')
          let w = html2pdf().from(element).save(reportId)
          console.log(w)
        })
      },
    }
  }

  return {
    getInstance: function () {
      if (!instance) instance = create()
      // User.getAll()

      return instance
    },
  }
})()
