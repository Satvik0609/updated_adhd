import { useState, useEffect } from "react";
import Icon from "./Icon";

function EnergyTracker() {
  const [energyLevel, setEnergyLevel] = useState(5); // 1-10 scale
  const [energyHistory, setEnergyHistory] = useState(() => {
    const saved = localStorage.getItem("adhd_energy_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("adhd_energy_history", JSON.stringify(energyHistory));
  }, [energyHistory]);

  const saveEnergyLevel = () => {
    const entry = {
      level: energyLevel,
      timestamp: new Date().toISOString(),
      time: currentTime.toLocaleTimeString(),
    };
    setEnergyHistory([...energyHistory, entry].slice(-24)); // Keep last 24 entries
  };

  const getEnergyColor = (level) => {
    if (level >= 8) return "var(--success-color)";
    if (level >= 5) return "var(--warning-color)";
    return "var(--danger-color)";
  };

  const getEnergyLabel = (level) => {
    if (level >= 8) return "High Energy";
    if (level >= 5) return "Moderate Energy";
    return "Low Energy";
  };

  const recentHistory = energyHistory.slice(-7); // Last 7 entries

  return (
    <div className="component">
      <h2>⚡ Energy Level Tracker</h2>
      <p className="description">
        Track your focus and energy levels throughout the day to understand your peak performance times.
      </p>

      <div className="card energy-tracker-container">
        <div className="energy-display-section">
          <div className="energy-circle-wrapper">
            <div
              className="energy-circle"
              style={{
                background: `conic-gradient(${getEnergyColor(energyLevel)} 0deg ${energyLevel * 36}deg, var(--gray-200) ${energyLevel * 36}deg 360deg)`,
              }}
            >
              <div className="energy-inner">
                <div className="energy-value">{energyLevel}</div>
                <div className="energy-label">{getEnergyLabel(energyLevel)}</div>
              </div>
            </div>
          </div>

          <div className="energy-slider-section">
            <label className="slider-label">
              How's your energy level right now?
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="energy-slider"
            />
            <div className="slider-labels">
              <span>Low (1)</span>
              <span>High (10)</span>
            </div>
            <button className="btn-primary" onClick={saveEnergyLevel}>
              <Icon name="save" size={18} />
              Save Energy Level
            </button>
          </div>
        </div>

        {recentHistory.length > 0 && (
          <div className="energy-history-section">
            <h3>Recent Energy Levels</h3>
            <div className="energy-history-chart">
              {recentHistory.map((entry, index) => (
                <div key={index} className="history-bar-wrapper">
                  <div
                    className="history-bar"
                    style={{
                      height: `${entry.level * 10}%`,
                      backgroundColor: getEnergyColor(entry.level),
                    }}
                    title={`${entry.level}/10 at ${entry.time}`}
                  ></div>
                  <div className="history-time">{entry.time.split(":")[0]}:{entry.time.split(":")[1]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="energy-tips">
          <h3>💡 Energy Management Tips</h3>
          <ul className="tips-list">
            <li>Schedule important tasks during your high-energy periods</li>
            <li>Take breaks when energy is low</li>
            <li>Stay hydrated and eat regular meals</li>
            <li>Get adequate sleep for consistent energy</li>
            <li>Use the Pomodoro technique to maintain focus</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EnergyTracker;

