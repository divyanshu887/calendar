import React from 'react';
import { useState, useRef } from 'react';
import { formatDate, isSameDay } from '../utils';

import '../Components/CalendarApp.css';

import Calendar from './Calendar/Calendar';
import EventCard from './EventCard/EventCard';
import EventFormPopup from './EventForm/EventForm';

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
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);

  const fileInputRef = useRef(null);

  const handleAddEvent = () => {
    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now(),
      time: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`,
      date: selectedDate,
      title,
      description,
      media,
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
  };

  const handleEditEvent = event => {
    
    SetSelectedDate(new Date(event.date));
    setHours(event.time.split(':')[0]);
    setMinutes(event.time.split(':')[1]);
    setTitle(event.title);
    setDescription(event.description);
    setMedia(event?.media);
    setEditingEvent(event);
    SetShowEventPopup(true);
  };

  const handleMediaChange = e => {
    console.log(e.target);
    const file = e.target.files[0];
    setMedia(file);
  };

  const removeMedia = () => {
    setMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteEvent = id => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
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
        {console.log(showEventPopup, 'wqjk')}
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
    </div>
  );
};

export default CalendarApp;
