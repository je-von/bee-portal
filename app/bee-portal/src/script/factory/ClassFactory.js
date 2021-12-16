import { Class } from '../model/class.js'
export const ClassFactory = function () {
  this.createClass = function (doc) {
    const data = doc.data()
    const students = []
    if (data['students'] != null) {
      data['students'].forEach((s) => {
        students.push(s.id)
      })
    }

    const c = new Class(
      doc.id,
      data['classCode'],
      data['course'].id,
      students,
      data['lecturer'] != null ? data['lecturer'].id : '1',
      data['schedule'],
      data['runningPeriod']
    )

    return c
  }
}
