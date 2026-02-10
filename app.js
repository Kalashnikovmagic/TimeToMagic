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
const wallpaperInput = document.getElementById("wallpaperInput");

fakeClock.style.display = "none";

let realTime = null;
let fakeTime = null;
let state = "secret"; // secret → wait → countdown → finished
let chosenMinutes = 0;
let countdownInterval = null;

// ================== Секретная сетка ==================
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

// ================== Отображение времени с датой над часами ==================
function renderTime(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");

  const days = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
  const months = ["янв.","фев.","мар.","апр.","май","июн.","июл.","авг.","сен.","окт.","ноя.","дек."];

  const day = days[date.getDay()];
  const monthDay = `${date.getDate()} ${months[date.getMonth()]}`;

  fakeClock.querySelector(".date").textContent = `${day} ${monthDay}`;
  fakeClock.querySelector(".time").textContent = `${h}:${m}`;
}

// ================== Свайп 3 пальца для возврата/смены обоев ==================
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

  // Свайп вниз для возврата к сетке
  if (y - swipeStartY > 90 && state === "finished") {
    fakeClock.style.display = "none";
    secretGrid.style.display = "grid";
    state = "secret";
    swipeActive = false;
  }

  // Свайп вверх для выбора обоев
  if (swipeStartY - y > 90) {
    swipeActive = false;
    wallpaperInput.click();
  }

}, { passive: true });

document.addEventListener("touchend", e => {
  if (e.touches.length < 3) swipeActive = false;
});

// ================== Выбор обоев ==================
wallpaperInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    document.body.style.backgroundImage = `url('${e.target.result}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.transition = 'background-image 0.3s ease';
  }
  reader.readAsDataURL(file);
});
