import React, { useState, useEffect, useRef } from "react";
import { format, isToday, startOfWeek, endOfWeek, addDays, isSameWeek, isSameDay } from "date-fns";

export default function CalendarWeek({ currentDate, setCurrentDate, selectedDay, handleDayClick, getEventsForDay, renderEventButton }) {
  // * week calendar date management
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(weekStart);
  const weekStartDate = startOfWeek(weekStart);
  const weekEndDate = endOfWeek(weekEnd);

  const scrollContainerRef = useRef(null);
  const [isScrollAtTop, setIsScrollAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current.scrollTop === 0) setIsScrollAtTop(true);
      else setIsScrollAtTop(false);
    };
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <div className="w-full p-2 text-center">
      <div className="flex flex-col pr-3">
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
            const isSelectedDay = isSameDay(weekDay, selectedDay);
            return (
              <div className="flex items-center justify-center w-full" key={weekDay.toString()}>
                <div className={`font-bold w-8 ${isToday(weekDay) ? "text-white bg-blue-500 rounded-full p-1" : ""} ${isSelectedDay ? "text-blue-500" : ""}`}>
                  {format(weekDay, "d")}
                </div>
              </div>
            );
          })}
        </div>

        {/* All day slot at the top */}
        <div className="grid grid-cols-8 grid-auto-rows">
          <div className={`-mt-3 ${isScrollAtTop && "bg-transparent"}`}></div>
          {/* All day slot */}
          <div
            className={`col-span-7 grid grid-cols-7 border-gray-400
          ${isScrollAtTop ? "border-b-0" : "border-b-[0.5px] drop-shadow-md"}
          `}
          >
            {weekDays.map((weekDay) => {
              // only get events that have a startTime and endTime of ""
              const dayEvents = getEventsForDay(weekDay).filter((event) => event.startTime === "" && event.endTime === "");

              return (
                <div
                  key={weekDay.toString()}
                  className="text-center h-full"
                  onClick={() => {
                    handleDayClick(weekDay);
                  }}
                >
                  {/* Box for all day events of the current day */}
                  <div className="border-l-[0.5px] border-gray-400 relative" style={{ minHeight: "50px" }}>
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Time slots container */}
        <div className="time-slots-container" style={{ maxHeight: "calc(50vh - 200px)", overflowY: "auto", width: "calc(100% + 15px)" }} ref={scrollContainerRef}>
          <div className="grid grid-cols-8 grid-auto-rows">
            {/* Left side timeline */}
            <div className="border-gray-300 -mt-3">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex gap-3 justify-end font-bold" style={{ height: "50px" }}>
                  {`${(i % 12 === 0 ? 12 : i % 12).toString()} ${i < 12 ? "AM" : "PM"}`}
                  <div
                    className={`mt-3 h-full border-gray-400 w-6
                    ${i === 0 && "border-t-[0.5px]"}
                    ${i === 23 ? "border-b-0" : "border-b-[0.5px]"}
                  `}
                  />
                </div>
              ))}
            </div>

            {/* Time slots for each day */}
            <div className="col-span-7 grid grid-cols-7">
              {weekDays.map((weekDay) => {
                const dayEvents = getEventsForDay(weekDay);

                return (
                  <div
                    key={weekDay.toString()}
                    className="text-center h-full"
                    onClick={() => {
                      handleDayClick(weekDay);
                    }}
                  >
                    {/* Box timeslot for each hour of the day */}
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className={`border-l-[0.5px] border-gray-400 relative
                        ${i === 0 && "border-t-[0.5px]"} 
                        ${i === 23 ? "border-b-0" : "border-b-[0.5px]"}
                      `}
                        style={{ height: "50px" }}
                      >
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
      </div>
    </div>
  );
}
