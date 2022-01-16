import { END_HOURS, START_HOURS, trackRulerCursor } from './modules/calendar.js'

// Add hours blocks in calendar ruler
const hours = document.getElementsByClassName(
  'schedule-calendar__ruler__hours')[0];
for (let i = 0; i < END_HOURS - START_HOURS; i++) {
  const li = document.createElement('li')
  hours.append(li)
}

// Add current time cursor
const ruler = document.getElementById('rulerId');
const cursor = document.createElement('div');
cursor.classList.add('current_cursor');
ruler.append(cursor);
const rect = ruler.getBoundingClientRect();
cursor.style.transform = `translateX(${rect.width / 2}px)`;

// Set mask of the rest of time


trackRulerCursor('rulerId')
