const grid = document.getElementById('secret-grid');
const clock = document.getElementById('fake-clock');

/* ===== СОСТОЯНИЯ ===== */

let realTime = null;
let fakeTime = null;

let state = 'secret'; 
// secret → wait → countdown

/* ===== ПОЛНАЯ БЛОКИРОВКА ЖЕСТОВ ===== */

document.addEventListener('touchstart', e => {
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', e => {
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', e => {
  e.preventDefault();
}, { passive: false });

/* ===== СЕКРЕТНЫЙ ВВОД ===== */

grid.addEventListener('touchstart', e => {
  const cell = e.target.closest('.cell');
  if (!cell) return;

  const minutes = Number(cell.textContent);

  realTime = new Date();
  fakeTime = new Date(realTime.getTime());
  fakeTime.setMinutes(fakeTime.getMinutes() + minutes);

  renderTime(fakeTime);

  grid.style.display = 'none';
  clock.style.display = 'block';

  state = 'wait';
});

/* ===== ТАП ДЛЯ ЗАПУСКА ===== */

document.addEventListener('touchstart', () => {
  if (state !== 'wait') return;

  state = 'countdown';

  setTimeout(startCountdown, 5000);
});

/* ===== ОБРАТНЫЙ ОТСЧЁТ ===== */

function startCountdown() {
  const interval = setInterval(() => {
    fakeTime.setMinutes(fakeTime.getMinutes() - 1);
    renderTime(fakeTime);

    if (fakeTime.getTime() <= realTime.getTime()) {
      fakeTime = new Date(realTime.getTime());
      renderTime(fakeTime);
      clearInterval(interval);
    }
  }, 1000);
}

/* ===== РЕНДЕР ===== */

function renderTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  clock.textContent = `${h}:${m}`;
}
