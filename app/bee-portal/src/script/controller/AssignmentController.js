import { Assignment } from '../model/Assignment.js'
import { dialogs } from '../util/Utility.js'
import { createNotification } from '../util/Utility.js'
//singleton
export const AssignmentController = (function () {
  var instance
  function create() {
    return {
      getAllAssignment: function (classId) {
        return Assignment.getAll(classId)
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
