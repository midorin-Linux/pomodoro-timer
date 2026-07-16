const modeLabel = document.getElementById("mode-label");
const timeDisplay = document.getElementById("time-display");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const applyBtn = document.getElementById("apply-btn");

const workInput = document.getElementById("work-duration");
const shortBreakInput = document.getElementById("short-break-duration");

const MODE_LABELS = {
  work: "作業中",
  shortBreak: "休憩中",
};

const settings = {
  work: 25,
  shortBreak: 5,
};

let mode = "work";
let remainingSeconds = settings.work * 60;
let timerId = null;
let isRunning = false;

function durationFor(targetMode) {
  return targetMode === "work" ? settings.work * 60 : settings.shortBreak * 60;
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

function updateDisplay() {
  modeLabel.textContent = MODE_LABELS[mode];
  timeDisplay.textContent = formatTime(remainingSeconds);
}

function advanceMode() {
  mode = mode === "work" ? "shortBreak" : "work";
  remainingSeconds = durationFor(mode);
}

function tick() {
  remainingSeconds -= 1;
  if (remainingSeconds < 0) {
    advanceMode();
  }
  updateDisplay();
}

function setControlsRunning(running) {
  startBtn.disabled = running;
  pauseBtn.disabled = !running;
  [workInput, shortBreakInput, applyBtn].forEach((el) => {
    el.disabled = running;
  });
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timerId = setInterval(tick, 1000);
  setControlsRunning(true);
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerId);
  timerId = null;
  setControlsRunning(false);
}

function resetTimer() {
  pauseTimer();
  mode = "work";
  remainingSeconds = durationFor(mode);
  updateDisplay();
}

function clampInt(value, min, max, fallback) {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function applySettings() {
  settings.work = clampInt(workInput.value, 1, 180, settings.work);
  settings.shortBreak = clampInt(
    shortBreakInput.value,
    1,
    60,
    settings.shortBreak,
  );

  workInput.value = settings.work;
  shortBreakInput.value = settings.shortBreak;

  resetTimer();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
applyBtn.addEventListener("click", applySettings);

updateDisplay();
