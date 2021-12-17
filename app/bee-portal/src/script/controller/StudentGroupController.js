import { StudentGroup } from '../model/StudentGroup.js'
import { UserController } from './UserController.js'
import { ClassController } from './ClassController.js'
import { CourseController } from './CourseController.js'
import { dialogs } from '../util/Utility.js'
//singleton
export const StudentGroupController = (function () {
  var instance
  function create() {
    return {
      getAllStudentGroups: function (classId) {
        return StudentGroup.getAll(classId)
      },

      async showInsertStudentGroupPage(classId) {
        const groups = await this.getAllStudentGroups(classId)
        console.log(groups)

        const c = await ClassController.getInstance().getClassById(classId)
        let template = document.getElementById('class-template')
        let container = document.getElementById('container')
        const clone = template.content.cloneNode(true)

        const course = await CourseController.getInstance().getCourseById(c.courseCode)

        clone.querySelector('#course-name').textContent = c.courseCode + ' - ' + course.name
        clone.querySelector('#class-code').textContent = c.classCode

        let students = c.studentIds
        students.forEach(async (id) => {
          let flag = false
          groups.forEach((g) => {
            if (g.studentIds.includes(id)) {
              flag = true
            }
          })
          if (!flag) {
            let s = await UserController.getInstance().getUserById(id)

            let opt = document.createElement('option')
            opt.setAttribute('value', s.userId)

            opt.textContent = s.NIM + ' - ' + s.name
            document.querySelector('#class-students').appendChild(opt)
          }
        })

        container.appendChild(clone)

        document.querySelector('#loading-spinner').remove()
      },

      insertStudentGroup: async function (classId, studentIds) {
        const g = new StudentGroup('', classId, studentIds)

        const success = await g.insert()

        if (success) {
          dialogs.alert('Create Group Success!', () => {
            history.back()
          })
        } else {
          dialogs.alert('Create error!')
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
