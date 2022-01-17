const START_HOURS = 0;
const END_HOURS = 24;

const template = document.createElement('template');
template.innerHTML = `
  <style>
    .schedule-calendar {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 382px;
      height: 91px;
      border: 1px solid var(--separator-accent-color);
      border-radius: 4px;
      background-color: var(--island-background-color);
    }
    
    span {
      color: var(--secondary-text-color);
    }
    
    .schedule-calendar__ruler {
        position: relative;
        height: 29px;
        width: 100%;
        cursor: pointer;
    }
    
    .schedule-calendar__ruler__hours {
        height: 100%;
        padding: 0;
        margin: 0;
        position: absolute;
        list-style: none;
        display: flex;
        width: 100%;
        gap: 1px;
    }
    
    .schedule-calendar__ruler__hours li {
        background-color: rgb(56, 59, 62);
        flex: 1;
        pointer-events: none;
    }
    
    .schedule-calendar__ruler__rest-time {
        position: absolute;
        right: 0;
        width: 50%;
        height: 100%;
        background-color: rgba(22, 125, 255, 0.2);
    }
    
    #cursor {
        display: none;
        position: absolute;
        width: 1px;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.5);
    }
    
    .current_cursor {
        position: absolute;
        width: 1px;
        height: 100%;
        background-color: white;
    }
    
    .schedule-container__info {
        visibility: hidden;
        padding: 4px 12px;
        margin-top: 24px;
        width: 80px;
        height: 25px;
        background-color: black;
        border: 1px solid var(--separator-accent-color);
        border-radius: 4px;
        font-size: 12pt;
        display: flex;
        align-items: center;
    }
    
    .schedule-calendar__event {
        position: absolute;
        width: 20px;
        height: 100%;
        background-color: rgb(22, 125, 255);;
        left: 20px;
    }
  </style>
  <div class="schedule-calendar">
    <div class="schedule-calendar__ruler" id="rulerId">
      <ul class="schedule-calendar__ruler__hours"></ul>
      <div class="schedule-calendar__ruler__rest-time"></div>
      <div id="cursor"></div>
      <div class="schedule-calendar__event"></div>
    </div>
    <span>Nothing Scheduled</span>
  </div>
`;

customElements.define('schedule-calendar', class Calendar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Add hours blocks in calendar ruler
    const hoursFragment = document.createDocumentFragment();
    const hours = this.shadowRoot.querySelectorAll(
      '.schedule-calendar__ruler__hours')[0]
    for (let i = 0; i < END_HOURS - START_HOURS; i++) {
      const li = document.createElement('li')
      hoursFragment.append(li)
    }
    hours.append(hoursFragment);

    // Add current time cursor
    const ruler = this.shadowRoot.getElementById('rulerId')
    const cursorEl = document.createElement('div')
    cursorEl.classList.add('current_cursor')
    ruler.append(cursorEl)
    const rect = ruler.getBoundingClientRect()
    cursorEl.style.transform = `translateX(${rect.width / 2}px)`

    const setCursorPositionOnRuler = () => {
      // Set mask for the rest of time
      const currentDate = new Date()
      const currentHours = currentDate.getHours()
      const currentMinutes = currentDate.getMinutes()

      const oneHour = rect.width / (END_HOURS - START_HOURS)
      const oneMinute = (rect.width / (END_HOURS - START_HOURS)) / 60
      const cursorPosition = (currentHours - START_HOURS) * oneHour +
        currentMinutes * oneMinute

      cursorEl.style.transform = `translateX(${cursorPosition}px)`

      const restTimeMask = this.shadowRoot.querySelectorAll(
        '.schedule-calendar__ruler__rest-time')[0]
      restTimeMask.style.width = `${rect.width - cursorPosition}px`
    }

    setCursorPositionOnRuler()
    setInterval(() => {
      setCursorPositionOnRuler()
    }, 1000 * 60);

    const cursor = this.shadowRoot.getElementById('cursor');
    const info = document.getElementsByClassName('schedule-container__info')[0];

    const trackRulerCursor = (rulerId) => {
      const ruler = this.shadowRoot.getElementById(rulerId);
      const rect = ruler.getBoundingClientRect();

      ruler.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
        info.style.visibility = 'visible';
      });

      ruler.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
        info.style.visibility = 'hidden';
      });

      ruler.addEventListener('mousemove', event => {
        const position = event.clientX - rect.left;

        if (position > 0) {
          cursor.style.transform = `translateX(${position}px)`;

          // Calculate time
          const percentage = position / rect.width;
          const oneHour = rect.width / (END_HOURS - START_HOURS);
          const hours = (Math.floor(position / oneHour)).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
          });
          const minutes = (Math.floor(
            ((position / oneHour) % 1).toString().split('.')[1]?.substr(0, 2) *
            0.6)).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
          });
          const time = `${hours}:${minutes}`;

          info.innerHTML = time;
        }
      });

      ruler.addEventListener('click', event => {
        const position = event.clientX - rect.left;
        console.log(`${Math.floor((position / rect.width) * 100)}%`);
      });
    }

    trackRulerCursor('rulerId')
  }
});

