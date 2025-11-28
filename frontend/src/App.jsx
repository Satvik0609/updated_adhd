import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import "./App.css";
import NotesProcessor from "./components/NotesProcessor";
import MeetingAssistant from "./components/MeetingAssistant";
import MeetingTranscriber from "./components/MeetingTranscriber";
import ChatAssistant from "./components/ChatAssistant";
import StudySchedule from "./components/StudySchedule";
import PomodoroTimer from "./components/PomodoroTimer";
import FocusMode from "./components/FocusMode";
import TaskManager from "./components/TaskManager";
import ProgressDashboard from "./components/ProgressDashboard";
import QuickNotes from "./components/QuickNotes";
import EnergyTracker from "./components/EnergyTracker";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Toast from "./components/Toast";
import Icon from "./components/Icon";
import { useToast } from "./hooks/useToast";

// Make toast available globally
window.showToast = null;

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [context, setContext] = useState("");
  const [authed, setAuthed] = useState(
    () => !!localStorage.getItem("ama_auth"),
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("adhd_dark_mode") === "true"
  );
  const [sidebarStats, setSidebarStats] = useState({
    totalNotes: 0,
    totalRecordings: 0,
    totalTasks: 0,
  });
  const { toasts, showToast, removeToast } = useToast();

  // Make toast available globally for components
  useEffect(() => {
    window.showToast = showToast;
    return () => {
      window.showToast = null;
    };
  }, [showToast]);

  // Configure axios on mount and whenever auth token changes
  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
    axios.defaults.baseURL = baseURL;
    const token = localStorage.getItem("ama_auth") || sessionStorage.getItem("ama_auth");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authed]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
    localStorage.setItem("adhd_dark_mode", darkMode.toString());
  }, [darkMode]);

  // Persist active tab across reloads and restore on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("ama_active_tab");
    if (savedTab) setActiveTab(savedTab);
  }, []);
  useEffect(() => {
    localStorage.setItem("ama_active_tab", activeTab);
  }, [activeTab]);

  // Listen for navigation events from Dashboard
  useEffect(() => {
    const handleNavigate = (e) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('navigate-tab', handleNavigate);
    return () => window.removeEventListener('navigate-tab', handleNavigate);
  }, []);

  // Fetch stats for sidebar
  useEffect(() => {
    if (authed) {
      const fetchStats = async () => {
        try {
          const [notesRes, mediaRes, transcribeRes] = await Promise.all([
            axios.get("/api/results?type=notes").catch(() => ({ data: { results: [] } })),
            axios.get("/api/results?type=media").catch(() => ({ data: { results: [] } })),
            axios.get("/api/results?type=transcribe").catch(() => ({ data: { results: [] } })),
          ]);

          const notes = notesRes.data.results || [];
          const media = mediaRes.data.results || [];
          const transcribe = transcribeRes.data.results || [];
          const tasks = JSON.parse(localStorage.getItem("adhd_tasks") || "[]");

          setSidebarStats({
            totalNotes: notes.length,
            totalRecordings: media.length + transcribe.length,
            totalTasks: tasks.filter(t => !t.completed).length,
          });
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };

      fetchStats();
      const interval = setInterval(fetchStats, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [authed]);

  const handleLoggedIn = useCallback(() => {
    setAuthed(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("ama_auth");
    sessionStorage.removeItem("ama_auth");
    delete axios.defaults.headers.common["Authorization"];
    setAuthed(false);
    setActiveTab("notes");
    setContext("");
  }, []);

  return (
    <div className="app">
      {!authed ? (
        <Login onLogin={handleLoggedIn} />
      ) : (
        <>
          <div className="app-layout">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={sidebarStats} />
            
            <div className="main-content-wrapper">
              <header className="top-header">
                <div className="header-content">
                  <div className="header-text">
                    <h1>ADHD Meeting Assistant</h1>
                    <p className="tagline">
                      Focus-friendly tools for students with ADHD/Autism
                    </p>
                  </div>
                  <div className="header-actions">
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="theme-toggle-btn"
                      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                      {darkMode ? <Icon name="sun" size={20} /> : <Icon name="moon" size={20} />}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="logout-btn"
                      title="Logout"
                    >
                      <Icon name="user" size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </header>

              <main className="content">
            <div style={{ display: activeTab === "home" ? "block" : "none" }}>
              <Dashboard />
            </div>
            <div style={{ display: activeTab === "notes" ? "block" : "none" }}>
              <NotesProcessor setContext={setContext} />
            </div>
            <div style={{ display: activeTab === "liveRecording" ? "block" : "none" }}>
              <MeetingAssistant setContext={setContext} />
            </div>
            <div style={{ display: activeTab === "meeting" ? "block" : "none" }}>
              <MeetingTranscriber setContext={setContext} />
            </div>
            <div style={{ display: activeTab === "chat" ? "block" : "none" }}>
              <ChatAssistant context={context} />
            </div>
            <div style={{ display: activeTab === "schedule" ? "block" : "none" }}>
              <StudySchedule />
            </div>
            <div style={{ display: activeTab === "pomodoro" ? "block" : "none" }}>
              <PomodoroTimer />
            </div>
            <div style={{ display: activeTab === "focus" ? "block" : "none" }}>
              <FocusMode />
            </div>
            <div style={{ display: activeTab === "tasks" ? "block" : "none" }}>
              <TaskManager />
            </div>
            <div style={{ display: activeTab === "dashboard" ? "block" : "none" }}>
              <ProgressDashboard />
            </div>
            <div style={{ display: activeTab === "quicknotes" ? "block" : "none" }}>
              <QuickNotes />
            </div>
            <div style={{ display: activeTab === "energy" ? "block" : "none" }}>
              <EnergyTracker />
              </div>
              </main>
            </div>
          </div>

          {/* Toast Notifications */}
          <div className="toast-container">
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;