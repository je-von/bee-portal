import { User } from '../model/user.js'
import { dialogs } from '../util/Utility.js'
//singleton
export const UserController = (function () {
  var instance
  function create() {
    return {
      auth: async function (email, password) {
        if (!email || !password) {
          dialogs.alert('Email and password must be filled!')
          return
        }

        const u = await User.auth(email, password)
        if (u != null) {
          localStorage.setItem('currentUser', u.userId)
          console.log(localStorage.getItem('currentUser'))
          window.location.assign('./home.html')
        } else {
          dialogs.alert('Email or password is incorrect!')
        }
      },

      getUserById: function (id) {
        return User.getById(id)
      },

      getAllUsersByRole: function (role) {},
    }
  }

  return {
    getInstance: function () {
      if (!instance) instance = create()
      // User.getAll()

      return instance
    },
  }
})()
