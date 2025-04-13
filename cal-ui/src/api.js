import { combineDateAndTimeToISO, getParsedDate } from './utils';

export const createEvent = async eventData => {
  const formData = new FormData();

  formData.append('title', eventData.title);
  formData.append('description', eventData.description);
  formData.append(
    'startTime',
    combineDateAndTimeToISO(eventData.date, eventData.time)
  );
  if (eventData.media) formData.append('file', eventData.media);

  const response = await fetch('http://localhost:3000/events/create', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create event');
  }

  return await response.json();
};

export const updateEvent = async (
  id,
  { title, description, date, time, media }
) => {
  const formData = new FormData();
  formData.append('title', title);

  if (description) {
    formData.append('description', description);
  }

  formData.append('startTime', combineDateAndTimeToISO(date, time));
  if (media) {
    formData.append('file', media);
  }
  console.log(title);
  const res = await fetch(`http://localhost:3000/events/${id}`, {
    method: 'PATCH',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to update event');
  }

  return res.json();
};

export const deleteEvent = async id => {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.Json();
    throw new Error(`Failed to delete event: ${errorData.message}`);
  }
};

export const fetchEventsByDate = async selectedDate => {
  try {
    const response = await fetch(
      `http://localhost:3000/events/date/${getParsedDate(selectedDate)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unable to fetch events');
    }

    const events = await response.json();
    return events;
  } catch (error) {
    console.error('Failed to fetch events by date:', error);
  }
};
