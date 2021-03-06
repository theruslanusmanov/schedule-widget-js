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
      box-sizing: border-box;
      padding: 16px 0;
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
    
    .schedule-calendar__timeline {
      display: flex;
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    
    .schedule-calendar__timeline li {
      position: absolute;
      width: 1px;
      height: 100%;
      background-color: rgb(22, 125, 255);
      left: 20px;
    }
    
    .schedule-calendar__events {
      box-sizing: border-box;
      list-style: none;
      padding: 0 16px;
      margin: 0;
      width: 100%;
    }
    
    .schedule-calendar__events li {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }
    
    .schedule-calendar__events li span {
      display: flex;
    }
    
    .schedule-calendar__events li span:only-child {
      width: 100%;
      justify-content: center;
    }
  </style>
  <div class="schedule-calendar">
    <div class="schedule-calendar__ruler" id="rulerId">
      <ul class="schedule-calendar__ruler__hours"></ul>
      <div class="schedule-calendar__ruler__rest-time"></div>
      <div id="cursor"></div>
      <ul class="schedule-calendar__timeline" id="timeline">
        <li class="schedule-calendar__timeline__event"></li>
      </ul>
    </div>
    <ul class="schedule-calendar__events" id="events">
      <li id="no-events-title"><span>Nothing Scheduled</span></li>
    </ul>
  </div>
`;

customElements.define('schedule-calendar', class Calendar extends HTMLElement {
  events = [
    /* {hour: 12, title: 'Event 1'},*/
  ];

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Add hours blocks in calendar ruler
    const hoursFragment = document.createDocumentFragment();
    const hours = this.shadowRoot.querySelectorAll(
      '.schedule-calendar__ruler__hours')[0];
    for (let i = 0; i < END_HOURS - START_HOURS; i++) {
      const li = document.createElement('li');
      hoursFragment.append(li);
    }
    hours.append(hoursFragment);

    // Add current time cursor
    const ruler = this.shadowRoot.getElementById('rulerId');
    const cursorEl = document.createElement('div');
    cursorEl.classList.add('current_cursor');
    ruler.append(cursorEl);
    const rect = ruler.getBoundingClientRect();
    cursorEl.style.transform = `translateX(${rect.width / 2}px)`;

    const oneHour = rect.width / (END_HOURS - START_HOURS);

    this.updateTimeline(oneHour);

    const setCursorPositionOnRuler = () => {
      // Set mask for the rest of time
      const currentDate = new Date();
      const currentHours = currentDate.getHours();
      const currentMinutes = currentDate.getMinutes();

      const oneHour = rect.width / (END_HOURS - START_HOURS);
      const oneMinute = (rect.width / (END_HOURS - START_HOURS)) / 60;
      const cursorPosition = (currentHours - START_HOURS) * oneHour +
        currentMinutes * oneMinute;

      cursorEl.style.transform = `translateX(${cursorPosition}px)`;

      const restTimeMask = this.shadowRoot.querySelectorAll(
        '.schedule-calendar__ruler__rest-time')[0];
      restTimeMask.style.width = `${rect.width - cursorPosition}px`;
    };

    setCursorPositionOnRuler();
    setInterval(() => {
      setCursorPositionOnRuler();
    }, 1000 * 60);

    const cursor = this.shadowRoot.getElementById('cursor');
    const info = document.getElementsByClassName('schedule-container__info')[0];

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
        const hours = (Math.floor(position / oneHour)).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
        });
        const minutes = (Math.floor(
          ((position / oneHour) % 1).toString().split('.')[1]?.substr(0, 2) *
          0.6)).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
        });
        info.innerHTML = `${hours}:${minutes}`;
      }
    });

    ruler.addEventListener('click', event => {
      const noEventsTitleElement = this.shadowRoot.getElementById(
        'no-events-title');
      if (noEventsTitleElement) noEventsTitleElement.remove();

      const position = event.clientX - rect.left;
      const hour = (Math.floor(position / oneHour)).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
      });

      const eventsElement = this.shadowRoot.getElementById('events');
      const li = document.createElement('li');
      li.innerHTML = `
        <span>Event</span>
        <span>${hour}:00 - ${+hour + 1}:00</span>
      `;
      eventsElement.append(li);

      this.events.push({hour, event: 'event'});
      this.updateTimeline(oneHour);
    });
  }

  /**
   * Updates timeline view.
   */
  updateTimeline(oneHour) {
    const events = this.events;
    const timeline = this.shadowRoot.getElementById('timeline');
    timeline.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < events.length; i++) {
      const li = document.createElement('li');
      li.style.width = `${oneHour}px`;
      li.style.left = `${events[i].hour * oneHour}px`;
      fragment.append(li);
    }
    timeline.append(fragment);
  }
});

