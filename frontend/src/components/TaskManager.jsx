import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Icon from "./Icon";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTask, setReminderTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState("default");

  // Reminder form state
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [recurring, setRecurring] = useState({ enabled: false, pattern: "daily" });
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchTasks();
    requestNotificationPermission();
    checkReminders();
    
    // Check reminders every minute
    const reminderInterval = setInterval(checkReminders, 60000);
    return () => clearInterval(reminderInterval);
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } else if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tasks?filter=${filter}`);
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem("adhd_tasks");
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const checkReminders = async () => {
    try {
      const response = await axios.get("/api/tasks/reminders/upcoming");
      if (response.data.success && response.data.tasks.length > 0) {
        response.data.tasks.forEach((task) => {
          showBrowserNotification(task);
        });
      }
    } catch (error) {
      // Silently fail - reminders are optional
    }
  };

  const showBrowserNotification = (task) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Reminder: ${task.text}`, {
        body: `Priority: ${task.priority}${task.notes ? `\n${task.notes}` : ""}`,
        icon: "/favicon.ico",
        tag: `task-${task._id}`,
        requireInteraction: true,
      });
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    const taskData = {
      text: newTask.trim(),
      priority,
      category: category || undefined,
      notes: notes || undefined,
    };

    if (reminderDate && reminderTime) {
      const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
      taskData.reminderDate = reminderDateTime.toISOString();
    }

    if (recurring.enabled) {
      taskData.recurring = {
        enabled: true,
        pattern: recurring.pattern,
        nextDue: reminderDate ? new Date(`${reminderDate}T${reminderTime}`) : new Date(),
      };
    }

    try {
      const response = await axios.post("/api/tasks", taskData);
      if (response.data.success) {
        setTasks([response.data.task, ...tasks]);
        setNewTask("");
        setPriority("medium");
        setReminderDate("");
        setReminderTime("");
        setRecurring({ enabled: false, pattern: "daily" });
        setCategory("");
        setNotes("");
        if (window.showToast) {
          window.showToast("Task added successfully!", "success");
        }
      }
    } catch (error) {
      // Fallback to localStorage
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
        reminderDate: reminderDate && reminderTime ? `${reminderDate}T${reminderTime}` : null,
        recurring: recurring.enabled ? recurring : null,
        category: category || null,
        notes: notes || null,
      };
      setTasks([task, ...tasks]);
      localStorage.setItem("adhd_tasks", JSON.stringify([task, ...tasks]));
      setNewTask("");
      setPriority("medium");
      setReminderDate("");
      setReminderTime("");
      setRecurring({ enabled: false, pattern: "daily" });
      setCategory("");
      setNotes("");
      if (window.showToast) {
        window.showToast("Task added (saved locally)", "info");
      }
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, updates);
      if (response.data.success) {
        setTasks(tasks.map((t) => (t._id === id || t.id === id ? response.data.task || { ...t, ...updates } : t)));
        setEditingTask(null);
        if (window.showToast) {
          window.showToast("Task updated!", "success");
        }
      }
    } catch (error) {
      // Fallback to localStorage
      const updatedTasks = tasks.map((t) =>
        (t.id === id || t._id === id) ? { ...t, ...updates } : t
      );
      setTasks(updatedTasks);
      localStorage.setItem("adhd_tasks", JSON.stringify(updatedTasks));
      setEditingTask(null);
      if (window.showToast) {
        window.showToast("Task updated (saved locally)", "info");
      }
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t._id === id || t.id === id);
    const newCompleted = !task.completed;
    await updateTask(id, { completed: newCompleted });
  };

  const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((t) => (t._id !== id && t.id !== id)));
      if (window.showToast) {
        window.showToast("Task deleted!", "success");
      }
    } catch (error) {
      // Fallback to localStorage
      const updatedTasks = tasks.filter((t) => (t.id !== id && t._id !== id));
      setTasks(updatedTasks);
      localStorage.setItem("adhd_tasks", JSON.stringify(updatedTasks));
      if (window.showToast) {
        window.showToast("Task deleted (saved locally)", "info");
      }
    }
  };

  const sendEmailReminder = async (taskId) => {
    try {
      await axios.post(`/api/reminders/${taskId}/send-email`);
      if (window.showToast) {
        window.showToast("Reminder email sent!", "success");
      }
    } catch (error) {
      if (window.showToast) {
        window.showToast("Failed to send email. Check email configuration.", "error");
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "var(--danger-color)";
      case "medium":
        return "var(--warning-color)";
      case "low":
        return "var(--success-color)";
      default:
        return "var(--gray-500)";
    }
  };

  const filteredTasks =
    filter === "all"
      ? tasks
      : filter === "active"
      ? tasks.filter((t) => !t.completed)
      : tasks.filter((t) => t.completed);

  const activeTasksCount = tasks.filter((t) => !t.completed).length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="component">
      <div className="component-header">
        <div className="header-content">
          <h2>✅ Task Manager</h2>
          <div className="feature-badge">Full CRUD</div>
        </div>
        <p className="description">
          Organize your tasks with priorities, reminders, and recurring schedules. Get browser notifications and email reminders.
        </p>
      </div>

      <div className="card task-manager-container">
        <div className="task-stats">
          <div className="stat-badge">
            <span className="stat-number">{activeTasksCount}</span>
            <span className="stat-text">Active</span>
          </div>
          <div className="stat-badge completed">
            <span className="stat-number">{completedTasksCount}</span>
            <span className="stat-text">Completed</span>
          </div>
          <div className="stat-badge total">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-text">Total</span>
          </div>
        </div>

        <div className="task-input-section">
          <div className="task-input-group">
            <input
              type="text"
              className="form-input task-input"
              placeholder="What do you need to do?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
            />
            <select
              className="priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button className="btn-primary" onClick={addTask}>
              <Icon name="plus" size={18} />
              Add Task
            </button>
          </div>

          <div className="task-options-row">
            <div className="form-group-inline">
              <label>Category (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Work, Study"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="form-group-inline">
              <label>Reminder Date</label>
              <input
                type="date"
                className="form-input"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="form-group-inline">
              <label>Reminder Time</label>
              <input
                type="time"
                className="form-input"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                disabled={!reminderDate}
              />
            </div>
          </div>

          <div className="recurring-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={recurring.enabled}
                onChange={(e) => setRecurring({ ...recurring, enabled: e.target.checked })}
                className="modern-checkbox"
              />
              <span>Recurring Task</span>
            </label>
            {recurring.enabled && (
              <select
                className="form-input"
                value={recurring.pattern}
                onChange={(e) => setRecurring({ ...recurring, pattern: e.target.value })}
                style={{ marginLeft: "1rem", width: "auto" }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>

          {notes && (
            <div className="form-group">
              <label>Notes</label>
              <textarea
                className="form-input"
                placeholder="Additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="2"
              />
            </div>
          )}
        </div>

        <div className="task-filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <div className="loading-skeleton" style={{ height: "200px" }}></div>
        ) : (
          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <Icon name="check-circle" size={48} />
                <p>No tasks yet. Add one to get started!</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task._id || task.id}
                  className={`task-item ${task.completed ? "completed" : ""}`}
                >
                  <div className="task-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id || task.id)}
                      className="task-checkbox"
                    />
                    <div
                      className="priority-indicator"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    ></div>
                  </div>
                  <div className="task-content">
                    {editingTask === (task._id || task.id) ? (
                      <div className="task-edit-form">
                        <input
                          type="text"
                          className="form-input"
                          value={editingTask.text || task.text}
                          onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button
                            className="btn-primary"
                            onClick={() => updateTask(task._id || task.id, { text: editingTask.text })}
                          >
                            Save
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => setEditingTask(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="task-text">{task.text}</div>
                        <div className="task-meta">
                          <span className="task-priority">{task.priority}</span>
                          {task.category && <span className="task-category">{task.category}</span>}
                          {task.reminderDate && (
                            <span className="task-reminder">
                              <Icon name="clock" size={14} />
                              {formatDate(task.reminderDate)}
                            </span>
                          )}
                          {task.recurring?.enabled && (
                            <span className="task-recurring">
                              <Icon name="refresh" size={14} />
                              {task.recurring.pattern}
                            </span>
                          )}
                          <span className="task-date">
                            {new Date(task.createdAt || task.id).toLocaleDateString()}
                          </span>
                        </div>
                        {task.notes && (
                          <div className="task-notes">{task.notes}</div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="task-actions">
                    {!task.completed && task.reminderDate && (
                      <button
                        className="task-action-btn"
                        onClick={() => sendEmailReminder(task._id || task.id)}
                        title="Send email reminder"
                      >
                        <Icon name="send" size={16} />
                      </button>
                    )}
                    <button
                      className="task-action-btn"
                      onClick={() => setEditingTask({ id: task._id || task.id, text: task.text })}
                      title="Edit task"
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      className="task-delete-btn"
                      onClick={() => deleteTask(task._id || task.id)}
                      title="Delete task"
                    >
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {notificationPermission !== "granted" && (
          <div className="notification-prompt">
            <Icon name="bell" size={20} />
            <span>Enable browser notifications for task reminders</span>
            <button className="btn-primary" onClick={requestNotificationPermission}>
              Enable
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskManager;
