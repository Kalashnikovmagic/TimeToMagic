const grid = document.getElementById('secret-grid');
const clock = document.getElementById('fake-clock');

let realDate = null;
let fakeDate = null;

let waitingForTap = false;
let animationStarted = false;

/* =========================
   ЖЁСТКАЯ БЛОКИРОВКА ЖЕСТОВ
========================= */

document.addEventListener('touchstart', e => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', e => {
  e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', e => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

/* =========================
   СЕКРЕТНЫЙ ВВОД 1–9
========================= */

grid.addEventListener('touchstart', (e) => {
  const cell = e.target.closest('.cell');
  if (!cell) return;

  const jumpMinutes = Number(cell.textContent);

  realDate = new Date();
  fakeDate = new Date(realDate.getTime());
  fakeDate.setMinutes(fakeDate.getMinutes() + jumpMinutes);

  updateClock(fakeDate);

  grid.style.display = 'none';
  clock.style.display = 'block';

  waitingForTap = true;
});

/* =========================
   ТАП ДЛЯ ЗАПУСКА МАГИИ
========================= */

document.addEventListener('touchstart', () => {
  if (!waitingForTap || animationStarted) return;

  waitingForTap = false;
  animationStarted = true;

  setTimeout(startReturnAnimation, 5000);
});

/* =========================
   ВОЗВРАТ ВРЕМЕНИ
========================= */

function startReturnAnimation() {
  const interval = setInterval(() => {
    fakeDate.setMinutes(fakeDate.getMinutes() - 1);
    updateClock(fakeDate);

    if (fakeDate.getTime() <= realDate.getTime()) {
      updateClock(realDate);
      clearInterval(interval);
    }
  }, 1000);
}

/* =========================
   ОБНОВЛЕНИЕ ЧАСОВ
========================= */

function updateClock(date) {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  clock.textContent = `${h}:${m}`;
}
