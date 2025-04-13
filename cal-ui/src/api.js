import { combineDateAndTimeToISO } from "./utils";

export const createEvent = async eventData => {

  const formData = new FormData();

  formData.append('title', eventData.title);
  formData.append('description', eventData.description);
  formData.append(
    'startTime',
    combineDateAndTimeToISO(eventData.date,eventData.time)
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


export const deleteEvent = async (id) => {
    const response = await fetch(`http://localhost:3000/events/${id}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete event: ${errorText}`);
    }
  };