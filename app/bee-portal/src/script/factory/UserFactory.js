import { User, Student, Lecturer } from '../model/user.js'

export const UserFactory = function () {
  this.createUser = function (doc) {
    let user

    const data = doc.data()
    if (data.role == 'Student') {
      user = new Student(doc.id, data['email'], data['password'], data['name'], data['role'], data['NIM'], data['enrolledYear'], data['major'].id)
    } else if (data.role == 'Lecturer') {
      user = new Lecturer(doc.id, data['email'], data['password'], data['name'], data['role'], data['lecturerCode'])
    } else {
      user = new User(doc.id, data['email'], data['password'], data['name'], data['role'])
    }

    return user
  }
}
