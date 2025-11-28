import Icon from "./Icon";

function Sidebar({ activeTab, setActiveTab, stats }) {
  const menuItems = [
    { id: "home", label: "Dashboard", icon: "home", color: "blue" },
    { id: "notes", label: "Process Notes", icon: "file", color: "blue" },
    { id: "liveRecording", label: "Live Recording", icon: "record-dot", color: "red" },
    { id: "meeting", label: "Upload Media", icon: "video", color: "purple" },
    { id: "chat", label: "Ask Questions", icon: "message-circle", color: "green" },
    { id: "schedule", label: "Study Schedule", icon: "calendar", color: "orange" },
    { id: "pomodoro", label: "Pomodoro Timer", icon: "clock", color: "red" },
    { id: "focus", label: "Focus Mode", icon: "eye", color: "indigo" },
    { id: "tasks", label: "Task Manager", icon: "check-circle", color: "green" },
    { id: "dashboard", label: "Progress", icon: "trophy", color: "yellow" },
    { id: "quicknotes", label: "Quick Notes", icon: "file", color: "pink" },
    { id: "energy", label: "Energy Tracker", icon: "flame", color: "orange" },
  ];

  const getStatsForItem = (id) => {
    if (!stats) return null;
    switch (id) {
      case "notes":
        return stats.totalNotes;
      case "liveRecording":
      case "meeting":
        return stats.totalRecordings;
      case "tasks":
        return stats.totalTasks || 0;
      default:
        return null;
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Icon name="home" size={24} />
          </div>
          <div className="logo-text">
            <h2>ByteForge</h2>
            <p>FocusFlow</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-label">Main Features</div>
          {menuItems.slice(0, 6).map((item) => {
            const count = getStatsForItem(item.id);
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""} ${item.color}`}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
              >
                <div className="nav-item-content">
                  <Icon name={item.icon} size={20} />
                  <span className="nav-item-label">{item.label}</span>
                  {count !== null && count > 0 && (
                    <span className="nav-item-badge">{count}</span>
                  )}
                </div>
                {activeTab === item.id && <div className="nav-item-indicator"></div>}
              </button>
            );
          })}
        </div>

        <div className="nav-section">
          <div className="nav-section-label">Productivity Tools</div>
          {menuItems.slice(6).map((item) => {
            const count = getStatsForItem(item.id);
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""} ${item.color}`}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
              >
                <div className="nav-item-content">
                  <Icon name={item.icon} size={20} />
                  <span className="nav-item-label">{item.label}</span>
                  {count !== null && count > 0 && (
                    <span className="nav-item-badge">{count}</span>
                  )}
                </div>
                {activeTab === item.id && <div className="nav-item-indicator"></div>}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-stats">
          <div className="sidebar-stat">
            <Icon name="file" size={16} />
            <span>{stats?.totalNotes || 0} Notes</span>
          </div>
          <div className="sidebar-stat">
            <Icon name="record-dot" size={16} />
            <span>{stats?.totalRecordings || 0} Recordings</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

