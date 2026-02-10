const grid = document.getElementById("grid");
const clock = document.getElementById("clock");
const dateEl = document.getElementById("date");
const hourEl = document.getElementById("hour");
const minuteEl = document.getElementById("minute");

let secretNumber = null;
let countdownInterval = null;

// ======= Выбор цифры на первом экране =======
grid.addEventListener("pointerup", e => {
  const cell = e.target.closest(".cell");
  if(!cell) return;
  secretNumber = parseInt(cell.dataset.num);
  grid.style.display = "none";
  clock.style.display = "flex";

  startFakeTime(secretNumber);
}, { passive: true });

// ======= Обратный отсчёт времени =======
function startFakeTime(num) {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes() - num; // сразу "уменьшаем" на число
  if(minutes < 0){
    minutes += 60;
    hours = (hours - 1 + 24) % 24;
  }
  updateClock(hours, minutes);

  setTimeout(() => {
    countdownInterval = setInterval(() => {
      minutes++;
      if(minutes >= 60){
        minutes = 0;
        hours = (hours + 1) % 24;
      }
      updateClock(hours, minutes);
    }, 1000); // 1 минута = 1 секунда
  }, 5000); // ждем 5 секунд перед возвратом
}

function updateClock(hours, minutes) {
  hourEl.textContent = String(hours).padStart(2,'0');
  minuteEl.textContent = String(minutes).padStart(2,'0');
}

// ======= Обновление даты =======
function updateDate() {
  const now = new Date();
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  dateEl.textContent = now.toLocaleDateString('ru-RU', options);
}
updateDate();
setInterval(updateDate, 60*1000); // обновляем каждую минуту
