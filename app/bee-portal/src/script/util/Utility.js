const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const shifts = ['07.20 - 09.00', '09.20 - 11.00', '11.20 - 13.00', '13.20 - 15.00', '15.20 - 17.00', '17.20 - 19.00']

export function getSchedule(day, shift) {
  return days[day - 1] + ' ' + shifts[shift - 1]
}

const Dialogs = require('dialogs')
export const dialogs = new Dialogs()
export const yesNoDialogs = new Dialogs({ ok: 'YES', cancel: 'NO' })
