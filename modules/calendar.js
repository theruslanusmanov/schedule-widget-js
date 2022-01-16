export const name = 'calendar'

const START_HOURS = 7;
const END_HOURS = 21;

function trackRulerCursor (rulerId) {
  const cursor = document.getElementById('cursor');

  const ruler = document.getElementById(rulerId);
  const rect = ruler.getBoundingClientRect();

  ruler.addEventListener('mouseenter', () => {
    cursor.style.display = 'block';
  })

  ruler.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
  })

  ruler.addEventListener('mousemove', event => {
    const position = event.clientX - rect.left;

    if (position > 0) {
      cursor.style.transform = `translateX(${position}px)`
    }
  });

  ruler.addEventListener('click', event => {
    const position = event.clientX - rect.left;
    console.log(`${Math.floor((position / rect.width) * 100)}%`);
  })
}

export {
  trackRulerCursor,
  START_HOURS,
  END_HOURS
}
