import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { formatDate, isSameDay, formatTime } from '../utils';

import '../Components/CalendarApp.css';

import Calendar from './Calendar/Calendar';
import EventCard from './EventCard/EventCard';
import EventFormPopup from './EventForm/EventForm';
import {
  createEvent,
  deleteEvent,
  fetchEventsByDate,
  updateEvent,
} from '../api';
import { useSocket } from '../Context/SocketContext';
import Modal from './Modal/Modal';

const CalendarApp = () => {
  const curDate = new Date();
  const [curMonth, setCurMonth] = useState(curDate.getMonth());
  const [curYear, setCurYear] = useState(curDate.getFullYear());

  const [selectedDate, SetSelectedDate] = useState(curDate);
  const [showEventPopup, SetShowEventPopup] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const prevMonth = () => {
    setCurMonth(prevMonth => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurYear(prevYear => (curMonth === 0 ? prevYear - 1 : prevYear));
  };

  const nextMonth = () => {
    setCurMonth(prevMonth => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurYear(prevYear => (curMonth === 11 ? prevYear + 1 : prevYear));
  };

  const handleDayClick = day => {
    const clickedDate = new Date(curYear, curMonth, day);
    const today = new Date();

    if (clickedDate >= today || isSameDay(clickedDate, today)) {
      SetSelectedDate(clickedDate);
      SetShowEventPopup(true);
      setEditingEvent(null);
    }
  };

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getSelectedDateEvents = async () => {
      try {
        const data = await fetchEventsByDate(selectedDate);
        console.log(data);

        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    if (selectedDate) {
      getSelectedDateEvents();
    }
  }, [selectedDate]);

  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const [openAlerts, setOpenAlerts] = useState({});

  const handleDismiss = id => {
    setAlerts(prevAlerts => prevAlerts.filter(a => a.id !== id));
    setOpenAlerts(prev => ({ ...prev, [id]: false }));
  };

  const handleSnooze = id => {
    setOpenAlerts(prev => ({ ...prev, [id]: false }));
    setTimeout(() => {
      setOpenAlerts(prev => ({ ...prev, [id]: true }));
    }, 5 * 60 * 1000);
  };

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('eventStarting', event => {
      console.log('Event starting:', event);
      setAlerts(prevAlerts => [...prevAlerts, event]);
    });
  }, [socket]);

  const fileInputRef = useRef(null);

  const handleAddEvent = () => {
    const eventPayload = {
      title,
      description,
      date: selectedDate,
      time: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`,
      media,
    };

    const apiResponse = editingEvent
      ? updateEvent(editingEvent.id, eventPayload)
      : createEvent(eventPayload);

    apiResponse
      .then(data => {

        const newEvent = {
          id: data.id,
          ...eventPayload,
        };

        setEvents(prevEvents => {
          if (editingEvent) {
            return prevEvents.map(event =>
              event.id === editingEvent.id ? newEvent : event
            );
          }
          return [...prevEvents, newEvent];
        });
        setHours('00');
        setMinutes('00');
        setTitle('');
        setDescription('');
        setMedia(null);
        SetShowEventPopup(false);
        setEditingEvent(null);
      })
      .catch(error => {
        alert(`Error: ${error.message}`);
      });
  };

  const handleEditEvent = event => {
    SetSelectedDate(new Date(event.startTime));
    setHours(formatTime(event.startTime).split(':')[0]);
    setMinutes(formatTime(event.startTime).split(':')[1]);
    setTitle(event.title);
    setDescription(event.description);
    setMedia(event?.media);
    setEditingEvent(event);
    SetShowEventPopup(true);
  };

  const handleMediaChange = e => {
    const file = e.target.files[0];
    setMedia(file);
  };

  const removeMedia = () => {
    setMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteEvent = async id => {
    try {
      await deleteEvent(id);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="calendar-app">
      <Calendar
        curMonth={curMonth}
        curYear={curYear}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        handleDayClick={handleDayClick}
        selectedDate={selectedDate}
      />

      <div className="events">
        {showEventPopup && (
          <EventFormPopup
            show={showEventPopup}
            onClose={() => SetShowEventPopup(false)}
            onSubmit={handleAddEvent}
            editingEvent={editingEvent}
            hours={hours}
            setHours={setHours}
            minutes={minutes}
            setMinutes={setMinutes}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            media={media}
            handleMediaChange={handleMediaChange}
            removeMedia={removeMedia}
            fileInputRef={fileInputRef}
          />
        )}

        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            selectedDate={selectedDate}
            formatDate={formatDate}
            handleEditEvent={handleEditEvent}
            handleDeleteEvent={handleDeleteEvent}
            isSameDay={isSameDay}
          />
        ))}
      </div>
      {alerts.map(alert => (
        <Modal
          key={alert.id}
          isOpen={openAlerts[alert.id] ?? true}
          event={alert}
          onDismiss={() => handleDismiss(alert.id)}
          onSnooze={() => handleSnooze(alert.id)}
        />
      ))}
    </div>
  );
};

export default CalendarApp;
