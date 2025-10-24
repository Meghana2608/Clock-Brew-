document.querySelectorAll('.brew-card').forEach(card => {
  const startBtn = card.querySelector('.start-btn');
  const pauseBtn = card.querySelector('.pause-btn');
  const timerDisplay = card.querySelector('.timer');
  const progress = card.querySelector('.progress');
  const totalSeconds = parseInt(card.dataset.time);

  let countdown;
  let secondsLeft = totalSeconds;
  let isRunning = false;
  let isPaused = false;

  function updateDisplay() {
    let hours = Math.floor(secondsLeft / 3600);
    let minutes = Math.floor((secondsLeft % 3600) / 60);
    let seconds = secondsLeft % 60;

    let display =
      hours > 0
        ? `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
        : `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

    timerDisplay.textContent = display;
    progress.style.width = `${((totalSeconds - secondsLeft)/totalSeconds)*100}%`;
  }

  function playBeep() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  startBtn.addEventListener('click', () => {
    // Prevent restarting if already running and not paused
    if (isRunning && !isPaused) return;

    clearInterval(countdown);
    if (!isPaused) secondsLeft = totalSeconds;

    isRunning = true;
    isPaused = false;
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    card.classList.add('brewing');
    updateDisplay();

    countdown = setInterval(() => {
      if (!isPaused) {
        secondsLeft--;
        if (secondsLeft <= 0) {
          clearInterval(countdown);
          timerDisplay.textContent = "Done! ☕";
          pauseBtn.disabled = true;
          pauseBtn.textContent = 'Pause';
          isRunning = false;
          isPaused = false;
          progress.style.width = "100%";
          card.classList.remove('brewing');
          playBeep();
        } else {
          updateDisplay();
        }
      }
    }, 1000);
  });

  pauseBtn.addEventListener('click', () => {
    if (isRunning) {
      if (isPaused) {
        // Resume
        isPaused = false;
        pauseBtn.textContent = 'Pause';
      } else {
        // Pause
        isPaused = true;
        pauseBtn.textContent = 'Resume';
      }
    }
  });
});
