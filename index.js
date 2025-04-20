class Stopwatch {
  constructor() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
    this.interval = null;
    this.isRunning = false;
    this.lapTimes = [];
    
    // DOM elements
    this.hoursElement = document.getElementById('hours');
    this.minutesElement = document.getElementById('minutes');
    this.secondsElement = document.getElementById('seconds');
    this.millisecondsElement = document.getElementById('milliseconds');
    this.lapTimesElement = document.getElementById('lap-times');
    
    // Buttons
    this.startButton = document.getElementById('start-timer');
    this.pauseButton = document.getElementById('pause-timer');
    this.resetButton = document.getElementById('reset-timer');
    this.lapButton = document.getElementById('lap-timer');
    
    // Theme toggle
    this.themeSwitch = document.getElementById('theme-switch');
    
    // Initialize
    this.initEventListeners();
    this.updateDisplay();
    this.loadThemePreference();
  }
  
  initEventListeners() {
    this.startButton.addEventListener('click', () => this.start());
    this.pauseButton.addEventListener('click', () => this.pause());
    this.resetButton.addEventListener('click', () => this.reset());
    this.lapButton.addEventListener('click', () => this.recordLap());
    this.themeSwitch.addEventListener('change', () => this.toggleTheme());
  }
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.interval = setInterval(() => this.updateTime(), 10);
    
    // UI updates
    this.startButton.disabled = true;
    this.pauseButton.disabled = false;
    this.lapButton.disabled = false;
  }
  
  pause() {
    if (!this.isRunning) return;
    
    clearInterval(this.interval);
    this.isRunning = false;
    
    // UI updates
    this.startButton.disabled = false;
    this.pauseButton.disabled = true;
  }
  
  reset() {
    this.pause();
    
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
    this.lapTimes = [];
    
    this.updateDisplay();
    this.clearLaps();
    
    // UI updates
    this.lapButton.disabled = true;
  }
  
  updateTime() {
    this.milliseconds += 10;
    
    if (this.milliseconds >= 1000) {
      this.milliseconds = 0;
      this.seconds++;
    }
    
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
    }
    
    if (this.minutes >= 60) {
      this.minutes = 0;
      this.hours++;
    }
    
    this.updateDisplay();
  }
  
  updateDisplay() {
    this.hoursElement.textContent = this.formatTime(this.hours, 2);
    this.minutesElement.textContent = this.formatTime(this.minutes, 2);
    this.secondsElement.textContent = this.formatTime(this.seconds, 2);
    this.millisecondsElement.textContent = this.formatTime(this.milliseconds, 3);
  }
  
  formatTime(value, digits) {
    return value.toString().padStart(digits, '0');
  }
  
  recordLap() {
    if (!this.isRunning) return;
    
    const lapTime = {
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      milliseconds: this.milliseconds
    };
    
    this.lapTimes.unshift(lapTime);
    this.displayLaps();
  }
  
  displayLaps() {
    this.lapTimesElement.innerHTML = '';
    
    this.lapTimes.forEach((lap, index) => {
      const lapItem = document.createElement('div');
      lapItem.className = 'lap-item';
      
      const lapNumber = document.createElement('span');
      lapNumber.className = 'lap-number';
      lapNumber.textContent = `Lap ${this.lapTimes.length - index}`;
      
      const lapTime = document.createElement('span');
      lapTime.className = 'lap-time';
      lapTime.textContent = `${this.formatTime(lap.hours, 2)}:${this.formatTime(lap.minutes, 2)}:${this.formatTime(lap.seconds, 2)}.${this.formatTime(lap.milliseconds, 3)}`;
      
      lapItem.appendChild(lapNumber);
      lapItem.appendChild(lapTime);
      this.lapTimesElement.appendChild(lapItem);
    });
  }
  
  clearLaps() {
    this.lapTimesElement.innerHTML = '';
  }
  
  toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  
  loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.themeSwitch.checked = savedTheme === 'light';
  }
}

// Initialize the stopwatch when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new Stopwatch();
});
