import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, isToday, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";

export default function CalendarMonth({
  currentDate,
  setCurrentDate,
  selectedDay,
  handleDayClick,
  handleNewEventClick,
  handleEventClick,
  getEventsForDay,
  renderEventButton,
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

  const days = [];
  let day = monthStartDate;

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

            return (
              <div
                key={day.toString()}
                className={`p-0.5 cursor-pointer text-center border-[0.5px] border-gray-300 ${isCurrentMonth ? "text-gray-800" : "text-gray-400"} ${
                  isSelectedDay ? "bg-blue-200" : ""
                }`}
                style={{
                  height: "92px",
                }}
                onClick={() => {
                  handleNewEventClick(day);
                }}
              >
                <div className="w-full cursor-pointer flex items-center justify-center">
                  <div
                    className={`font-bold w-6 text-sm p-0.5 mb-0.5 rounded-full transition hover:scale-110 ${
                      isToday(day) ? "text-white bg-blue-500 hover:bg-blue-700" : "hover:bg-gray-300"
                    } ${isSelectedDay ? "text-blue-500" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDayClick(day);
                    }}
                  >
                    {format(day, "d")}
                  </div>
                </div>

                {dayEvents.map((event, index) => {
                  // only show 4 events max, but if more than 4, show 3 events and a button to show the rest
                  if ((index < 4 && dayEvents.length <= 4) || (index < 3 && dayEvents.length > 4)) {
                    return (
                      <div
                        className={`transition hover:scale-[102%] rounded-sm overflow-hidden overflow-ellipsis whitespace-nowrap flex text-xs/3 py-[0.9px] px-0.5 mb-0.5 bg-${event.color}-200`}
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        {event.time !== "" && event.time !== "all-day" && (
                          <div>
                            {event.time.replace(/^0/, "").toLowerCase()}
                            {event.time.slice(-2) === ":00" ? "" : ` |`}&nbsp;
                          </div>
                        )}

                        <div className="font-bold">{event.name}</div>
                      </div>
                    );
                  }
                  // if there are more than 4 events, show a button to show the rest
                  else if (dayEvents.length > 4 && index === 4) {
                    return (
                      <div
                        className="transition hover:scale-[102%] rounded-sm overflow-hidden overflow-ellipsis whitespace-nowrap flex justify-center hover:bg-gray-200 text-xs/3 px-0.5 mb-0.5"
                        key={day.toString()}
                        onClick={(e) => {
                          e.stopPropagation();
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
