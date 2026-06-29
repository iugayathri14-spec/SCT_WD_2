let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let laps = [];
let lastLapTime = 0;

const display = document.getElementById('display');
const msDisplay = document.getElementById('ms');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');
const stopwatchEl = document.getElementById('stopwatch');
const bgCircle = document.getElementById('bgCircle');

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  return {
    time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    ms: `.${String(milliseconds).padStart(3, '0')}`
  };
}

function updateDisplay() {
  const currentTime = isRunning? Date.now() - startTime + elapsedTime : elapsedTime;
  const formatted = formatTime(currentTime);
  display.textContent = formatted.time;
  msDisplay.textContent = formatted.ms;
}

function start() {
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now();
    timerInterval = setInterval(updateDisplay, 10);

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    lapBtn.disabled = false;

    stopwatchEl.classList.add('running');
    bgCircle.classList.add('running');
  }
}

function pause() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timerInterval);
    elapsedTime += Date.now() - startTime;

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;

    stopwatchEl.classList.remove('running');
    bgCircle.classList.remove('running');
    updateDisplay();
  }
}

function reset() {
  isRunning = false;
  clearInterval(timerInterval);
  elapsedTime = 0;
  startTime = 0;
  laps = [];
  lastLapTime = 0;

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled = true;

  stopwatchEl.classList.remove('running');
  bgCircle.classList.remove('running');

  updateDisplay();
  renderLaps();
}

function lap() {
  if (isRunning) {
    const currentTime = Date.now() - startTime + elapsedTime;
    const lapTime = currentTime - lastLapTime;
    lastLapTime = currentTime;

    laps.unshift({
      number: laps.length + 1,
      total: currentTime,
      lap: lapTime
    });

    renderLaps();
  }
}

function renderLaps() {
  if (laps.length === 0) {
    lapsList.innerHTML = '<div class="empty-laps">No laps recorded</div>';
    return;
  }

  // Find fastest and slowest laps
  let fastest = laps[0].lap;
  let slowest = laps[0].lap;
  laps.forEach(l => {
    if (l.lap < fastest) fastest = l.lap;
    if (l.lap > slowest) slowest = l.lap;
  });

  lapsList.innerHTML = laps.map(l => {
    const totalFormatted = formatTime(l.total);
    const lapFormatted = formatTime(l.lap);
    let className = 'lap-item';
    if (laps.length > 1) {
      if (l.lap === fastest) className += ' fastest';
      if (l.lap === slowest) className += ' slowest';
    }

    return `
      <div class="${className}">
        <span class="lap-number">Lap ${l.number}</span>
        <span class="lap-time">${lapFormatted.time}${lapFormatted.ms}</span>
      </div>
    `;
  }).join('');
}

// Event listeners
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
lapBtn.addEventListener('click', lap);
resetBtn.addEventListener('click', reset);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    isRunning? pause() : start();
  } else if (e.code === 'KeyL' && isRunning) {
    lap();
  } else if (e.code === 'KeyR') {
    reset();
  }
});

updateDisplay();