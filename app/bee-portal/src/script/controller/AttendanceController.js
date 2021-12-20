import { Attendance } from '../model/Attendance.js'
import { UserController } from './UserController.js'
import { ClassController } from './ClassController.js'
import { dialogs } from '../util/Utility.js'
export const AttendanceController = (function () {
  var instance
  function create() {
    return {
      getAllAttendanceByClassSession: function (classId, session) {
        return Attendance.getAllByClassSession(classId, session)
      },
      getAllAttendanceByClassStudent: function (classId, studentId) {
        return Attendance.getAllByClassStudent(classId, studentId)
      },
      showAttendancePage: async function (classId, session) {
        const c = await ClassController.getInstance().getClassById(classId)
        const att = await this.getAllAttendanceByClassSession(classId, session)
        // console.log(att)

        let container = document.querySelector('#container')
        let template = document.querySelector('#attendance-template')

        let clone = template.content.cloneNode(true)

        clone.querySelector('#course-name').textContent = c.courseCode
        clone.querySelector('#class-code').textContent = c.classCode
        clone.querySelector('#session-num').textContent = 'Session ' + session

        let i = 1
        for (const s of c.studentIds) {
          const student = await UserController.getInstance().getUserById(s)
          let studentContainer = clone.getElementById('student-container')
          let row = clone.getElementById('student-template')
          const rowClone = row.content.cloneNode(true)

          rowClone.querySelector('#student-index').textContent = i
          rowClone.querySelector('#student-name').textContent = student.name
          rowClone.querySelector('#student-nim').textContent = student.NIM

          if (att.find((a) => a.studentId == s && a.isPresent)) {
            rowClone.querySelector('#is-present').checked = true
          }

          rowClone.querySelector('#is-present').setAttribute('id', s)

          studentContainer.appendChild(rowClone)
          i++
        }
        container.appendChild(clone)

        document.querySelector('#loading-spinner').remove()

        document.querySelector('#present-all-btn').addEventListener('click', () => {
          let check = document.getElementsByName('attendance-check')
          for (const chk of check) chk.checked = document.querySelector('#present-all-btn').checked
        })

        document.getElementById('save-btn').addEventListener('click', async () => {
          let count = 0
          for (const s of c.studentIds) {
            let isPresent = document.getElementById(s).checked
            // console.log(s + ' -> ' + isPresent)

            let studentAttendance = att.find((a) => a.studentId == s)
            let success
            if (studentAttendance) {
              //update
              //   console.log(studentAttendance.attendanceId)
              studentAttendance.isPresent = isPresent
              success = await studentAttendance.update()
              if (success) {
                count++
              }
            } else {
              //insert
              studentAttendance = new Attendance('', classId, s, session, isPresent)
              success = await studentAttendance.insert()
              if (success) {
                count++
              }
            }
          }
          if (count == c.studentIds.length) {
            dialogs.alert('Save attendance success!', () => {
              location.reload()
            })
          } else {
            dialogs.alert('Save attendance error!')
          }
        })
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
