import { Major } from '../model/major.js'
import { Curriculum } from '../model/Curriculum.js'
import { CourseController } from './CourseController.js'
import { dialogs } from '../util/Utility.js'
//singleton
export const MajorController = (function () {
  var instance
  function create() {
    return {
      getMajor: async function (majorId) {
        const major = await Major.get(majorId)
        // console.log(major)
        return major
      },

      getAllMajor: async function () {
        const majors = await Major.getAll()
        return majors
      },

      showMajorDetailPage: async function (majorId) {
        const major = await this.getMajor(majorId)
        let template = document.getElementById('template')
        let container = document.getElementById('container')
        const clone = template.content.cloneNode(true)

        clone.querySelector('#major-name').textContent = major.name
        clone.querySelector('#total-credits').textContent = major.totalCredits + ' Credits'

        const curr = await Curriculum.getAll(majorId)

        for (const c of curr) {
          let semesterContainer = clone.querySelector('#accordion')
          let semesterTemplate = clone.querySelector('#semester-template')

          let semesterClone = semesterTemplate.content.cloneNode(true)

          semesterClone.querySelector('#semester-num').textContent = 'Semester ' + c.semester
          semesterClone.querySelector('#semester-num').setAttribute('data-target', '#semester' + c.semester)

          semesterClone.querySelector('#semester-content').setAttribute('id', 'semester' + c.semester)

          semesterClone.querySelector('#add-course-btn').setAttribute('href', './update.html?id=' + c.curriculumId)

          console.log(c.courseIds)
          for (const co of c.courseIds) {
            let course = await CourseController.getInstance().getCourseById(co)
            let courseContainer = semesterClone.querySelector('#course-container')
            let courseTemplate = semesterClone.querySelector('#course-template')

            let courseClone = courseTemplate.content.cloneNode(true)

            courseClone.querySelector('#course-name').textContent = co + ' - ' + course.name
            courseClone.querySelector('#course-credits').textContent = course.creditsPerSemester

            courseContainer.appendChild(courseClone)
          }

          semesterContainer.appendChild(semesterClone)
          console.log(c.semester)
        }

        clone.getElementById('add-semester-btn').addEventListener('click', async () => {
          dialogs.prompt('Input semester', (text) => {
            if (text != null) {
              let sem = parseInt(text)
              if (!sem) {
                dialogs.alert('Semester must be integer')
              } else {
                this.insertCurriculum(majorId, sem)
              }
            }
          })
        })

        container.appendChild(clone)

        document.querySelector('#loading-spinner').remove()
      },

      insertCurriculum: async function (majorId, semester) {
        let c = new Curriculum('', majorId, semester)
        let success = await c.insert()

        if (success) {
          dialogs.alert('Create success!', () => {
            location.reload()
          })
        } else {
          dialogs.alert('Create error!')
        }
      },

      showUpdateCurriculumPage: async function (curriculumId) {
        const c = await Curriculum.get(curriculumId)
        const major = await Major.get(c.majorId)
        let template = document.getElementById('template')
        let container = document.getElementById('container')
        const clone = template.content.cloneNode(true)

        clone.querySelector('#semester-num').textContent = c.semester
        clone.querySelector('#major-name').textContent = major.name

        let courses = await CourseController.getInstance().getAllCourses()

        courses.forEach(async (co) => {
          let opt = document.createElement('option')
          opt.setAttribute('value', co.courseCode)
          if (c.courseIds.includes(co.courseCode)) opt.setAttribute('selected', 'selected')

          opt.textContent = co.courseCode + ' - ' + co.name
          clone.querySelector('#course-list').appendChild(opt)
        })

        container.appendChild(clone)

        document.querySelector('#loading-spinner').remove()
      },

      updateCurriculum: async function (curriculumId, courseIds) {
        let c = new Curriculum(curriculumId, '', '', courseIds)
        let success = await c.update()

        if (success) {
          dialogs.alert('Update Success!', () => {
            history.back()
          })
        } else {
          dialogs.alert('Update error!')
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
