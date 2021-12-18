import { Assignment } from '../model/Assignment.js'
import { dialogs } from '../util/Utility.js'
import { createNotification } from '../util/Utility.js'
import { AssignmentAnswer, IndividualAnswer } from '../model/AssignmentAnswer.js'
import { ClassController } from './ClassController.js'
import { CourseController } from './coursecontroller.js'
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

      insertAssignment: async function (classId, deadlineDate, caseFile, title, assignmentType) {
        // if (answer.length < 5) {
        //   dialogs.alert('Answer must be at least 5 characters')
        //   return
        // }

        const asg = new Assignment('', classId, deadlineDate, title, caseFile, assignmentType)

        const success = asg.insert()

        if (success) {
          dialogs.alert('Create Assignment Success!', () => {
            location.reload()
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
