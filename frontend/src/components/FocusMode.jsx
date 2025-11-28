import { useState, useEffect } from "react";
import Icon from "./Icon";

function FocusMode() {
  const [isActive, setIsActive] = useState(false);
  const [distractions, setDistractions] = useState({
    notifications: true,
    socialMedia: true,
    otherTabs: false,
  });

  useEffect(() => {
    if (isActive) {
      document.body.classList.add("focus-mode-active");
      // Disable notifications
      if (distractions.notifications && "Notification" in window) {
        Notification.requestPermission();
      }
    } else {
      document.body.classList.remove("focus-mode-active");
    }

    return () => {
      document.body.classList.remove("focus-mode-active");
    };
  }, [isActive, distractions]);

  const toggleFocusMode = () => {
    setIsActive(!isActive);
  };

  const handleDistractionToggle = (key) => {
    setDistractions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="component">
      <h2>🎯 Focus Mode</h2>
      <p className="description">
        Create a distraction-free environment to maximize your concentration and productivity.
      </p>

      <div className="card focus-mode-container">
        <div className="focus-mode-toggle-section">
          <div className="focus-mode-status">
            <div className={`status-indicator ${isActive ? "active" : ""}`}>
              <div className="status-dot"></div>
              <span>{isActive ? "Focus Mode Active" : "Focus Mode Inactive"}</span>
            </div>
          </div>
          <button
            className={`btn-primary focus-toggle-btn ${isActive ? "active" : ""}`}
            onClick={toggleFocusMode}
          >
            {isActive ? (
              <>
                <Icon name="eye-off" size={18} />
                Exit Focus Mode
              </>
            ) : (
              <>
                <Icon name="eye" size={18} />
                Enter Focus Mode
              </>
            )}
          </button>
        </div>

        {isActive && (
          <div className="focus-mode-active-content">
            <div className="focus-message">
              <Icon name="check-circle" size={24} />
              <div>
                <h3>You're in Focus Mode!</h3>
                <p>Minimize distractions and stay focused on your work.</p>
              </div>
            </div>
          </div>
        )}

        <div className="focus-mode-settings">
          <h3>Distraction Controls</h3>
          <div className="distraction-controls">
            <label className="distraction-toggle">
              <input
                type="checkbox"
                checked={distractions.notifications}
                onChange={() => handleDistractionToggle("notifications")}
              />
              <span className="toggle-label">
                <Icon name="bell" size={18} />
                Block Browser Notifications
              </span>
            </label>
            <label className="distraction-toggle">
              <input
                type="checkbox"
                checked={distractions.socialMedia}
                onChange={() => handleDistractionToggle("socialMedia")}
              />
              <span className="toggle-label">
                <Icon name="shield" size={18} />
                Remind About Social Media Breaks
              </span>
            </label>
            <label className="distraction-toggle">
              <input
                type="checkbox"
                checked={distractions.otherTabs}
                onChange={() => handleDistractionToggle("otherTabs")}
              />
              <span className="toggle-label">
                <Icon name="lock" size={18} />
                Warn About Tab Switching
              </span>
            </label>
          </div>
        </div>

        <div className="focus-tips">
          <h3>💡 Focus Tips</h3>
          <ul className="tips-list">
            <li>Use the Pomodoro Timer for structured work sessions</li>
            <li>Take regular breaks to maintain focus</li>
            <li>Keep your workspace clean and organized</li>
            <li>Use noise-cancelling if you're sensitive to sounds</li>
            <li>Set clear goals before starting each session</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FocusMode;

