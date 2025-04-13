import React from 'react';
import './Calendar.css';
import { daysOfWeek, monthsOfYear } from '../../utils';

const Calendar = ({
  curMonth,
  curYear,
  prevMonth,
  nextMonth,
  handleDayClick,
  selectedDate
}) => {
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(curYear, curMonth, 1).getDay();

  return (
    <div className="calendar">
      <h1 className="heading"> Calendar </h1>
      <div className="navigate-date">
        <h2 className="month">{monthsOfYear[curMonth]} </h2>
        <h2 className="year">{curYear}</h2>
        <div className="cal-btns">
          <i className="bx bx-chevron-left" onClick={prevMonth}></i>
          <i className="bx bx-chevron-right" onClick={nextMonth}></i>
        </div>
      </div>
      <div className="weekdays">
        {daysOfWeek.map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="days">
        {[...Array(firstDayOfMonth).keys()].map((_, index) => (
          <span key={`empty-${index}`} />
        ))}
        {[...Array(daysInMonth).keys()].map(day => (
          <span
            key={day + 1}
            className={
              day + 1 === selectedDate.getDate() &&
              curMonth === selectedDate.getMonth() &&
              curYear === selectedDate.getFullYear()
                ? 'current-day'
                : ''
            }
            onClick={() => handleDayClick(day + 1)}
          >
            {day + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
