import React from "react";
import { format, startOfWeek, endOfWeek, addDays, isSameWeek, isSameDay } from "date-fns";

export default function CalendarWeek({ currentDate, setCurrentDate, selectedDay, handleDayClick, getEventsForDay, renderEventButton }) {
  // * week calendar date management
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(weekStart);
  const weekStartDate = startOfWeek(weekStart);
  const weekEndDate = endOfWeek(weekEnd);

  // * For changing weeks on the week calendar
  const handlePrevWeek = () => {
    setCurrentDate(addDays(weekStart, -7));
  };
  const handleNextWeek = () => {
    setCurrentDate(addDays(weekEnd, 7));
  };

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
          <h2 className="text-2xl font-bold mx-4">{`${format(weekStartDate, "MMMM d")} - ${format(weekEndDate, "MMMM d, yyyy")}`}</h2>
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

          {weekDays.map((weekDay) => {
            const dayEvents = getEventsForDay(weekDay);

            return (
              <div
                key={weekDay.toString()}
                className="text-center border h-full border-gray-300"
                onClick={() => {
                  handleDayClick(weekDay);
                }}
              >
                {/* Box timeslot for each hour of the day */}
                {Array.from({ length: 23 }, (_, i) => (
                  <div key={i} className="border-b border-gray-300 relative" style={{ height: "33px" }}>
                    {i !== 0 && <div className="h-full absolute bg-gray-300" style={{ top: 0, left: 0, right: 0, zIndex: -1 }}></div>}
                  </div>
                ))}
                {/* Show each event in its corresponding timeslot */}
                {dayEvents.map((event, index) => {
                  if (index < 2) {
                    return <div key={event.id}>{event.name}</div>;
                  } else if (index === 2) {
                    return renderEventButton(dayEvents.length - 2);
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
