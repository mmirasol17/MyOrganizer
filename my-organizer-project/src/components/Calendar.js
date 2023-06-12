import React, { useState, useEffect, useRef } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameWeek, isSameDay } from "date-fns";
import Dropdown from "./Dropdown";

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
  const [selectedDay, setSelectedDay] = useState(null);
  const selectedDayPopupRef = useRef(null);
  const newEventPopupRef = useRef(null);

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

  // * Fetch holidays
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
          }));
          // get rid of duplicate holidays
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

  while (day <= monthEndDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handlePrevMonth = () => {
    setCurrentDate(addDays(monthStart, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addDays(monthEnd, 1));
  };

  const handlePrevWeek = () => {
    setCurrentDate(addDays(weekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(weekEnd, 7));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handlePopupClose = () => {
    setSelectedDay(null);
  };

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
  }, [selectedDayPopupRef]);

  const renderEventButton = (count) => {
    return (
      <button className="text-blue-500 font-bold" onClick={() => setSelectedDay(day)}>
        {`+${count} more`}
      </button>
    );
  };

  const showMonthView = () => {
    return (
      <div className="w-full p-2 text-center overflow-y-auto no-scrollbar">
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <button className="bg-gray-800 rounded-full p-0.5 transition hover:scale-110 hover:bg-gray-600" onClick={handlePrevMonth}>
              <svg className="w-7 h-7 fill-white" fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M604.7 759.2l61.8-61.8L481.1 512l185.4-185.4-61.8-61.8L357.5 512z"></path>
                </g>
              </svg>
            </button>
            <h2 className="text-2xl font-bold w-60">{format(monthStart, "MMMM yyyy")}</h2>
            <button className="bg-gray-800 rounded-full p-0.5 transition hover:scale-110 hover:bg-gray-600" onClick={handleNextMonth}>
              <svg className="w-7 h-7 fill-white" fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M419.3 264.8l-61.8 61.8L542.9 512 357.5 697.4l61.8 61.8L666.5 512z"></path>
                </g>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayOfWeek) => (
              <div key={dayOfWeek} className="p-2 text-center font-bold">
                {dayOfWeek}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border border-gray-300">
            {days.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelectedDay = isSameDay(day, selectedDay);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toString()}
                  className={`p-1 text-center border border-gray-300 ${isCurrentMonth ? "text-gray-800" : "text-gray-400"} ${isSelectedDay ? "bg-blue-200" : ""}`}
                  style={{
                    height: "90px",
                  }}
                  onClick={() => {
                    handleDayClick(day);
                    console.log(day + " was clicked" + " selectedDay is " + selectedDay);
                  }}
                >
                  <div className={`font-bold w-8 ${isToday ? "text-white bg-blue-500 rounded-full p-1" : ""} ${isSelectedDay ? "text-blue-500" : ""}`}>
                    {format(day, "d")}
                  </div>

                  {dayEvents.map((event, index) =>
                    index < 2 ? (
                      <div className={`rounded-md text-xs mb-0.5 ${event.type === "holiday" && "bg-red-200"}`} key={event.name}>
                        {event.name}
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
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M604.7 759.2l61.8-61.8L481.1 512l185.4-185.4-61.8-61.8L357.5 512z"></path>
                </g>
              </svg>
            </button>
            <h2 className="text-2xl font-bold w-80">{`${format(weekStartDate, "MMMM d")} - ${format(weekEndDate, "MMMM d, yyyy")}`}</h2>
            <button className="bg-gray-800 rounded-full p-0.5 transition hover:scale-110 hover:bg-gray-600" onClick={handleNextWeek}>
              <svg className="w-7 h-7 fill-white" fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
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
        {/* Empty column */}
        <div className="col-span-1 justify-self-center">My Calendar</div> {/* Calendar title in the middle */}
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
            <button className="text-blue-500 font-bold mt-4" onClick={handlePopupClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
