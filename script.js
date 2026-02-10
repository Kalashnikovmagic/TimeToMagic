const grid = document.getElementById('secret-grid');
const clock = document.getElementById('fake-clock');

grid.addEventListener('click', (e) => {
  if (!e.target.classList.contains('cell')) return;

  const jumpMinutes = Number(e.target.textContent);
  showFakeTime(jumpMinutes);
});

function showFakeTime(jumpMinutes) {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes() + jumpMinutes;

  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  hours = hours % 24;

  clock.textContent = `${pad(hours)}:${pad(minutes)}`;

  // мгновенный переход
  grid.style.display = 'none';
  clock.style.display = 'block';
}

function pad(value) {
  return value.toString().padStart(2, '0');
}
