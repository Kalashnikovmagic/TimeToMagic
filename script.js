const grid = document.getElementById('secret-grid');
const clock = document.getElementById('fake-clock');

let fakeDate = null;
let realDate = null;
let waitingForTap = false;
let animationStarted = false;

/* Блокируем жесты */
['touchmove', 'gesturestart', 'gesturechange'].forEach(event =>
  document.addEventListener(event, e => e.preventDefault(), { passive: false })
);

/* Секретный ввод */
grid.addEventListener('click', (e) => {
  if (!e.target.classList.contains('cell')) return;

  const jumpMinutes = Number(e.target.textContent);

  realDate = new Date();
  fakeDate = new Date(realDate.getTime());
  fakeDate.setMinutes(fakeDate.getMinutes() + jumpMinutes);

  updateClock(fakeDate);

  grid.style.display = 'none';
  clock.style.display = 'block';

  waitingForTap = true;
});

/* Тап для запуска магии */
document.addEventListener('click', () => {
  if (!waitingForTap || animationStarted) return;

  waitingForTap = false;
  animationStarted = true;

  setTimeout(startReturnAnimation, 5000);
});

/* Анимация возврата */
function startReturnAnimation() {
  const interval = setInterval(() => {
    fakeDate.setMinutes(fakeDate.getMinutes() - 1);
    updateClock(fakeDate);

    if (fakeDate <= realDate) {
      updateClock(realDate);
      clearInterval(interval);
    }
  }, 1000);
}

/* Обновление часов */
function updateClock(date) {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  clock.textContent = `${h}:${m}`;
}
