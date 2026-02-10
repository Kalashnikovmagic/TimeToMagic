// ================== БЛОКИРОВКА ЗУМА ==================

// защита от двойного тапа (double-tap zoom)
let lastTap = 0;
document.addEventListener("touchend", e => {
  const now = Date.now();
  if (now - lastTap < 300) e.preventDefault();
  lastTap = now;
}, { passive: false });

// pinch-zoom на iOS
document.addEventListener("gesturestart", e => e.preventDefault());

// ================== ПЕРЕМЕННЫЕ ==================
const secretGrid = document.getElementById("secret-grid");
const fakeClock = document.getElementById("fake-clock");

// Сразу скрываем часы на старте
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

  // скрываем сетку
  secretGrid.style.display = "none";

  // показываем часы только после выбора
  fakeClock.style.display = "flex";
  renderTime(fakeTime);

  state = "wait"; // ждем тап для запуска обратного отсчета
});

// ================== ТАП ДЛЯ ЗАПУСКА ==================
fakeClock.addEventListener("touchstart", () => {
  if (state !== "wait") return;

  state = "countdown";

  // через 5 секунд начинаем обратный отсчет
  setTimeout(startCountdown, 5000);
});

// ================== ОБРАТНЫЙ ОТСЧЁТ ==================
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

// ================== ОТОБРАЖЕНИЕ ВРЕМЕНИ ==================
function renderTime(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  fakeClock.textContent = `${h}:${m}`;
}
