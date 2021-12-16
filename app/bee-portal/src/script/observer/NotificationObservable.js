import { UserController } from '../controller/UserController.js'

export function Observable() {
  this.observers = []
}

Observable.prototype = {
  subscribe: function (user) {
    this.observers.push(user)
  },

  unsubscribe: function (user) {
    this.observers = this.observers.filter(function (o) {
      if (o !== user) {
        return o
      }
    })
  },

  notifySubscribers: function (notifContent, userId) {
    this.observers.forEach(function (o) {
      if (o != userId) {
        UserController.getInstance().notify(notifContent, o)
      }
    })
  },
}
