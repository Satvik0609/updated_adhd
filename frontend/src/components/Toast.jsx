import { useEffect } from "react";
import Icon from "./Icon";

function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "warning";
      case "info":
        return "info";
      default:
        return "check-circle";
    }
  };

  const getColor = () => {
    switch (type) {
      case "success":
        return "var(--success-color)";
      case "error":
        return "var(--danger-color)";
      case "info":
        return "var(--info-color)";
      default:
        return "var(--success-color)";
    }
  };

  return (
    <div className={`toast toast-${type}`} style={{ borderLeftColor: getColor() }}>
      <div className="toast-icon">
        <Icon name={getIcon()} size={20} />
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}

export default Toast;

