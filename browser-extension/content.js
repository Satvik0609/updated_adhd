// Content script to show blocking overlay
(function() {
  chrome.storage.sync.get(['blockEnabled'], (data) => {
    if (data.blockEnabled) {
      const overlay = document.createElement('div');
      overlay.id = 'focusflow-block-overlay';
      overlay.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          z-index: 999999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <h1 style="font-size: 3rem; margin-bottom: 20px;">🍅</h1>
          <h2 style="font-size: 2rem; margin-bottom: 10px;">Focus Time Active!</h2>
          <p style="font-size: 1.2rem; opacity: 0.9; max-width: 500px;">
            This site is blocked during your focus session. Stay focused and come back after your break!
          </p>
          <div style="margin-top: 30px; font-size: 1.5rem; font-weight: 700;" id="timer-display">
            25:00
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      
      // Update timer
      setInterval(() => {
        chrome.storage.sync.get(['timeLeft'], (data) => {
          const timeLeft = data.timeLeft || 0;
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          const display = document.getElementById('timer-display');
          if (display) {
            display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          }
        });
      }, 1000);
    }
  });
})();

