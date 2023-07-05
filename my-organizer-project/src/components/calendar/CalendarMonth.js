import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { convertToRegularTime, shortenTime } from "./CalendarUtils";

export default function CalendarMonth({
  todaysDate,
  currentDate,
  selectedDay,
  selectedEvent,
  eventAdd,
  eventEdit,
  highlightWeekends,
  setCurrentDate,
  getEventsForDay,
  handleDayClick,
  handleNewEventClick,
  handleEventClick,
}) {
  // * month calendar date management
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const monthStartDate = startOfWeek(monthStart);
  const monthEndDate = endOfWeek(monthEnd);

  // * For changing months on the month calendar
  const handlePrevMonth = () => {
    setCurrentDate(addDays(monthStart, -1));
  };
  const handleNextMonth = () => {
    setCurrentDate(addDays(monthEnd, 1));
  };

  // * get all days in the month
  const days = [];
  let day = monthStartDate;
  while (day <= monthEndDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  // * month calendar UI
  return (
    <div className="w-full p-2 text-center overflow-y-auto no-scrollbar">
      <div className="flex flex-col">
        {/* month and year header indicator */}
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

        {/* day labels */}
        <div className="grid grid-cols-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayOfWeek) => (
            <div key={dayOfWeek} className="p-1 text-center font-bold">
              {dayOfWeek}
            </div>
          ))}
        </div>

        {/* grid of all month days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            // fetch event data for the day
            const dayEvents = getEventsForDay(day);
            // data required for styling calendar elements
            const isToday = isSameDay(day, todaysDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelectedDay = isSameDay(day, selectedDay);
            const isEventAdd = isSameDay(day, eventAdd);
            const isEventEdit = isSameDay(day, eventEdit);
            // data required for styling calendar grid
            const isTopRow = index < 7;
            const isMiddleColumn = index % 7 === 0;
            const isWeekend = highlightWeekends && (index % 7 === 0 || index % 7 === 6);
            return (
              <div
                key={day.toString()} // Assign a unique key using the date and index
                className={`
                  p-0.5 h-[92px] cursor-pointer text-center border-gray-400
                  ${isCurrentMonth ? "text-gray-800" : "text-gray-400"} 
                  ${isSelectedDay || isEventAdd || isEventEdit ? "bg-blue-200" : "bg-white"}
                  ${isTopRow ? "border-[0.5px]" : "border-[0.5px] border-t-0"}
                  ${isMiddleColumn ? "border-l-[0.5px]" : "border-l-0"}
                `}
                onClick={() => {
                  handleNewEventClick({
                    date: day,
                  });
                }}
                style={
                  { backgroundColor: isWeekend && !(isSelectedDay || isEventAdd) ? "#E5E4E2" : "" } // if it's a weekend, change the background color
                }
              >
                <div className="w-full cursor-pointer flex items-center justify-center">
                  <div
                    className={`
                      font-bold w-6 text-sm p-0.5 mb-0.5 rounded-full transition hover:scale-110 
                      ${isToday ? "text-white bg-blue-500 hover:bg-blue-700" : "hover:bg-gray-300"} 
                      ${isSelectedDay || isEventAdd ? "text-blue-500" : ""}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDayClick(day);
                    }}
                  >
                    {format(day, "d")}
                  </div>
                </div>

                {dayEvents.map((event, index) => {
                  const isEventSelected = event.id === selectedEvent?.id;
                  // sort the events by time, the events with no time will be at the top
                  dayEvents.sort((a, b) => {
                    if (a.startTime === "" && b.startTime === "") {
                      return 0;
                    } else {
                      return a.startTime.localeCompare(b.startTime);
                    }
                  });
                  // only show 4 events max, but if more than 4, show 3 events and a button to show the rest
                  if ((index < 4 && dayEvents.length <= 4) || (index < 3 && dayEvents.length > 4)) {
                    return (
                      <div
                        className={`
                          transition hover:scale-[102%] rounded-sm overflow-hidden overflow-ellipsis whitespace-nowrap flex text-xs/3 py-[0.9px] px-0.5 mb-0.5
                          ${isEventSelected ? "scale-[102%] shadow-2xl" : ""}
                        `}
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                        style={{ backgroundColor: event.color }}
                      >
                        {event.startTime !== "" && event.endTime !== "" && event.startTime !== "all-day" && event.endTime && (
                          <>
                            <div>{shortenTime(convertToRegularTime(event.startTime))}</div>-<div>{shortenTime(convertToRegularTime(event.endTime))}</div>
                            &nbsp;
                          </>
                        )}
                        <div className="font-bold">{event.name}</div>
                      </div>
                    );
                  }
                  // if there are more than 4 events, show a button to show the rest
                  else if (dayEvents.length > 4 && index === 4) {
                    return (
                      <div
                        className="transition hover:scale-[105%] overflow-hidden overflow-ellipsis whitespace-nowrap justify-center text-xs/3 pb-1 px-0.5 mb-0.5"
                        key={dayEvents.length}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDayClick(day);
                        }}
                      >
                        <div className="font-bold text-center">+{dayEvents.length - 3} more</div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
