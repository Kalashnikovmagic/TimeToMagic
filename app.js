let lastTap = 0;

document.addEventListener("touchend", event => {
  const now = Date.now();
  if (now - lastTap < 300) event.preventDefault();
  lastTap = now;
}, { passive: false });

document.addEventListener("gesturestart", event => event.preventDefault());

const secretGrid = document.getElementById("secret-grid");
const fakeClock = document.getElementById("fake-clock");

let fakeTime = null;
let state = "secret";
let chosenMinutes = 0;
let countdownInterval = null;
let extraMinuteMode = false;
let targetTime = null;

secretGrid.addEventListener("touchstart", event => {
  if (event.touches.length !== 1) return;

  const touch = event.touches[0];
  const cell = document.elementFromPoint(touch.clientX, touch.clientY)?.closest(".cell");
  if (!cell) return;

  chosenMinutes = Number(cell.textContent);

  const realTime = new Date();
  const secondsLeft = 60 - realTime.getSeconds();

  extraMinuteMode = secondsLeft < 20;
  targetTime = new Date(realTime.getTime());

  if (extraMinuteMode) {
    targetTime.setMinutes(targetTime.getMinutes() + 1);
  }

  fakeTime = new Date(targetTime.getTime());
  fakeTime.setMinutes(fakeTime.getMinutes() + chosenMinutes);

  secretGrid.style.display = "none";
  fakeClock.style.display = "flex";
  renderTime(fakeTime);
  state = "wait";
});

fakeClock.addEventListener("touchstart", () => {
  if (state !== "wait") return;

  state = "countdown";
  setTimeout(startCountdown, 5000);
});

function startCountdown() {
  countdownInterval = setInterval(() => {
    fakeTime.setMinutes(fakeTime.getMinutes() - 1);
    renderTime(fakeTime);

    if (fakeTime.getTime() <= targetTime.getTime()) {
      fakeTime = new Date(targetTime.getTime());
      renderTime(fakeTime);
      clearInterval(countdownInterval);
      countdownInterval = null;
      state = "finished";
    }
  }, 1000);
}

function renderTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

  const day = days[date.getDay()];
  const monthDay = `${date.getDate()} ${months[date.getMonth()]}`;
  const dateText = extraMinuteMode ? `${day} ${monthDay}.` : `${day} ${monthDay}`;

  fakeClock.querySelector(".date").textContent = dateText;
  fakeClock.querySelector(".time").textContent = `${hours}:${minutes}`;
}

let swipeStartY = null;
let swipeActive = false;

document.addEventListener("touchstart", event => {
  if (event.touches.length !== 3) return;

  swipeActive = true;
  swipeStartY = [...event.touches].reduce((sum, touch) => sum + touch.clientY, 0) / 3;
}, { passive: true });

document.addEventListener("touchmove", event => {
  if (!swipeActive || event.touches.length !== 3) return;

  const y = [...event.touches].reduce((sum, touch) => sum + touch.clientY, 0) / 3;

  if (y - swipeStartY > 90 && state === "finished") {
    fakeClock.style.display = "none";
    secretGrid.style.display = "grid";
    state = "secret";
    swipeActive = false;
    event.preventDefault();
  }
}, { passive: false });

document.addEventListener("touchend", () => {
  swipeActive = false;
}, { passive: true });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(console.error);
  });
}