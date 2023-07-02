import React, { useState, useEffect, useRef } from "react";
import { format, isToday, startOfWeek, endOfWeek, addDays, isSameWeek, isSameDay } from "date-fns";

export default function CalendarWeek({
  currentDate,
  selectedDay,
  eventAdd,
  highlightWeekends,
  getEventsForDay,
  setCurrentDate,
  handleDayClick,
  handleNewEventClick,
  handleEventClick,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      console.log("updating time:" + currentTime);
    }, 60000); // Update time every minute (60000 milliseconds)

    return () => {
      clearInterval(interval);
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
          <div /> {/* Empty column */}
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
          {/* all day indicator */}
          <div />
          {/* All day slot */}
          <div
            className={`col-span-7 grid grid-cols-7 border-gray-600
              ${isScrollAtTop ? "border-b-0" : "border-b-[0.5px] shadow-sm z-10"}
            `}
          >
            {weekDays.map((weekDay) => {
              // only get events that have a startTime and endTime of ""
              const dayEvents = getEventsForDay(weekDay).filter((event) => event.startTime === "" && event.endTime === "");
              const isWeekend = highlightWeekends && (weekDay.getDay() === 0 || weekDay.getDay() === 6);

              return (
                <div
                  key={weekDay.toString()}
                  className="text-center h-full"
                  onClick={() => {
                    handleDayClick(weekDay);
                  }}
                  style={{ backgroundColor: isWeekend ? "#E5E4E2" : "" }}
                >
                  {/* Box for all day events of the current day */}
                  <div className={`border-l-[0.5px] border-gray-400 relative p-0.5`} style={{ minHeight: "50px" }}>
                    {/* events */}
                    {dayEvents.map((event, index) => {
                      // only show 4 events max, but if more than 4, show 3 events and a button to show the rest
                      if ((index < 4 && dayEvents.length <= 4) || (index < 3 && dayEvents.length > 4)) {
                        return (
                          <div
                            className="transition hover:scale-[102%] rounded-sm overflow-hidden overflow-ellipsis whitespace-nowrap flex text-xs py-[0.9px] px-0.5 mb-0.5"
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            style={{ backgroundColor: event.color }}
                          >
                            <div className="font-bold">{event.name}</div>
                          </div>
                        );
                      }
                      // if there are more than 4 events, show a button to show the rest
                      else if (dayEvents.length > 4 && index === 4) {
                        return (
                          <div
                            className="transition hover:scale-[102%] rounded-sm overflow-hidden overflow-ellipsis whitespace-nowrap flex justify-center hover:bg-gray-200 text-xs/3 px-0.5 mb-0.5"
                            key={dayEvents.length}
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
                  <div className={`${isScrollAtTop && i === 0 ? "absolute mr-9 z-10" : ""}`}> {`${(i % 12 === 0 ? 12 : i % 12).toString()} ${i < 12 ? "AM" : "PM"}`}</div>
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
                const isWeekend = highlightWeekends && (weekDay.getDay() === 0 || weekDay.getDay() === 6);

                return (
                  <div
                    key={weekDay.toString()}
                    className="text-center h-full"
                    onClick={() => {
                      handleDayClick(weekDay);
                    }}
                  >
                    {/* Box timeslot for each hour of the day */}
                    {Array.from({ length: 24 }, (_, i) => {
                      const isCurrentHour = isSameDay(weekDay, currentTime) && i === currentTime.getHours();
                      return (
                        <div
                          key={i}
                          className={`border-l-[0.5px] border-gray-400 relative
                            ${i === 0 && "border-t-[0.5px]"} 
                            ${i === 23 ? "border-b-0" : "border-b-[0.5px]"}
                          `}
                          style={{ height: "50px", backgroundColor: isWeekend ? "#E5E4E2" : "" }}
                        >
                          {/* if timeslot is current hour, calc where to put the line time indicator in the box */}
                          {isCurrentHour && (
                            <div className="absolute bg-blue-500" style={{ top: `${(currentTime.getMinutes() / 60) * 100}%`, left: 0, right: 0, height: "2px" }}>
                              <div className="absolute bg-blue-500" style={{ top: "-1px", left: 0, right: 0, height: "2px" }}></div>
                            </div>
                          )}

                          {/* if an event is in the current timeslot, show it */}
                          {dayEvents.map((event) => {
                            const eventStart = new Date(event.startTime);
                            const eventEnd = new Date(event.endTime);
                            const eventStartHour = eventStart.getHours();
                            const eventStartMinute = eventStart.getMinutes();
                            const eventEndHour = eventEnd.getHours();
                            const eventEndMinute = eventEnd.getMinutes();

                            // show the event with the proper height and position based on the start and end times
                            if (i >= eventStartHour && i <= eventEndHour) {
                              return (
                                <div
                                  key={event.id}
                                  className="transition hover:scale-[102%] rounded-sm overflow-hidden overflow-ellipsis whitespace-nowrap flex text-xs py-[0.9px] px-0.5 mb-0.5"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventClick(event);
                                  }}
                                  style={{
                                    backgroundColor: event.color,
                                    top: `${(eventStartMinute / 60) * 100}%`,
                                    height: `${(eventEndHour - eventStartHour) * 50 + ((eventEndMinute - eventStartMinute) / 60) * 100}%`,
                                  }}
                                >
                                  <div className="font-bold">{event.name}</div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      );
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
