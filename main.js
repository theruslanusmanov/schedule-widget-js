import  './src/calendar.js'

/*// Add hours blocks in calendar ruler
const hoursFragment = document.createDocumentFragment();
const hours = document.getElementsByClassName(
  'schedule-calendar__ruler__hours')[0]
for (let i = 0; i < END_HOURS - START_HOURS; i++) {
  const li = document.createElement('li')
  hoursFragment.append(li)
}
hours.append(hoursFragment);*/

/*// Add current time cursor
const ruler = document.getElementById('rulerId')
const cursor = document.createElement('div')
cursor.classList.add('current_cursor')
ruler.append(cursor)
const rect = ruler.getBoundingClientRect()
cursor.style.transform = `translateX(${rect.width / 2}px)`

setCursorPositionOnRuler()
setInterval(() => {
  setCursorPositionOnRuler()
}, 1000 * 60)

function setCursorPositionOnRuler () {
  // Set mask for the rest of time
  const currentDate = new Date()
  const currentHours = currentDate.getHours()
  const currentMinutes = currentDate.getMinutes()

  const oneHour = rect.width / (END_HOURS - START_HOURS)
  const oneMinute = (rect.width / (END_HOURS - START_HOURS)) / 60
  const cursorPosition = (currentHours - START_HOURS) * oneHour +
    currentMinutes * oneMinute

  cursor.style.transform = `translateX(${cursorPosition}px)`

  const restTimeMask = document.getElementsByClassName(
    'schedule-calendar__ruler__rest-time')[0]
  restTimeMask.style.width = `${rect.width - cursorPosition}px`
}*/

/*trackRulerCursor('rulerId')*/
