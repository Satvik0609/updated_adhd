import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";

// Create email transporter
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn("Email configuration not found. Email reminders will be disabled.");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendReminderEmail(req, res) {
  try {
    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, user: req.user.id });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (!task.reminderDate) {
      return res.status(400).json({ error: "Task has no reminder date" });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.email) {
      return res.status(400).json({ error: "User email not found" });
    }

    const transporter = createTransporter();
    if (!transporter) {
      return res.status(503).json({ error: "Email service not configured" });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `Reminder: ${task.text}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Task Reminder</h2>
          <p><strong>Task:</strong> ${task.text}</p>
          <p><strong>Priority:</strong> ${task.priority}</p>
          <p><strong>Due:</strong> ${new Date(task.reminderDate).toLocaleString()}</p>
          ${task.notes ? `<p><strong>Notes:</strong> ${task.notes}</p>` : ""}
          <p style="margin-top: 20px; color: #666;">
            This is an automated reminder from ByteForge FocusFlow.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    // Mark reminder as sent
    task.reminderSent = true;
    await task.save();

    res.json({ success: true, message: "Reminder email sent successfully" });
  } catch (error) {
    console.error("Error sending reminder email:", error);
    res.status(500).json({ error: "Failed to send reminder email", details: error.message });
  }
}

export async function processReminders() {
  try {
    const now = new Date();
    const tasks = await Task.find({
      completed: false,
      reminderDate: { $lte: now },
      reminderSent: false,
    }).populate("user", "email");

    const transporter = createTransporter();
    if (!transporter) {
      console.log("Email service not configured. Skipping email reminders.");
      return;
    }

    for (const task of tasks) {
      if (task.user && task.user.email) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: task.user.email,
            subject: `Reminder: ${task.text}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0ea5e9;">Task Reminder</h2>
                <p><strong>Task:</strong> ${task.text}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Due:</strong> ${new Date(task.reminderDate).toLocaleString()}</p>
                ${task.notes ? `<p><strong>Notes:</strong> ${task.notes}</p>` : ""}
                <p style="margin-top: 20px; color: #666;">
                  This is an automated reminder from ByteForge FocusFlow.
                </p>
              </div>
            `,
          });

          task.reminderSent = true;
          await task.save();
        } catch (error) {
          console.error(`Error sending reminder for task ${task._id}:`, error);
        }
      }
    }

    // Process recurring tasks
    const recurringTasks = await Task.find({
      completed: true,
      "recurring.enabled": true,
      "recurring.nextDue": { $lte: now },
    });

    for (const task of recurringTasks) {
      const newTask = await Task.create({
        user: task.user,
        text: task.text,
        priority: task.priority,
        category: task.category,
        notes: task.notes,
        recurring: {
          enabled: true,
          pattern: task.recurring.pattern,
          nextDue: calculateNextDue(task.recurring.pattern, now),
        },
      });
    }
  } catch (error) {
    console.error("Error processing reminders:", error);
  }
}

function calculateNextDue(pattern, currentDate) {
  const next = new Date(currentDate);
  switch (pattern) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
  }
  return next;
}

// Run reminder processor every minute
if (process.env.NODE_ENV !== "test") {
  setInterval(processReminders, 60000); // Every minute
}

