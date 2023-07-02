import React, { useState, useEffect } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { db, collection, doc, setDoc, getDocs } from "../../firebase/FirebaseConfig";
import Widget from "../ui/Widget";
import CalendarHeader from "./CalendarHeader";
import CalendarMonth from "./CalendarMonth";
import CalendarWeek from "./CalendarWeek";
import EventPopup from "./EventPopup";
import DayPopup from "./DayPopup";
import EventAddPopup from "./EventAddPopup";

export default function CalendarWidget({ user }) {
  // * calendar settings
  const [viewMode, setViewMode] = useState("month");
  const [highlightWeekends, setHighlightWeekends] = useState(false);

  // * calendar date management
  const [todaysDate, setTodaysDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  // * popup management for a calendar day
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayEdit, setDayEdit] = useState(null);

  // * popup management for a calendar event
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventAdd, setEventAdd] = useState(null);
  const [eventEdit, setEventEdit] = useState(null);

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
            color: "#FCA5A5",
            name: holiday.name,
            date: new Date(holiday.date),
            startTime: "",
            endTime: "",
            type: "holiday",
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
        const calendarEventsRef = collection(userRef, "calendar_events");
        const snapshot = await getDocs(calendarEventsRef);
        if (!snapshot.empty) {
          const fetchedEvents = snapshot.docs.map((doc) => {
            const eventData = doc.data();
            return {
              id: doc.id,
              ...eventData,
              date: eventData.date.toDate(),
            };
          });
          setEvents((prevEvents) => {
            const filteredEvents = fetchedEvents.filter((event) => {
              return !prevEvents.some((prevEvent) => prevEvent.id === event.id);
            });
            return [...prevEvents, ...filteredEvents];
          });
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
    if (user && events.length === 0) {
      fetchEvents();
      console.log("fetching events" + events);
    }
  }, [user, events]);

  // * fetch the highlight weekends setting from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const settingsRef = collection(userRef, "calendar_settings");
        const querySnapshot = await getDocs(settingsRef);
        if (!querySnapshot.empty) {
          const settingsDoc = querySnapshot.docs[0];
          const settingsData = settingsDoc.data();
          setHighlightWeekends(settingsData.highlightWeekends);
          setViewMode(settingsData.viewMode);
        } else {
          const newSettings = {
            highlightWeekends: false,
            viewMode: "month",
          };
          await setDoc(doc(settingsRef), newSettings);
        }
      } catch (error) {
        console.error("Error fetching calendar settings: ", error);
      }
    };
    if (user) fetchSettings();
  }, [user, highlightWeekends]);

  // * keep updating currentDate with an interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTodaysDate(new Date());
    }, 1000); // 1 second
    return () => clearInterval(interval);
  }, []);

  // * functions for handling user events
  const handleDayClick = (day) => {
    setSelectedDay(day);
  };
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };
  const handleNewEventClick = (day) => {
    setEventAdd(day);
  };

  // * get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  return (
    <Widget id="calendar">
      {/* widget header */}
      <CalendarHeader
        user={user}
        viewMode={viewMode}
        highlightWeekends={highlightWeekends}
        setCurrentDate={setCurrentDate}
        setEvents={setEvents}
        setViewMode={setViewMode}
        setHighlightWeekends={setHighlightWeekends}
      />

      {/* show month calendar if user chooses to see the month view mode */}
      {viewMode === "month" && (
        <CalendarMonth
          todaysDate={todaysDate}
          currentDate={currentDate}
          selectedDay={selectedDay}
          eventAdd={eventAdd}
          highlightWeekends={highlightWeekends}
          setCurrentDate={setCurrentDate}
          setEvents={setEvents}
          getEventsForDay={getEventsForDay}
          handleDayClick={handleDayClick}
          handleEventClick={handleEventClick}
          handleNewEventClick={handleNewEventClick}
        />
      )}
      {/* show week calendar if user chooses to see the week view mode */}
      {viewMode === "week" && (
        <CalendarWeek
          todaysDate={todaysDate}
          currentDate={currentDate}
          selectedDay={selectedDay}
          eventAdd={eventAdd}
          highlightWeekends={highlightWeekends}
          setCurrentDate={setCurrentDate}
          setEvents={setEvents}
          getEventsForDay={getEventsForDay}
          handleDayClick={handleDayClick}
          handleEventClick={handleEventClick}
          handleNewEventClick={handleNewEventClick}
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
