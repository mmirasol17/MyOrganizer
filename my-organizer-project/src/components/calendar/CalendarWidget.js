import React, { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import Widget from "../ui/Widget";
import CalendarHeader from "./CalendarHeader";
import CalendarMonth from "./CalendarMonth";
import CalendarWeek from "./CalendarWeek";
import EventPopup from "./EventPopup";
import DayPopup from "./DayPopup";

export default function CalendarWidget({ user }) {
  // * calendar view mode management
  const [viewMode, setViewMode] = useState("month");

  // * calendar date management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  // * popup management for a calendar day
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayEdit, setDayEdit] = useState(null);

  // * popup management for a calendar event
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventAdd, setEventAdd] = useState(null);
  const [eventEdit, setEventEdit] = useState(null);

  let day = new Date();

  // * Fetch holidays via the date.nager.at API
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const year = currentDate.getFullYear();
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/US`);
        if (response.ok) {
          const holidays = await response.json();
          const formattedHolidays = holidays.map((holiday) => ({
            name: holiday.name,
            date: new Date(holiday.date),
            type: "holiday",
            time: "all-day",
            color: "red",
          }));
          const uniqueHolidays = formattedHolidays.filter((holiday, index, self) => index === self.findIndex((t) => t.name === holiday.name));
          setEvents(uniqueHolidays);
        } else {
          console.error("Failed to fetch holidays");
        }
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    fetchHolidays();
  }, [currentDate]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  // * For when the user clicks on an event
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // * For when the user clicks on a day event
  const handleDayEventClick = (event) => {
    setEventAdd(event);
  };
  const handleeventAddPopupClose = () => {
    setEventAdd(null);
  };

  // * For getting the events for a day
  const getEventsForDay = (day) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  const renderEventButton = (count) => {
    return (
      <button className="text-blue-500 font-bold" onClick={() => setSelectedDay(day)}>
        {`+${count} more`}
      </button>
    );
  };

  return (
    <Widget id="calendar">
      {/* widget header */}
      <CalendarHeader setCurrentDate={setCurrentDate} viewMode={viewMode} setViewMode={setViewMode} />

      {/* show month calendar if user chooses to see the month view mode */}
      {viewMode === "month" && (
        <CalendarMonth
          handleDayClick={handleDayClick}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          events={events}
          setEvents={setEvents}
          getEventsForDay={getEventsForDay}
          handleDayEventClick={handleDayEventClick}
          handleEventClick={handleEventClick}
          renderEventButton={renderEventButton}
        />
      )}
      {/* show week calendar if user chooses to see the week view mode */}
      {viewMode === "week" && (
        <CalendarWeek
          handleDayClick={handleDayClick}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          events={events}
          setEvents={setEvents}
          getEventsForDay={getEventsForDay}
          handleDayEventClick={handleDayEventClick}
          handleEventClick={handleEventClick}
          renderEventButton={renderEventButton}
        />
      )}

      {/* day popup that will show up if a day is selected */}
      <DayPopup selectedDay={selectedDay} getEventsForDay={getEventsForDay} setSelectedDay={setSelectedDay} setDayEdit={setDayEdit} />

      {/* day edit popup if user wants to edit the events in a day  */}

      {/* event popup that will show up if an event is selected */}
      <EventPopup selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} setEventEdit={setEventEdit} />

      {/* event add popup that shows up if user wants to create new event for a day */}
      {eventAdd && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg popup">
            <div className="text-xl font-bold mb-2">New Event</div>
            {/* <div className="text-sm mb-2">{format(eventAdd.date, "eeee, MMMM d, yyyy")}</div>
            <div className="text-sm mb-2">{eventAdd.time}</div>
            <div className="text-sm mb-2">{eventAdd.type}</div> */}
            <button className="text-blue-500 font-bold mt-4" onClick={handleeventAddPopupClose}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* event edit popup that shows up if user wants to edit an event */}
    </Widget>
  );
}
