export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const shifts = ['07.20 - 09.00', '09.20 - 11.00', '11.20 - 13.00', '13.20 - 15.00', '15.20 - 17.00', '17.20 - 19.00']

export function getSchedule(day, shift) {
  return days[day - 1] + ' ' + shifts[shift - 1]
}

const Dialogs = require('dialogs')
export const dialogs = new Dialogs()
export const yesNoDialogs = new Dialogs({ ok: 'YES', cancel: 'NO' })

export const routes = [
  {
    name: 'View All Classes',
    link: './class/view.html',
    roles: ['Student', 'Lecturer', 'Administrative Department'],
  },
  {
    name: 'View All Courses',
    link: './course/view.html',
    roles: ['Academic Department'],
  },
  {
    name: 'View Score',
    link: '',
    roles: ['Student', 'Lecturer', 'Scoring Department'],
  },
]

export function createNotification(content) {
  const notifier = require('node-notifier')
  const path = require('path')
  notifier.notify(
    {
      title: 'bee-portal',
      message: content,
      icon: path.join('', './src/logo/bee.png'),
      sound: true,
      wait: true,
    },
    function (err, response) {}
  )
}
