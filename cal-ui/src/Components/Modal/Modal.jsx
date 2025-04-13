import { React } from "react";
import "./Modal.css";

const Modal = ({ isOpen, onSnooze, onDismiss, event }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>
          <strong>Start Time:</strong>{" "}
          {new Date(event.startTime).toLocaleString()}
        </p>
        <button onClick={onSnooze}>Snooze 5min</button>
        <button onClick={onDismiss}>Dismiss</button>
      </div>
    </div>
  );
};

export default Modal;