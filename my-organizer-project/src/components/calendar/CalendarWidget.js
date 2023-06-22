import React, { useState, useEffect } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { db, collection, doc, getDocs } from "../../firebase/FirebaseConfig";
import Widget from "../ui/Widget";
import CalendarHeader from "./CalendarHeader";
import CalendarMonth from "./CalendarMonth";
import CalendarWeek from "./CalendarWeek";
import EventPopup from "./EventPopup";
import DayPopup from "./DayPopup";
import EventAddPopup from "./EventAddPopup";

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
            id: `${year}: ${holiday.name}`,
            name: holiday.name,
            date: new Date(holiday.date),
            type: "holiday",
            time: "all-day",
            color: "red",
          }));
          const uniqueHolidays = formattedHolidays.filter((holiday, index, self) => index === self.findIndex((t) => t.name === holiday.name));
          setEvents((prevEvents) => {
            const filteredHolidays = uniqueHolidays.filter((holiday) => {
              return !prevEvents.some((event) => event.id === holiday.id && event.type === "holiday");
            });
            return [...prevEvents, ...filteredHolidays];
          });
        } else {
          console.error("Failed to fetch holidays");
        }
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    fetchHolidays();
  }, [currentDate]);

  // * Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const eventsRef = collection(userRef, "events");
        const snapshot = await getDocs(eventsRef);
        if (!snapshot.empty) {
          const fetchedEvents = snapshot.docs.map((doc) => {
            const eventData = doc.data();
            return {
              id: doc.id,
              ...eventData,
              date: eventData.date.toDate(),
            };
          });
          const uniqueEvents = fetchedEvents.filter((event, index, self) => index === self.findIndex((t) => t.id === event.id));
          setEvents((prevEvents) => {
            const filteredEvents = uniqueEvents.filter((event) => {
              return !prevEvents.some((prevEvent) => prevEvent.id === event.id);
            });
            return [...prevEvents, ...filteredEvents];
          });
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
    if (user) {
      fetchEvents();
      console.log("fetching events" + events);
    }
  }, [user]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  // * For when the user clicks on an event
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // * For when the user clicks on a day to add an event
  const handleNewEventClick = (day) => {
    setEventAdd(day);
  };

  // * For getting the events for a day
  const getEventsForDay = (day) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  const renderEventButton = (count) => {
    return (
      <button className="text-xs font-bold" onClick={() => setSelectedDay(day)}>
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
          handleNewEventClick={handleNewEventClick}
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
          handleNewEventClick={handleNewEventClick}
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
      <EventAddPopup user={user} eventAdd={eventAdd} setEventAdd={setEventAdd} setEvents={setEvents} />

      {/* event edit popup that shows up if user wants to edit an event */}
    </Widget>
  );
}
