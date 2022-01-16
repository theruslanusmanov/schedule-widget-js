class Calendar extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'schedule-calendar');

    const ruler = document.createElement('div');
    wrapper.append(ruler);

    const message = document.createElement('span');
    message.innerText = 'Nothing Scheduled';
    wrapper.append(message);

    // Create some CSS to apply to the shadow dom
    const style = document.createElement('style');
    style.textContent = `
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
    `;

    this.shadowRoot.append(style, wrapper);
  }
}

customElements.define('schedule-calendar', Calendar);

const START_HOURS = 0;
const END_HOURS = 24;

const cursor = document.getElementById('cursor');
const info = document.getElementsByClassName(
  'schedule-container__info')[0];

function trackRulerCursor(rulerId) {
  const ruler = document.getElementById(rulerId);
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

export {
  trackRulerCursor,
  START_HOURS,
  END_HOURS,
  Calendar,
};
