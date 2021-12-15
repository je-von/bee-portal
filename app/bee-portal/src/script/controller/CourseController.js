import { Course } from '../model/course.js'
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
    }
  }

  return {
    getInstance: function () {
      if (!instance) instance = create()
      return instance
    },
  }
})()
