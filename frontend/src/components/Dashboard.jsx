import { useState, useEffect } from "react";
import axios from "axios";
import Icon from "./Icon";

function Dashboard() {
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalRecordings: 0,
    totalChats: 0,
    totalSchedules: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all results to get stats
      const [notesRes, mediaRes, transcribeRes] = await Promise.all([
        axios.get("/api/results?type=notes").catch(() => ({ data: { results: [] } })),
        axios.get("/api/results?type=media").catch(() => ({ data: { results: [] } })),
        axios.get("/api/results?type=transcribe").catch(() => ({ data: { results: [] } })),
      ]);

      const notes = notesRes.data.results || [];
      const media = mediaRes.data.results || [];
      const transcribe = transcribeRes.data.results || [];

      setStats({
        totalNotes: notes.length,
        totalRecordings: media.length + transcribe.length,
        totalChats: 0, // Chat history would need separate tracking
        totalSchedules: 0, // Schedule history would need separate tracking
      });

      // Get recent activity (last 5 items)
      const allResults = [
        ...notes.map(r => ({ ...r, type: 'notes', icon: 'file' })),
        ...media.map(r => ({ ...r, type: 'media', icon: 'video' })),
        ...transcribe.map(r => ({ ...r, type: 'transcribe', icon: 'music' })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

      setRecentActivity(allResults);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { id: 'notes', label: 'Process Notes', icon: 'file', color: 'blue', tab: 'notes' },
    { id: 'record', label: 'Live Recording', icon: 'record-dot', color: 'red', tab: 'liveRecording' },
    { id: 'upload', label: 'Upload Media', icon: 'video', color: 'purple', tab: 'meeting' },
    { id: 'chat', label: 'Ask Questions', icon: 'message-circle', color: 'green', tab: 'chat' },
    { id: 'schedule', label: 'Study Schedule', icon: 'calendar', color: 'orange', tab: 'schedule' },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="component">
      <div className="component-header">
        <div className="header-content">
          <h2>Dashboard</h2>
          <div className="feature-badge">Overview</div>
        </div>
        <p className="description">
          Welcome back! Here's your productivity overview and quick access to all features.
        </p>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-skeleton"></div>
          <div className="loading-skeleton"></div>
          <div className="loading-skeleton"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="stats-grid-dashboard">
            <div className="stat-card-dashboard">
              <div className="stat-icon-wrapper blue">
                <Icon name="file" size={28} />
              </div>
              <div className="stat-info-dashboard">
                <div className="stat-value-dashboard">{stats.totalNotes}</div>
                <div className="stat-label-dashboard">Notes Processed</div>
              </div>
            </div>

            <div className="stat-card-dashboard">
              <div className="stat-icon-wrapper red">
                <Icon name="record-dot" size={28} />
              </div>
              <div className="stat-info-dashboard">
                <div className="stat-value-dashboard">{stats.totalRecordings}</div>
                <div className="stat-label-dashboard">Recordings</div>
              </div>
            </div>

            <div className="stat-card-dashboard">
              <div className="stat-icon-wrapper green">
                <Icon name="message-circle" size={28} />
              </div>
              <div className="stat-info-dashboard">
                <div className="stat-value-dashboard">{stats.totalChats}</div>
                <div className="stat-label-dashboard">Chat Sessions</div>
              </div>
            </div>

            <div className="stat-card-dashboard">
              <div className="stat-icon-wrapper orange">
                <Icon name="calendar" size={28} />
              </div>
              <div className="stat-info-dashboard">
                <div className="stat-value-dashboard">{stats.totalSchedules}</div>
                <div className="stat-label-dashboard">Study Schedules</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="quick-actions-grid">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className={`quick-action-card ${action.color}`}
                  onClick={() => {
                    // This will be handled by parent App component
                    window.dispatchEvent(new CustomEvent('navigate-tab', { detail: action.tab }));
                  }}
                >
                  <div className="quick-action-icon">
                    <Icon name={action.icon} size={32} />
                  </div>
                  <div className="quick-action-label">{action.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity-section">
            <div className="section-header">
              <h3 className="section-title">Recent Activity</h3>
              <button className="refresh-btn" onClick={fetchDashboardData} title="Refresh">
                <Icon name="refresh" size={18} />
              </button>
            </div>
            {recentActivity.length > 0 ? (
              <div className="activity-list">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="activity-item">
                    <div className="activity-icon">
                      <Icon name={activity.icon} size={20} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">
                        {activity.type === 'notes' ? 'Notes Processed' :
                         activity.type === 'media' ? 'Media Uploaded' :
                         'Audio Transcribed'}
                      </div>
                      <div className="activity-time">{formatDate(activity.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-activity">
                <Icon name="file" size={48} />
                <p>No recent activity. Start by processing your first note!</p>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="tips-section">
            <h3 className="section-title">💡 Pro Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <Icon name="check-circle" size={24} />
                <h4>Break It Down</h4>
                <p>Process large documents in smaller chunks for better focus and understanding.</p>
              </div>
              <div className="tip-card">
                <Icon name="clock" size={24} />
                <h4>Use Pomodoro</h4>
                <p>Work in 25-minute focused sessions with breaks to maintain productivity.</p>
              </div>
              <div className="tip-card">
                <Icon name="message-circle" size={24} />
                <h4>Ask Questions</h4>
                <p>Use the chat feature to clarify concepts from your processed notes.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;

