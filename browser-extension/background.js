// Background service worker for ByteForge FocusFlow Extension

// Listen for navigation and block sites
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // Only block main frame
  
  chrome.storage.sync.get(['blockedSites', 'blockEnabled'], (data) => {
    if (!data.blockEnabled) return;
    
    const url = new URL(details.url);
    const hostname = url.hostname.replace('www.', '');
    
    const blockedSites = data.blockedSites || [];
    const isBlocked = blockedSites.some(site => {
      const siteHost = site.replace('www.', '');
      return hostname.includes(siteHost) || siteHost.includes(hostname);
    });
    
    if (isBlocked) {
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL('blocked.html')
      });
    }
  });
});

// Sync with main app timer
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    chrome.storage.sync.set({ 
      timerState: true, 
      blockEnabled: true,
      timeLeft: request.duration || 25 * 60 
    });
  } else if (request.action === 'stopTimer') {
    chrome.storage.sync.set({ 
      timerState: false, 
      blockEnabled: false 
    });
  }
});

// Check for timer completion
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focusTimer') {
    chrome.storage.sync.set({ blockEnabled: false });
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Focus Session Complete!',
      message: 'Time for a break!',
    });
  }
});

