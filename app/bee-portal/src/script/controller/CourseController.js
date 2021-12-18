import { Course } from '../model/course.js'
import { Syllabus } from '../model/Syllabus.js'
import { dialogs } from '../util/Utility.js'
//singleton
export const CourseController = (function () {
  var instance
  function create() {
    return {
      getCourseById: async function (courseCode) {
        const course = await Course.get(courseCode)
        return course
      },
      getAllCourses: async function () {
        try {
          const courses = await Course.getAll()

          console.log(courses)
          return courses
        } catch (e) {
          console.log(e)
          return []
        }
      },
      showCourseDetailPage: async function (courseCode) {
        const c = await this.getCourseById(courseCode)
        let template = document.getElementById('template')
        let container = document.getElementById('container')
        const clone = template.content.cloneNode(true)

        clone.querySelector('#course-name').textContent = c.courseCode + ' - ' + c.name
        clone.querySelector('#course-credits').textContent = c.creditsPerSemester + ' Credits'

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

        container.appendChild(clone)

        document.querySelector('#loading-spinner').remove()
      },

      showInsertCourseForm: async function () {
        dialogs.prompt('Input course code', (code) => {
          if (code != null) {
            if (code.length != 8) {
              dialogs.alert('Course code must be 8 characters')
            } else {
              dialogs.prompt('Input course name', (name) => {
                if (name != null) {
                  dialogs.prompt('Input course credits per semester', async (c) => {
                    let credits = parseInt(c)
                    if (!credits) {
                      dialogs.alert('Credits must be integer')
                    } else {
                      let c = new Course(code, name, credits)
                      let success = await c.insert()

                      if (success) {
                        dialogs.alert('Create course success!', () => {
                          location.reload()
                        })
                      } else {
                        dialogs.alert('Create course error!')
                      }
                    }
                  })
                }
              })
            }
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
