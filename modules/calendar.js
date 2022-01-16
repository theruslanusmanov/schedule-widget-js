export const name = 'calendar'

function trackRulerCursor (rulerId) {
  const cursor = document.getElementById('cursor');
  const ruler = document.getElementById(rulerId);
  ruler.addEventListener('mousemove', (event) => {
    let rect = event.target.getBoundingClientRect();
    const position = event.clientX - rect.left;

    if (position > 0) {
      cursor.style.transform = `translateX(${position}px)`
    }
  })
}

export { trackRulerCursor }
