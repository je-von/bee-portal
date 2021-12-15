import { User } from '../model/user.js'
import { dialogs } from '../util/Utility.js'
import { createNotification } from '../util/Utility.js'
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

          createNotification('Welcome to bee-portal, ' + u.name + ' !')

          console.log(localStorage.getItem('currentUser'))
          window.location.assign('./home.html')
        } else {
          dialogs.alert('Email or password is incorrect!')
        }
      },

      getUserById: function (id) {
        return User.getById(id)
      },

      checkNotification: async function (id) {
        let u = await this.getUserById(id)
        console.log(u)
        let notif = await u.checkNotification()

        notif.forEach((n) => {
          createNotification(n)
        })
      },

      notify: async function (content, userId) {
        let u = await this.getUserById(userId)
        u.notify(content)
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
