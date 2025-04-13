import React from 'react';
import './EventCard.css';
import { formatDate, isSameDay , formatTime} from '../../utils';

const EventCard = ({
  event,
  selectedDate,
  handleEditEvent,
  handleDeleteEvent,
}) => {
  const eventDate = new Date(event.startTime);
  if (!isSameDay(eventDate, selectedDate)) return null;

  return (
    <div key={event.id} className="event">
      <div className="event-date-wrapper">
      
        <div className="event-date">{formatDate(event.startTime)}</div>
        <div className="event-time">{formatTime(event.startTime)}</div>
      </div>

      <div className="event-content">
        <div className="event-title">{event.title}</div>
        <div className="event-text">{event.description}</div>

        {event?.media && typeof event.media === 'object' && event.media.mimetype ? (
          
          event.media.mimetype.startsWith('video/') ? (
            <video
              src={URL.createObjectURL(new Blob([new Uint8Array(event.media.buffer)], { type: event.media.mimetype }))}
              controls
              className="event-media-content"
            />
          ) : event.media.mimetype.startsWith('image/') ? (
            
            <img
              src={URL.createObjectURL(new Blob([new Uint8Array(event.media.buffer.data)], { type: event.media.mimetype }))}
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
