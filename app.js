// ================== БЛОКИРОВКА ЗУМА ==================
let lastTap = 0;
document.addEventListener("touchend", e => {
  const now = Date.now();
  if (now - lastTap < 300) e.preventDefault();
  lastTap = now;
}, { passive: false });

document.addEventListener("gesturestart", e => e.preventDefault());

// ================== ПЕРЕМЕННЫЕ ==================
const secretGrid = document.getElementById("secret-grid");
const fakeClock = document.getElementById("fake-clock");

// скрываем часы на старте
fakeClock.style.display = "none";

let realTime = null;
let fakeTime = null;
let state = "secret"; // secret → wait → countdown
let chosenMinutes = 0;

// ================== СЕКРЕТНАЯ СЕТКА ==================
secretGrid.addEventListener("touchstart", e => {
  const cell = e.target.closest(".cell");
  if (!cell) return;

  chosenMinutes = Number(cell.textContent);

  realTime = new Date();
  fakeTime = new Date(realTime.getTime());
  fakeTime.setMinutes(fakeTime.getMinutes() + chosenMinutes);

  secretGrid.style.display = "none";
  fakeClock.style.display = "flex";

  renderTime(fakeTime);

  state = "wait";
});

// ================== ТАП ДЛЯ ЗАПУСКА ==================
fakeClock.addEventListener("touchstart", () => {
  if (state !== "wait") return;

  state = "countdown";

  setTimeout(startCountdown, 5000);
});

// ================== ОБРАТНЫЙ ОТСЧЁТ ==================
let countdownInterval = null;
function startCountdown() {
  countdownInterval = setInterval(() => {
    fakeTime.setMinutes(fakeTime.getMinutes() - 1);
    renderTime(fakeTime);

    if (fakeTime.getTime() <= realTime.getTime()) {
      fakeTime = new Date(realTime.getTime());
      renderTime(fakeTime);
      clearInterval(countdownInterval);
      countdownInterval = null;
      state = "finished"; // обратный отсчёт завершён
    }
  }, 1000);
}

// ================== ОТОБРАЖЕНИЕ ВРЕМЕНИ ==================
function renderTime(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  fakeClock.textContent = `${h}:${m}`;
}

// ================== СВАЙП 3 ПАЛЬЦА ВНИЗ ==================
let swipeStartY = null;
let swipeActive = false;

document.addEventListener("touchstart", e => {
  if (e.touches.length === 3) {
    swipeActive = true;
    swipeStartY = (e.touches[0].clientY + e.touches[1].clientY + e.touches[2].clientY) / 3;
  }
}, { passive: true });

document.addEventListener("touchmove", e => {
  if (!swipeActive || e.touches.length !== 3) return;

  const y = (e.touches[0].clientY + e.touches[1].clientY + e.touches[2].clientY) / 3;
  if (y - swipeStartY > 90 && state === "finished") {
    // возвращаемся на первый экран
    fakeClock.style.display = "none";
    secretGrid.style.display = "grid";
    state = "secret";
    swipeActive = false;
  }
}, { passive: true });

document.addEventListener("touchend", e => {
  if (e.touches.length < 3) swipeActive = false;
});
