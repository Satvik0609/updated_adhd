import { useState, useEffect, useRef } from "react";
import Icon from "./Icon";

function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(() => {
    const saved = localStorage.getItem("pomodoros_completed");
    return saved ? parseInt(saved) : 0;
  });
  const [sessionType, setSessionType] = useState("focus"); // focus, short-break, long-break
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            if (minutes === 0) {
              handleTimerComplete();
              return 0;
            }
            setMinutes((m) => m - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes]);

  const handleTimerComplete = () => {
    setIsActive(false);
    playNotificationSound();
    
    if (sessionType === "focus") {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      localStorage.setItem("pomodoros_completed", newCount.toString());
      // After 4 pomodoros, suggest long break
      if (newCount % 4 === 0) {
        setSessionType("long-break");
        setMinutes(15);
        setSeconds(0);
      } else {
        setSessionType("short-break");
        setMinutes(5);
        setSeconds(0);
      }
      setIsBreak(true);
    } else {
      // Break completed, start focus session
      setSessionType("focus");
      setMinutes(25);
      setSeconds(0);
      setIsBreak(false);
    }
  };

  const playNotificationSound = () => {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => {
    const newActive = !isActive;
    setIsActive(newActive);
    
    // Sync with browser extension if available
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      if (newActive && sessionType === "focus") {
        const totalSeconds = minutes * 60 + seconds;
        chrome.runtime.sendMessage({
          action: 'startTimer',
          duration: totalSeconds
        });
      } else {
        chrome.runtime.sendMessage({ action: 'stopTimer' });
      }
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    
    // Stop extension timer
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      chrome.runtime.sendMessage({ action: 'stopTimer' });
    }
    
    if (sessionType === "focus") {
      setMinutes(25);
    } else if (sessionType === "short-break") {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
    setSeconds(0);
  };

  const selectSessionType = (type) => {
    setIsActive(false);
    setSessionType(type);
    setIsBreak(type !== "focus");
    if (type === "focus") {
      setMinutes(25);
    } else if (type === "short-break") {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
    setSeconds(0);
  };

  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progress = sessionType === "focus" 
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : sessionType === "short-break"
    ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
    : ((15 * 60 - (minutes * 60 + seconds)) / (15 * 60)) * 100;

  return (
    <div className="component">
      <h2>🍅 Pomodoro Focus Timer</h2>
      <p className="description">
        Work in focused 25-minute sessions with breaks. Perfect for maintaining concentration!
      </p>

      <div className="card pomodoro-container">
        <div className="pomodoro-session-selector">
          <button
            className={`session-btn ${sessionType === "focus" ? "active" : ""}`}
            onClick={() => selectSessionType("focus")}
          >
            <Icon name="clock" size={18} />
            Focus (25min)
          </button>
          <button
            className={`session-btn ${sessionType === "short-break" ? "active" : ""}`}
            onClick={() => selectSessionType("short-break")}
          >
            <Icon name="coffee" size={18} />
            Short Break (5min)
          </button>
          <button
            className={`session-btn ${sessionType === "long-break" ? "active" : ""}`}
            onClick={() => selectSessionType("long-break")}
          >
            <Icon name="moon" size={18} />
            Long Break (15min)
          </button>
        </div>

        <div className="pomodoro-timer-display">
          <div className="timer-circle">
            <svg className="timer-svg" viewBox="0 0 200 200">
              <circle
                className="timer-bg"
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="var(--gray-200)"
                strokeWidth="8"
              />
              <circle
                className="timer-progress"
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={isBreak ? "var(--success-color)" : "var(--primary-color)"}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div className="timer-text">
              <div className="timer-time">{formatTime(minutes, seconds)}</div>
              <div className="timer-label">
                {isBreak ? "Break Time" : "Focus Time"}
              </div>
            </div>
          </div>
        </div>

        <div className="pomodoro-controls">
          <button className="btn-primary" onClick={toggleTimer}>
            {isActive ? (
              <>
                <Icon name="pause" size={18} />
                Pause
              </>
            ) : (
              <>
                <Icon name="play" size={18} />
                Start
              </>
            )}
          </button>
          <button className="btn-secondary" onClick={resetTimer}>
            <Icon name="refresh" size={18} />
            Reset
          </button>
        </div>

        <div className="pomodoro-stats">
          <div className="stat-card">
            <div className="stat-value">{completedPomodoros}</div>
            <div className="stat-label">Completed Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Math.floor(completedPomodoros * 25 / 60)}h {completedPomodoros * 25 % 60}m</div>
            <div className="stat-label">Total Focus Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PomodoroTimer;

