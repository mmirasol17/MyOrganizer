import React, { useState, useEffect, useRef } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameWeek, isSameDay } from "date-fns";
import Dropdown from "../ui/Dropdown";

// * view mode options for the calendar
const viewModeOptions = [
  {
    label: "Month",
    value: "month",
  },
  {
    label: "Week",
    value: "week",
  },
];

export default function Calendar({ user }) {
  // * calendar view mode management
  const [viewMode, setViewMode] = useState("month");
  const handleViewModeChange = (modeOption) => {
    setViewMode(modeOption.value);
  };

  // * calendar date management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  // * popup management for selected day
  const [selectedDay, setSelectedDay] = useState(null);
  const selectedDayPopupRef = useRef(null);

  // * popup management for selected event
  const [selectedEvent, setSelectedEvent] = useState(null);
  const selectedEventPopupRef = useRef(null);

  // * popup management for new event
  const [newEvent, setNewEvent] = useState(null);
  const newEventPopupRef = useRef(null);
  const [editEvent, setEditEvent] = useState(null);

  // * month calendar date management
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const monthStartDate = startOfWeek(monthStart);
  const monthEndDate = endOfWeek(monthEnd);

  // * week calendar date management
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(weekStart);
  const weekStartDate = startOfWeek(weekStart);
  const weekEndDate = endOfWeek(weekEnd);

  const days = [];
  let day = monthStartDate;

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

  // * For changing months on the month calendar
  const handlePrevMonth = () => {
    setCurrentDate(addDays(monthStart, -1));
  };
  const handleNextMonth = () => {
    setCurrentDate(addDays(monthEnd, 1));
  };

  // * For changing weeks on the week calendar
  const handlePrevWeek = () => {
    setCurrentDate(addDays(weekStart, -7));
  };
  const handleNextWeek = () => {
    setCurrentDate(addDays(weekEnd, 7));
  };

  // * For when the user clicks on a day date number
  const handleDayClick = (day) => {
    setSelectedDay(day);
  };
  const handleDayPopupClose = () => {
    setSelectedDay(null);
  };

  // * For when the user clicks on an event
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };
  const handleEventPopupClose = () => {
    setSelectedEvent(null);
  };

  // * For when the user clicks on a day event
  const handleDayEventClick = (event) => {
    setNewEvent(event);
  };
  const handleNewEventPopupClose = () => {
    setNewEvent(null);
  };

  // * For getting the events for a day
  const getEventsForDay = (day) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".popup")) {
        setSelectedDay(null);
        console.log("selectedDay is " + selectedDay);
      }
    };

    if (selectedDayPopupRef.current) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [selectedDayPopupRef, selectedDay]);

  const renderEventButton = (count) => {
    return (
      <button className="text-blue-500 font-bold" onClick={() => setSelectedDay(day)}>
        {`+${count} more`}
      </button>
    );
  };

  const showMonthView = () => {
    while (day <= monthEndDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return (
      <div className="w-full p-2 text-center overflow-y-auto no-scrollbar">
        <div className="flex flex-col">
          <div className="flex items-center pb-1 justify-center">
            <button className="bg-gray-800 rounded-full p-0.5 transition hover:scale-110 hover:bg-gray-600" onClick={handlePrevMonth}>
              <svg className="w-7 h-7 fill-white" fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M604.7 759.2l61.8-61.8L481.1 512l185.4-185.4-61.8-61.8L357.5 512z"></path>
                </g>
              </svg>
            </button>
            <h2 className="text-2xl font-bold w-60">{format(monthStart, "MMMM yyyy")}</h2>
            <button className="bg-gray-800 rounded-full p-0.5 transition hover:scale-110 hover:bg-gray-600" onClick={handleNextMonth}>
              <svg className="w-7 h-7 fill-white" fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M419.3 264.8l-61.8 61.8L542.9 512 357.5 697.4l61.8 61.8L666.5 512z"></path>
                </g>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayOfWeek) => (
              <div key={dayOfWeek} className="p-1 text-center font-bold">
                {dayOfWeek}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-[0.5px] border-gray-300">
            {days.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelectedDay = isSameDay(day, selectedDay);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toString()}
                  className={`p-0.5 cursor-pointer text-center border-[0.5px] border-gray-300 ${isCurrentMonth ? "text-gray-800" : "text-gray-400"} ${
                    isSelectedDay ? "bg-blue-200" : ""
                  }`}
                  style={{
                    height: "90px",
                  }}
                  onClick={() => {
                    handleDayEventClick(day);
                  }}
                >
                  <div className="w-full cursor-pointer flex items-center justify-center">
                    <div
                      className={`font-bold w-6 text-sm p-0.5 mb-0.5 rounded-full transition hover:scale-110 ${
                        isToday ? "text-white bg-blue-500 hover:bg-blue-700" : "hover:bg-gray-300"
                      } ${isSelectedDay ? "text-blue-500" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDayClick(day);
                      }}
                    >
                      {format(day, "d")}
                    </div>
                  </div>

                  {dayEvents.map((event, index) =>
                    index < 2 ? (
                      <div
                        className={`transition hover:scale-105 rounded-md overflow-hidden overflow-ellipsis whitespace-nowrap flex text-xs px-0.5 mb-0.5 bg-${event.color}-200 hover:bg-${event.color}-400`}
                        key={event.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        <div>{event.time} |&nbsp;</div>
                        <div className="font-bold">{event.name}</div>
                      </div>
                    ) : index === 2 ? (
                      renderEventButton(dayEvents.length - 2)
                    ) : null
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const showWeekView = () => {
    const weekDays = [];
    let day = weekStartDate;

    while (day <= weekEndDate) {
      weekDays.push(day);
      day = addDays(day, 1);
    }

    return (
      <div className="w-full p-2 text-center overflow-y-auto no-scrollbar">
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <button className="bg-gray-800 rounded-full p-0.5 transition hover:scale-110 hover:bg-gray-600" onClick={handlePrevWeek}>
              <svg className="w-7 h-7 fill-white" fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M604.7 759.2l61.8-61.8L481.1 512l185.4-185.4-61.8-61.8L357.5 512z"></path>
                </g>
              </svg>
            </button>
            <h2 className="text-2xl font-bold w-80">{`${format(weekStartDate, "MMMM d")} - ${format(weekEndDate, "MMMM d, yyyy")}`}</h2>
            <button className="bg-gray-800 rounded-full p-0.5 transition hover:scale-110 hover:bg-gray-600" onClick={handleNextWeek}>
              <svg className="w-7 h-7 fill-white" fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M419.3 264.8l-61.8 61.8L542.9 512 357.5 697.4l61.8 61.8L666.5 512z"></path>
                </g>
              </svg>
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-8">
            <div className="p-2 items-center"></div> {/* Empty column */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayOfWeek) => (
              <div key={dayOfWeek} className="p-2 pb-0 text-center">
                {/* if the day of week is today */}
                {dayOfWeek === format(new Date(), "eee") && isSameWeek(new Date(), currentDate) ? (
                  <div className="font-bold text-blue-500">{dayOfWeek}</div>
                ) : (
                  <div className="font-bold">{dayOfWeek}</div>
                )}
              </div>
            ))}
          </div>

          {/* Date Labels */}
          <div className="grid grid-cols-8 pb-1">
            <div className="p-2 font-bold"></div> {/* Empty column */}
            {/* Day Numbers */}
            {weekDays.map((weekDay) => {
              const isToday = isSameDay(weekDay, new Date());
              const isSelectedDay = isSameDay(weekDay, selectedDay);
              return (
                <div className="flex items-center justify-center w-full" key={weekDay.toString()}>
                  <div className={`font-bold w-8 ${isToday ? "text-white bg-blue-500 rounded-full p-1" : ""} ${isSelectedDay ? "text-blue-500" : ""}`}>
                    {format(weekDay, "d")}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-8 border border-b-0 border-gray-300">
            <div className="border-r border-gray-300">
              {/* Timeline */}
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="border-b-1.5 font-bold border-gray-300 p-1">
                  {`${(i % 12 === 0 ? 12 : i % 12).toString()} ${i < 12 ? "AM" : "PM"}`}
                </div>
              ))}
            </div>

            {/* Content of each day */}
            {weekDays.map((weekDay) => {
              const dayEvents = getEventsForDay(weekDay);

              return (
                <>
                  <div
                    key={weekDay.toString()}
                    className={`text-center border h-full border-gray-300`}
                    onClick={() => {
                      handleDayClick(weekDay);
                    }}
                  >
                    {Array.from({ length: 23 }, (_, i) => (
                      <div key={i} className="border-b border-gray-300 relative" style={{ height: "33px" }}>
                        {i !== 0 && <div className="h-full absolute bg-gray-300" style={{ top: 0, left: 0, right: 0, zIndex: -1 }}></div>}
                      </div>
                    ))}

                    {dayEvents.map((event, index) =>
                      index < 2 ? <div key={event.name}>{event.name}</div> : index === 2 ? renderEventButton(dayEvents.length - 2) : null
                    )}
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-blue-200 grid grid-cols-3 rounded-t-lg w-full h-12 font-bold items-center px-2 sticky">
        <div className="col-span-1 justify-self-start">
          {/* button to go to the week or month of today */}
          <button
            className="inline-flex items-center justify-center py-2 px-4 my-1.5 text-sm text-white font-bold bg-gray-800 rounded-md hover:bg-gray-600 focus:outline-none"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </button>
        </div>
        <div className="col-span-1 justify-center flex items-center gap-1">
          <div>My Calendar</div>
          <svg className="h-6 w-6" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M12,14a1,1,0,1,0-1-1A1,1,0,0,0,12,14Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,14Zm-5,4a1,1,0,1,0-1-1A1,1,0,0,0,12,18Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,18ZM7,14a1,1,0,1,0-1-1A1,1,0,0,0,7,14ZM19,4H18V3a1,1,0,0,0-2,0V4H8V3A1,1,0,0,0,6,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H19a1,1,0,0,1,1,1ZM7,18a1,1,0,1,0-1-1A1,1,0,0,0,7,18Z"></path>
            </g>
          </svg>
        </div>
        {/* Calendar title in the middle */}
        <div className="col-span-1 justify-self-end my-1.5">
          <Dropdown options={viewModeOptions} selectedOption={viewModeOptions.find((option) => option.value === viewMode)} setSelectedOption={handleViewModeChange} />
        </div>
      </div>

      {viewMode === "month" && showMonthView()}
      {viewMode === "week" && showWeekView()}

      {selectedDay && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg popup" ref={selectedDayPopupRef}>
            <div className="text-xl font-bold mb-2">
              {format(selectedDay, "eeee")}, {format(selectedDay, "MMMM d, yyyy")}
            </div>
            {getEventsForDay(selectedDay).length > 0 ? (
              getEventsForDay(selectedDay).map((event) => <div key={event.name}>{event.name}</div>)
            ) : (
              <div>No events for this day</div>
            )}
            <button className="text-blue-500 font-bold mt-4" onClick={handleDayPopupClose}>
              Close
            </button>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="edit-note-popup fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* popup content */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {/* popup header */}
              <div className={`bg-${selectedEvent.color}-200 px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                      {selectedEvent.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* popup body */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
                  <p className="text-gray-700 text-base">{format(selectedEvent.date, "eeee, MMMM d, yyyy")}</p>

                  <label className="block text-gray-700 text-sm font-bold mb-2">Time:</label>
                  <p className="text-gray-700 text-base">{selectedEvent.time}</p>

                  <label className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                  <p className="text-gray-700 text-base">{selectedEvent.type}</p>
                </div>
              </div>

              {/* popup footer */}
              <div className={`bg-${selectedEvent.color}-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-${selectedEvent.color}-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${selectedEvent.color}-500 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={handleEventPopupClose}
                >
                  Close
                </button>

                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white bg-${selectedEvent.color}-500 hover:bg-${selectedEvent.color}-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${selectedEvent.color}-500 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={() => {
                    setEditEvent(selectedEvent);
                    handleEventPopupClose();
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {newEvent && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg popup" ref={newEventPopupRef}>
            <div className="text-xl font-bold mb-2">New Event</div>
            {/* <div className="text-sm mb-2">{format(newEvent.date, "eeee, MMMM d, yyyy")}</div>
            <div className="text-sm mb-2">{newEvent.time}</div>
            <div className="text-sm mb-2">{newEvent.type}</div> */}
            <button className="text-blue-500 font-bold mt-4" onClick={handleNewEventPopupClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
