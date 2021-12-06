import { Class } from '../model/class.js'
import { CourseController } from './coursecontroller.js'
import { UserController } from './UserController.js'
import { Syllabus } from '../model/Syllabus.js'

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
          classes.forEach(async (c) => {
            //   console.log('jkl')
            let card = document.getElementById('card-template')
            let container = document.getElementById('container')

            // console.log(card)

            const clone = card.content.cloneNode(true)

            //   const course = await Class.convertCourse(c.courseCode)
            //   console.log(course)

            //   const lecturer = await UserController.getInstance().getUserById(
            //     c.lecturerId
            //   )

            const course = await CourseController.getInstance().getCourseById(c.courseCode)

            clone.querySelector('#course-name').textContent = course.name
            clone.querySelector('#course-code').textContent = c.courseCode
            clone.querySelector('#class-code').textContent = c.classCode
            clone.querySelector('#running-period').textContent = c.runningPeriod.year + ', ' + c.runningPeriod.semester + ' Semester'

            clone.querySelector('#detail-btn').setAttribute('href', './detail.html?id=' + c.classId)

            container.appendChild(clone)

            document.querySelector('#loading-spinner').remove()
          })
        } catch (e) {
          console.log(e)
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

        // console.log(card)

        const clone = template.content.cloneNode(true)

        //   const course = await Class.convertCourse(c.courseCode)
        //   console.log(course)

        //   const lecturer = await UserController.getInstance().getUserById(
        //     c.lecturerId
        //   )

        const course = await CourseController.getInstance().getCourseById(c.courseCode)

        clone.querySelector('#course-name').textContent = c.courseCode + ' - ' + course.name
        clone.querySelector('#class-code').textContent = c.classCode

        const lecturer = await UserController.getInstance().getUserById(c.lecturerId)

        clone.querySelector('#lecturer-name').textContent = lecturer.lecturerCode + ' - ' + lecturer.name

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

        container.appendChild(clone)

        const syllabus = await Syllabus.getAll(c.courseCode)
        console.log(syllabus)

        syllabus.forEach((s) => {
          let syllabusContainer = document.getElementById('syllabus-container')

          let row = document.getElementById('syllabus-template')

          const rowClone = row.content.cloneNode(true)

          rowClone.querySelector('#syllabus-session').textContent = 'Session ' + s.session
          rowClone.querySelector('#syllabus-topic').textContent = s.courseOutline.topic

          s.courseOutline.subtopic.forEach((st) => {
            let subContainer = rowClone.getElementById('sub-container')
            let list = rowClone.getElementById('sub-template')

            console.log(subContainer)

            const listClone = list.content.cloneNode(true)

            listClone.querySelector('#subtopic').textContent = st

            subContainer.appendChild(listClone)
          })

          syllabusContainer.appendChild(rowClone)
        })

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
