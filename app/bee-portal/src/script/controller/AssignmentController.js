import { Assignment } from '../model/Assignment.js'
import { dialogs } from '../util/Utility.js'
import { createNotification } from '../util/Utility.js'
import { AssignmentAnswer, IndividualAnswer } from '../model/AssignmentAnswer.js'
import { ClassController } from './ClassController.js'
import { CourseController } from './coursecontroller.js'
import { StudentGroupController } from './StudentGroupController.js'
//singleton
export const AssignmentController = (function () {
  var instance
  function create() {
    return {
      getAllAssignment: function (classId) {
        return Assignment.getAll(classId)
      },
      getAllIndividualStudentAnswer: function (assignmentId, studentId) {
        return IndividualAnswer.getAllStudentAnswer(assignmentId, studentId)
      },
      insertIndividualAnswer: async function (assignmentId, studentId, answer) {
        if (answer.length < 5) {
          dialogs.alert('Answer must be at least 5 characters')
          return
        }

        const ans = new IndividualAnswer('', assignmentId, answer, '', studentId)

        const success = await ans.insert()

        if (success) {
          dialogs.alert('Submit Success!', () => {
            location.reload()
          })
        } else {
          dialogs.alert('Submit error!')
        }
      },

      showInsertAssignmentPage: async function (classId) {
        const c = await ClassController.getInstance().getClassById(classId)
        const course = await CourseController.getInstance().getCourseById(c.courseCode)
        // console.log(c.classCode)

        let container = document.getElementById('container')
        let template = document.getElementById('assignment-template')

        let clone = template.content.cloneNode(true)

        clone.querySelector('#course-name').textContent = course.courseCode + ' - ' + course.name
        clone.querySelector('#class-code').textContent = c.classCode

        container.appendChild(clone)

        document.querySelector('#loading-spinner').remove()
      },

      insertAssignment: async function (classId, deadline, caseFile, title, assignmentType) {
        if (title.length < 5) {
          dialogs.alert('Assignment title must be at least 5 char!')
          return
        }
        if (caseFile.length < 5) {
          dialogs.alert('Assignment case must be at least 5 char!')
          return
        }
        if (!deadline.date || !deadline.time) {
          dialogs.alert('Deadline date and time must be chosen!')
          return
        }
        if (!assignmentType) {
          dialogs.alert('Assignment type must be chosen!')
          return
        }

        if (assignmentType == 'Group') {
          let groups = await StudentGroupController.getInstance().getAllStudentGroups(classId)
          if (!groups || groups.length < 1) {
            dialogs.alert('You must create student groups first before creating group assignment!')
            return
          }
        }

        let d = deadline.date.split('-')
        let t = deadline.time.split(':')

        const asg = new Assignment('', classId, new Date(d[0], d[1] - 1, d[2], t[0], t[1], 0, 0), title, caseFile, assignmentType)

        const success = await asg.insert()

        if (success) {
          dialogs.alert('Create Assignment Success!', () => {
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
