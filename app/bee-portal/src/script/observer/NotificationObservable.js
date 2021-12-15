export function Observable() {
  this.observers = []
}

Observable.prototype = {
  subscribe: function (user) {
    this.observers.push(user)
  },

  unsubscribe: function (user) {
    this.observers = this.observers.filter(function (item) {
      if (item !== user) {
        return item
      }
    })
  },

  notifyAll: function (o, thisObj) {
    this.observers.forEach(function (o) {})
  },
}
