import { Major } from '../model/major.js'
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
    }
  }

  return {
    getInstance: function () {
      if (!instance) instance = create()
      return instance
    },
  }
})()
