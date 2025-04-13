export const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const monthsOfYear = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatDate(dateInput) {
  const date = new Date(dateInput);
  const options = { month: 'short', day: '2-digit', year: 'numeric' };
  const formatted = date.toLocaleDateString('en-US', options);
  return formatted.replace(',', '');
}

export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export function combineDateAndTimeToISO(date, time) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const fullTime = time.includes(':') && time.length === 5 ? `${time}:00` : time;

  const combined = `${year}-${month}-${day}T${fullTime}`;
  const combinedDate = new Date(combined);
  return combinedDate.toISOString();
  
}