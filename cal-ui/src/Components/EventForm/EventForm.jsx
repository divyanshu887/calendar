import React from 'react';

const EventForm = ({
  show,
  onClose,
  onSubmit,
  editingEvent,
  hours,
  setHours,
  minutes,
  setMinutes,
  title,
  setTitle,
  description,
  setDescription,
  media,
  handleMediaChange,
  removeMedia,
  fileInputRef,
}) => {
  if (!show) return null;

  const handleHourChange = e => {
    const value = Math.max(0, Math.min(23, e.target.valueAsNumber || 0));
    setHours(value.toString().padStart(2, '0'));
  };

  const handleMinuteChange = e => {
    const value = Math.max(0, Math.min(59, e.target.valueAsNumber || 0));
    setMinutes(value.toString().padStart(2, '0'));
  };

  return (
    <div className="event-popup">
      <h3>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>

      <div className="event-time-input">
        <div className="event-popup-time">Time</div>
        <input
          type="number"
          name="hours"
          min="0"
          max="23"
          className="hours"
          value={hours}
          required
          onChange={handleHourChange}
          onBlur={e => e.target.value === '' && setHours('00')}
        />
        <span>:</span>
        <input
          type="number"
          name="minutes"
          min="0"
          max="59"
          className="minutes"
          value={minutes}
          onChange={handleMinuteChange}
          onBlur={e => e.target.value === '' && setMinutes('00')}
        />
      </div>

      <textarea
        placeholder="Enter Event Title (Max 20 Characters)"
        maxLength={20}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Enter Event Description (Max 120 Characters)"
        maxLength={120}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <div className="event-media">
        <input
          type="file"
          name="media"
          accept="image/*,video/*"
          className="event-media-input"
          onChange={handleMediaChange}
          ref={fileInputRef}
        />
        {media && (
          <button
            className="event-media-remove-btn"
            onClick={removeMedia}
            type="button"
          >
            <i className="bx bxs-trash-alt"></i>
          </button>
        )}
      </div>

      <button className="event-popup-btn" onClick={onSubmit}>
        {editingEvent ? 'Save Changes' : 'Add Event'}
      </button>

      <button className="event-popup-close-btn" onClick={onClose}>
        <i className="bx bx-x"></i>
      </button>
    </div>
  );
};

export default EventForm;
