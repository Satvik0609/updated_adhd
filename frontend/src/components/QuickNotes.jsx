import { useState, useEffect } from "react";
import Icon from "./Icon";

function QuickNotes() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("adhd_quick_notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("#fef3c7");

  useEffect(() => {
    localStorage.setItem("adhd_quick_notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote.trim(),
        color: selectedColor,
        createdAt: new Date().toISOString(),
      };
      setNotes([note, ...notes]);
      setNewNote("");
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const colorOptions = [
    { name: "Yellow", value: "#fef3c7" },
    { name: "Blue", value: "#dbeafe" },
    { name: "Green", value: "#d1fae5" },
    { name: "Pink", value: "#fce7f3" },
    { name: "Purple", value: "#e9d5ff" },
    { name: "Orange", value: "#fed7aa" },
  ];

  return (
    <div className="component">
      <h2>📝 Quick Notes</h2>
      <p className="description">
        Jot down quick thoughts, reminders, or ideas. Perfect for capturing those fleeting moments of inspiration!
      </p>

      <div className="card quick-notes-container">
        <div className="note-input-section">
          <textarea
            className="form-input note-input"
            placeholder="Write your note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows="3"
          />
          <div className="note-controls">
            <div className="color-picker">
              <span>Color:</span>
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  className={`color-option ${
                    selectedColor === color.value ? "active" : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>
            <button className="btn-primary" onClick={addNote}>
              <Icon name="plus" size={18} />
              Add Note
            </button>
          </div>
        </div>

        <div className="notes-grid">
          {notes.length === 0 ? (
            <div className="empty-state">
              <Icon name="file" size={48} />
              <p>No notes yet. Add your first quick note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="quick-note-card"
                style={{ backgroundColor: note.color }}
              >
                <div className="note-content">{note.text}</div>
                <div className="note-footer">
                  <span className="note-date">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    className="note-delete-btn"
                    onClick={() => deleteNote(note.id)}
                    title="Delete note"
                  >
                    <Icon name="x" size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default QuickNotes;

