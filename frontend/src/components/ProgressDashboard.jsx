import { useState, useEffect } from "react";
import Icon from "./Icon";

function ProgressDashboard() {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("adhd_progress_stats");
    return saved
      ? JSON.parse(saved)
      : {
          notesProcessed: 0,
          recordingsCompleted: 0,
          studyHours: 0,
          tasksCompleted: 0,
          pomodorosCompleted: 0,
          streakDays: 0,
        };
  });

  useEffect(() => {
    // Load pomodoro count from localStorage if available
    const pomodoros = parseInt(localStorage.getItem("pomodoros_completed") || "0");
    const tasks = JSON.parse(localStorage.getItem("adhd_tasks") || "[]");
    const completedTasks = tasks.filter((t) => t.completed).length;

    setStats((prev) => ({
      ...prev,
      pomodorosCompleted: pomodoros,
      tasksCompleted: completedTasks,
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem("adhd_progress_stats", JSON.stringify(stats));
  }, [stats]);

  const updateStat = (key, value) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  const calculateLevel = () => {
    const totalPoints =
      stats.notesProcessed * 10 +
      stats.recordingsCompleted * 15 +
      Math.floor(stats.studyHours) * 20 +
      stats.tasksCompleted * 5 +
      stats.pomodorosCompleted * 3;
    return Math.floor(totalPoints / 100) + 1;
  };

  const calculateProgress = () => {
    const totalPoints =
      stats.notesProcessed * 10 +
      stats.recordingsCompleted * 15 +
      Math.floor(stats.studyHours) * 20 +
      stats.tasksCompleted * 5 +
      stats.pomodorosCompleted * 3;
    return totalPoints % 100;
  };

  const level = calculateLevel();
  const progress = calculateProgress();

  return (
    <div className="component">
      <h2>📊 Progress Dashboard</h2>
      <p className="description">
        Track your learning journey and celebrate your achievements!
      </p>

      <div className="card dashboard-container">
        <div className="level-section">
          <div className="level-display">
            <div className="level-circle">
              <div className="level-number">{level}</div>
              <div className="level-label">Level</div>
            </div>
            <div className="level-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">{progress}% to Level {level + 1}</div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card-large">
            <div className="stat-icon">
              <Icon name="file" size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.notesProcessed}</div>
              <div className="stat-label">Notes Processed</div>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon">
              <Icon name="record-dot" size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.recordingsCompleted}</div>
              <div className="stat-label">Recordings</div>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon">
              <Icon name="clock" size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.studyHours.toFixed(1)}h</div>
              <div className="stat-label">Study Hours</div>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon">
              <Icon name="check-circle" size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.tasksCompleted}</div>
              <div className="stat-label">Tasks Completed</div>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon">
              <Icon name="coffee" size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.pomodorosCompleted}</div>
              <div className="stat-label">Pomodoros</div>
            </div>
          </div>

          <div className="stat-card-large streak">
            <div className="stat-icon">
              <Icon name="flame" size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.streakDays}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="achievements-section">
          <h3>🏆 Recent Achievements</h3>
          <div className="achievements-list">
            {stats.notesProcessed >= 1 && (
              <div className="achievement-badge">
                <Icon name="trophy" size={20} />
                First Note Processed
              </div>
            )}
            {stats.pomodorosCompleted >= 4 && (
              <div className="achievement-badge">
                <Icon name="trophy" size={20} />
                Focus Master (4 Pomodoros)
              </div>
            )}
            {stats.tasksCompleted >= 10 && (
              <div className="achievement-badge">
                <Icon name="trophy" size={20} />
                Task Champion (10 Tasks)
              </div>
            )}
            {stats.streakDays >= 7 && (
              <div className="achievement-badge">
                <Icon name="trophy" size={20} />
                Week Warrior (7 Day Streak)
              </div>
            )}
            {stats.notesProcessed === 0 &&
              stats.recordingsCompleted === 0 &&
              stats.tasksCompleted === 0 && (
                <div className="empty-achievements">
                  Complete tasks to unlock achievements!
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressDashboard;

