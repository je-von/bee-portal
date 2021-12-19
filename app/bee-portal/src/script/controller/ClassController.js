import { Class } from '../model/class.js'
import { CourseController } from './coursecontroller.js'
import { UserController } from './UserController.js'
import { Syllabus } from '../model/Syllabus.js'
import { getSchedule } from '../util/Utility.js'
import { ForumController } from './ForumController.js'
import { MajorController } from './majorcontroller.js'
import { days, shifts, dialogs } from '../util/Utility.js'
import { StudentGroup } from '../model/StudentGroup.js'
import { AssignmentController } from './AssignmentController.js'
import { StudentGroupController } from './StudentGroupController.js'

// import { IndividualAnswer } from '../model/AssignmentAnswer.js'

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
          // console.log(classes)
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

      showClassDetailPage: async function (classId, userId) {
        const currentUser = await UserController.getInstance().getUserById(userId)

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
        // console.log(syllabus)
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
        if (currentUser.role === 'Administrative Department') {
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
          // console.log(forums)

          for (const f of forums) {
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
          }

          //group tab
          if (currentUser.role !== 'Lecturer') {
            clone.querySelector('#create-group-btn').remove()
          } else {
            clone.querySelector('#create-group-btn').setAttribute('href', '../group/insert.html?id=' + classId)
          }

          const groups = await StudentGroup.getAll(classId)
          let i = 1
          groups.forEach(async (g) => {
            let groupContainer = clone.getElementById('group-container')
            let template = clone.getElementById('group-template')

            let groupClone = template.content.cloneNode(true)

            groupClone.querySelector('#group-num').textContent = 'Group ' + i

            g.studentIds.forEach(async (gs) => {
              let memberContainer = groupClone.getElementById('group-member-container')
              let memberTemplate = groupClone.getElementById('member-template')

              let m = memberTemplate.content.cloneNode(true)

              const user = await UserController.getInstance().getUserById(gs)
              m.querySelector('#member').textContent = user.NIM + ' - ' + user.name

              memberContainer.appendChild(m)
            })

            groupContainer.appendChild(groupClone)
            i++
          })

          //assignment tab
          if (currentUser.role == 'Lecturer') {
            clone.querySelector('#create-assignment-btn').setAttribute('href', '../assignment/insert.html?id=' + classId)
          } else {
            clone.querySelector('#create-assignment-btn').remove()
          }
          let asg = await AssignmentController.getInstance().getAllAssignment(classId)
          // console.log(asg)

          // console.log(a)
          let j = 0
          asg.forEach(async (a) => {
            j++
            let assignmentContainer = clone.getElementById('assignment')
            let template = clone.getElementById('assignment-template')

            let assignmentClone = template.content.cloneNode(true)

            assignmentClone.querySelector('#assignment-title').textContent = a.title

            let d = new Date(a.deadlineDate.seconds * 1000)
            assignmentClone.querySelector('#assignment-date').textContent = 'Deadline: ' + d.toLocaleString()
            let type = document.createElement('i')
            type.textContent = ' • ' + a.assignmentType
            assignmentClone.querySelector('#assignment-date').appendChild(type)

            if (currentUser.role == 'Student') {
              assignmentClone.querySelector('#view-assignment-btn').addEventListener('click', async () => {
                dialogs.alert(a.caseFile)
              })

              // let g = StudentGroupController.getInstance().getStudentGroupByStudentId(classId, currentUser.userId)

              if (d < Date.now()) {
                assignmentClone.querySelector('#submit-assignment-btn').remove()
              } else {
                assignmentClone.querySelector('#submit-assignment-btn').addEventListener('click', async () => {
                  dialogs.prompt('Write your answer', async (text) => {
                    if (text != null) {
                      if (a.assignmentType == 'Individual') {
                        await AssignmentController.getInstance().insertIndividualAnswer(a.assignmentId, currentUser.userId, text)
                      } else {
                        let g = await StudentGroupController.getInstance().getStudentGroupByStudentId(classId, currentUser.userId)
                        if (!g) {
                          dialogs.alert("You don't have any group yet!")
                        } else {
                          await AssignmentController.getInstance().insertGroupAnswer(a.assignmentId, g.groupId, text)
                        }
                      }
                    }
                  })
                })
              }
              assignmentClone.querySelector('#history-assignment-btn').setAttribute('data-target', '#asg' + j)
              assignmentClone.querySelector('#assignment-ans-container').setAttribute('id', 'asg' + j)
              let g = await StudentGroupController.getInstance().getStudentGroupByStudentId(classId, currentUser.userId)
              console.log(g)
              let answers = await (a.assignmentType == 'Individual'
                ? AssignmentController.getInstance().getAllIndividualStudentAnswer(a.assignmentId, currentUser.userId)
                : g != null
                ? AssignmentController.getInstance().getAllGroupAnswer(a.assignmentId, await g.groupId)
                : [])
              console.log(a.title + ' - ' + answers)
              // if (a.assignmentType == 'Individual') {
              //   answers = await AssignmentController.getInstance().getAllIndividualStudentAnswer(a.assignmentId, currentUser.userId)
              // } else {
              //   answers = await AssignmentController.getInstance().getAllGroupAnswer(a.assignmentId, await g.groupId)
              // }
              answers.forEach((ans) => {
                let ansContainer = assignmentClone.getElementById('answer-container')
                let ansTemplate = assignmentClone.getElementById('answer-template')

                let ansClone = ansTemplate.content.cloneNode(true)
                ansClone.querySelector('#answer-content').textContent = ans.answerFile
                ansClone.querySelector('#upload-date').textContent = new Date(ans.uploadDate.seconds * 1000).toLocaleString()

                ansContainer.appendChild(ansClone)
              })
              assignmentClone.querySelector('#history-assignment-btn').addEventListener('click', async () => {})
            } else {
              assignmentClone.querySelector('#view-assignment-btn').addEventListener('click', async () => {
                //view all answer
                dialogs.alert(a.caseFile)
              })
              assignmentClone.querySelector('#submit-assignment-btn').remove()
              assignmentClone.querySelector('#history-assignment-btn').remove()
            }

            assignmentContainer.appendChild(assignmentClone)
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
        if (classCode.length !== 4) {
          dialogs.alert('Class code must be 4 characters!')
          return
        }
        if (!courseCode) {
          dialogs.alert('Course code must be chosen!')
          return
        }
        if (!schedule.day || !schedule.shift) {
          dialogs.alert('Schedule day and shift be chosen!')
          return
        }
        if (!runningPeriod.year || !runningPeriod.semester) {
          dialogs.alert('Year and semester be chosen!')
          return
        }

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
