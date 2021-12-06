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
    }
  }

  return {
    getInstance: function () {
      if (!instance) instance = create()
      return instance
    },
  }
})()
