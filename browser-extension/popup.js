let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let blockedSites = [];

// Load saved data
chrome.storage.sync.get(['blockedSites', 'timerState', 'timeLeft'], (data) => {
  blockedSites = data.blockedSites || [];
  timeLeft = data.timeLeft || 25 * 60;
  isRunning = data.timerState || false;
  
  updateUI();
  renderSites();
  
  if (isRunning) {
    startTimer();
  }
});

function updateUI() {
  const timerDisplay = document.getElementById('timer');
  const modeStatus = document.getElementById('modeStatus');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  modeStatus.textContent = isRunning ? 'Active' : 'Inactive';
  document.getElementById('status').classList.toggle('active', isRunning);
  
  startBtn.disabled = isRunning;
  stopBtn.disabled = !isRunning;
}

function startTimer() {
  if (isRunning) return;
  
  isRunning = true;
  chrome.storage.sync.set({ timerState: true });
  
  // Enable site blocking
  chrome.storage.sync.set({ blockEnabled: true });
  
  timerInterval = setInterval(() => {
    timeLeft--;
    chrome.storage.sync.set({ timeLeft });
    updateUI();
    
    if (timeLeft <= 0) {
      stopTimer();
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Focus Session Complete!',
        message: 'Great job! Take a 5-minute break.',
      });
    }
  }, 1000);
  
  updateUI();
}

function stopTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  chrome.storage.sync.set({ timerState: false, blockEnabled: false });
  updateUI();
}

function renderSites() {
  const siteList = document.getElementById('siteList');
  siteList.innerHTML = '';
  
  blockedSites.forEach((site, index) => {
    const item = document.createElement('div');
    item.className = 'site-item';
    item.innerHTML = `
      <span>${site}</span>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;
    siteList.appendChild(item);
  });
  
  // Add remove listeners
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      blockedSites.splice(index, 1);
      chrome.storage.sync.set({ blockedSites });
      renderSites();
    });
  });
}

document.getElementById('startBtn').addEventListener('click', () => {
  startTimer();
});

document.getElementById('stopBtn').addEventListener('click', () => {
  stopTimer();
});

document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('siteInput');
  const site = input.value.trim();
  
  if (site && !blockedSites.includes(site)) {
    blockedSites.push(site);
    chrome.storage.sync.set({ blockedSites });
    renderSites();
    input.value = '';
  }
});

document.getElementById('siteInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('addBtn').click();
  }
});

