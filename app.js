// ================== Блокировка зума ==================
let lastTap = 0;
document.addEventListener("touchend", e => {
  const now = Date.now();
  if (now - lastTap < 300) e.preventDefault();
  lastTap = now;
}, { passive: false });

document.addEventListener("gesturestart", e => e.preventDefault());

// ================== Переменные ==================
const secretGrid = document.getElementById("secret-grid");
const fakeClock = document.getElementById("fake-clock");

fakeClock.style.display = "none";

let realTime = null;
let fakeTime = null;
let state = "secret"; // secret → wait → countdown → finished
let chosenMinutes = 0;
let countdownInterval = null;

let extraMinuteMode = false; // <-- индикатор +1 минуты

// ================== Секретная сетка ==================
secretGrid.addEventListener("touchstart", e => {
  if (e.touches.length !== 1) return;

  const touch = e.touches[0];
  const cell = document.elementFromPoint(touch.clientX, touch.clientY)?.closest(".cell");
  if (!cell) return;

  chosenMinutes = Number(cell.textContent);

  realTime = new Date();
  fakeTime = new Date(realTime.getTime());

  // ===== Проверка на +1 минуту =====
  const secondsLeft = 60 - realTime.getSeconds();
  extraMinuteMode = false;

  if (secondsLeft < 20) {
    fakeTime.setMinutes(fakeTime.getMinutes() + 1);
    extraMinuteMode = true;
  }

  fakeTime.setMinutes(fakeTime.getMinutes() + chosenMinutes);

  secretGrid.style.display = "none";
  fakeClock.style.display = "flex";

  renderTime(fakeTime);

  state = "wait";
});

// ================== Тап для запуска обратного отсчёта ==================
fakeClock.addEventListener("touchstart", () => {
  if (state !== "wait") return;

  state = "countdown";
  setTimeout(startCountdown, 5000);
});

// ================== Обратный отсчёт ==================
function startCountdown() {
  countdownInterval = setInterval(() => {
    fakeTime.setMinutes(fakeTime.getMinutes() - 1);
    renderTime(fakeTime);

    if (fakeTime.getTime() <= realTime.getTime()) {
      fakeTime = new Date(realTime.getTime());
      renderTime(fakeTime);
      clearInterval(countdownInterval);
      countdownInterval = null;
      state = "finished";
    }
  }, 1000);
}

// ================== Отображение времени ==================
function renderTime(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");

  const days = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
  const months = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];

  const day = days[date.getDay()];
  const monthDay = `${date.getDate()} ${months[date.getMonth()]}`;

  const dateText = extraMinuteMode
    ? `${day} ${monthDay}.`
    : `${day} ${monthDay}`;

  fakeClock.querySelector(".date").textContent = dateText;
  fakeClock.querySelector(".time").textContent = `${h}:${m}`;
}

// ================== Свайп 3 пальца вниз ==================
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
    fakeClock.style.display = "none";
    secretGrid.style.display = "grid";
    state = "secret";
    swipeActive = false;
    e.preventDefault();
  }

}, { passive: false });

document.addEventListener("touchend", e => {
  if (e.touches.length < 3) swipeActive = false;
});
