import React from 'react';
import './EventCard.css';
import { formatDate, isSameDay } from '../../utils';

const EventCard = ({
  event,
  selectedDate,
  handleEditEvent,
  handleDeleteEvent,
}) => {
  if (!isSameDay(event.date, selectedDate)) return null;

  return (
    <div key={event.id} className="event">
      <div className="event-date-wrapper">
      
        <div className="event-date">{formatDate(event.date)}</div>
        <div className="event-time">{event.time}</div>
      </div>

      <div className="event-content">
        <div className="event-title">{event.title}</div>
        <div className="event-text">{event.description}</div>

        {event?.media && typeof event.media === 'object' && event.media.type ? (
          event.media.type.startsWith('video/') ? (
            <video
              src={URL.createObjectURL(event.media)}
              controls
              className="event-media-content"
            />
          ) : event.media.type.startsWith('image/') ? (
            <img
              src={URL.createObjectURL(event.media)}
              alt={event.media.name || 'event media'}
              className="event-media-content"
            />
          ) : null
        ) : null}
      </div>

      <div className="event-btns">
        <i
          className="bx bxs-edit-alt"
          onClick={() => handleEditEvent(event)}
        ></i>
        <i
          className="bx bxs-trash-alt"
          onClick={() => handleDeleteEvent(event.id)}
        ></i>
      </div>
    </div>
  );
};

export default EventCard;
