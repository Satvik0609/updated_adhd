import Task from "../models/taskModel.js";

export async function createTask(req, res) {
  try {
    const { text, priority, reminderDate, recurring, category, notes } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Task text is required" });
    }

    const taskData = {
      user: req.user.id,
      text: text.trim(),
      priority: priority || "medium",
      category,
      notes,
    };

    if (reminderDate) {
      taskData.reminderDate = new Date(reminderDate);
    }

    if (recurring && recurring.enabled) {
      taskData.recurring = {
        enabled: true,
        pattern: recurring.pattern || "daily",
        nextDue: recurring.nextDue ? new Date(recurring.nextDue) : new Date(),
      };
    }

    const task = await Task.create(taskData);
    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task", details: error.message });
  }
}

export async function getTasks(req, res) {
  try {
    const { filter, category } = req.query;
    const query = { user: req.user.id };

    if (filter === "active") {
      query.completed = false;
    } else if (filter === "completed") {
      query.completed = true;
    }

    if (category) {
      query.category = category;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert date strings to Date objects
    if (updates.reminderDate) {
      updates.reminderDate = new Date(updates.reminderDate);
    }
    if (updates.recurring?.nextDue) {
      updates["recurring.nextDue"] = new Date(updates.recurring.nextDue);
    }

    // Handle completion
    if (updates.completed !== undefined) {
      updates.completedAt = updates.completed ? new Date() : null;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true, task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task", details: error.message });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task", details: error.message });
  }
}

export async function getUpcomingReminders(req, res) {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      user: req.user.id,
      completed: false,
      reminderDate: { $gte: now, $lte: tomorrow },
      reminderSent: false,
    }).sort({ reminderDate: 1 });

    res.json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ error: "Failed to fetch reminders", details: error.message });
  }
}

