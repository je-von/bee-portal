import { Major } from '../model/major.js'
import { Curriculum } from '../model/Curriculum.js'
import { CourseController } from './CourseController.js'
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
        curr.forEach(async (c) => {
          let semesterContainer = clone.querySelector('#accordion')
          let semesterTemplate = clone.querySelector('#semester-template')

          let semesterClone = semesterTemplate.content.cloneNode(true)

          semesterClone.querySelector('#semester-num').textContent = 'Semester ' + c.semester
          semesterClone.querySelector('#semester-num').setAttribute('data-target', '#semester' + c.semester)

          semesterClone.querySelector('#semester-content').setAttribute('id', 'semester' + c.semester)

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
        })

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
