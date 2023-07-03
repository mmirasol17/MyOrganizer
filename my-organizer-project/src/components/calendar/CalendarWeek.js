import React, { useState, useEffect, useRef } from "react";
import { format, startOfWeek, endOfWeek, addDays, isSameWeek, isSameDay, toLocaleTimeString } from "date-fns";

export default function CalendarWeek({
  todaysDate,
  currentDate,
  selectedDay,
  selectedEvent,
  eventAdd,
  highlightWeekends,
  getEventsForDay,
  setCurrentDate,
  handleDayClick,
  handleNewEventClick,
  handleEventClick,
}) {
  // * for keeping track of current time for current time indicator
  const [currentTime, setCurrentTime] = useState(new Date());

  // * week calendar date management
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(weekStart);
  const weekStartDate = startOfWeek(weekStart);
  const weekEndDate = endOfWeek(weekEnd);

  // * for keeping track of the scroll position
  const scrollContainerRef = useRef(null);
  const [isScrollAtTop, setIsScrollAtTop] = useState(true);

  // * check if the scroll container is at the top
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

  // * scroll to the current time
  const scrollToCurrentTime = () => {
    const scrollContainer = scrollContainerRef.current;
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentHourElement = scrollContainer.querySelector(`div:nth-child(${currentHour + 2})`);
    if (currentHourElement) {
      const containerHeight = scrollContainer.offsetHeight;
      const currentHourElementTop = currentHourElement.offsetTop + (currentMinute / 60) * 50;
      const currentHourElementBottom = currentHourElementTop + 50;

      // Calculate the scroll position based on the current hour's position
      let scrollPosition;
      if (currentHourElementTop < scrollContainer.scrollTop) {
        // Scroll up if the current hour is above the visible area
        scrollPosition = currentHourElementTop;
      } else if (currentHourElementBottom > scrollContainer.scrollTop + containerHeight) {
        // Scroll down if the current hour is below the visible area
        scrollPosition = currentHourElementBottom - containerHeight;
      } else {
        // No need to scroll if the current hour is already visible
        return;
      }

      // Scroll to the calculated position
      scrollContainer.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  // * scroll to the current time every time the week calendar is loaded
  useEffect(() => {
    if (isSameDay(currentTime, currentDate)) {
      scrollToCurrentTime();
    }
  }, []);

  // * update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // * scroll to the current time if the current week is the current week
  useEffect(() => {
    if (isSameWeek(currentTime, currentDate)) {
      scrollToCurrentTime();
    }
  }, [currentDate]);

  // * For changing weeks on the week calendar
  const handlePrevWeek = () => {
    setCurrentDate(addDays(weekStart, -7));
  };
  const handleNextWeek = () => {
    setCurrentDate(addDays(weekEnd, 7));
  };

  // * get all days in the week
  const weekDays = [];
  let day = weekStartDate;
  while (day <= weekEndDate) {
    weekDays.push(day);
    day = addDays(day, 1);
  }

  // * week calendar UI
  return (
    <div className="w-full p-2 text-center">
      <div className="flex flex-col pr-3">
        <div className="flex items-center justify-center">
          {/* calendar week header with nav buttons */}
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

        <div className="flex pb-1.5">
          {/* button to scroll to current time */}
          <div className="w-[95px] items-end justify-center flex">
            <svg
              className="w-[25px] h-[25px] transition hover:scale-110 cursor-pointer"
              onClick={scrollToCurrentTime}
              fill="#000000"
              viewBox="0 0 24 24"
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M23,11a1,1,0,0,0-1,1,10.034,10.034,0,1,1-2.9-7.021A.862.862,0,0,1,19,5H16a1,1,0,0,0,0,2h3a3,3,0,0,0,3-3V1a1,1,0,0,0-2,0V3.065A11.994,11.994,0,1,0,24,12,1,1,0,0,0,23,11Z M12,6a1,1,0,0,0-1,1v5a1,1,0,0,0,.293.707l3,3a1,1,0,0,0,1.414-1.414L13,11.586V7A1,1,0,0,0,12,6Z"></path>
              </g>
            </svg>
          </div>
          <div className="flex-grow">
            {/* day name labels */}
            <div className="grid grid-cols-7">
              {weekDays.map((weekDay) => {
                const dayOfWeek = format(weekDay, "EEE");
                const isToday = dayOfWeek === format(todaysDate, "EEE");
                const isCurrentWeek = isSameWeek(currentDate, todaysDate);
                const isSelectedDay = isSameDay(weekDay, selectedDay);
                const isEventAdd = isSameDay(weekDay, eventAdd);
                return (
                  <div key={dayOfWeek} className="p-2 pb-0 text-center">
                    <div
                      className={`font-bold transition hover:scale-110 cursor-pointer
                        ${isSelectedDay || isEventAdd || (isToday && isCurrentWeek) ? "text-blue-500 hover:text-blue-700" : "text-black"}
                      `}
                      onClick={() => {
                        handleNewEventClick(weekDay);
                      }}
                    >
                      {dayOfWeek}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* date number labels */}
            <div className="grid grid-cols-7">
              {weekDays.map((weekDay) => {
                const isSelectedDay = isSameDay(weekDay, selectedDay);
                const isToday = isSameDay(weekDay, todaysDate);
                const isEventAdd = isSameDay(weekDay, eventAdd);
                return (
                  <div className="flex items-center justify-center w-full cursor-pointer" key={weekDay.toString()} onClick={() => handleNewEventClick(weekDay)}>
                    <div
                      className={`font-bold w-8 transition hover:scale-110 p-1 rounded-full
                        ${isToday ? "text-white bg-blue-500 hover:bg-blue-700" : "hover:bg-gray-300"} 
                        ${isSelectedDay || isEventAdd ? "text-blue-500" : ""}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDayClick(weekDay);
                      }}
                    >
                      {format(weekDay, "d")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* all day slots for untimed events */}
        <div
          className={`col-span-7 grid grid-cols-7 border-gray-600 ml-[95px]
            ${isScrollAtTop ? "border-b-0" : "border-b-[0.5px] shadow-sm z-10"}
          `}
        >
          {weekDays.map((weekDay) => {
            const allDayEvents = getEventsForDay(weekDay).filter((event) => event.startTime === "" && event.endTime === "");
            const isWeekend = highlightWeekends && (weekDay.getDay() === 0 || weekDay.getDay() === 6);
            const isEventAddUntimed = isSameDay(weekDay, eventAdd) && !eventAdd.startTime && !eventAdd.endTime;
            return (
              <div
                key={weekDay.toString()}
                className={`text-center h-full hover:bg-gray-200 cursor-pointer border-l-[0.5px] border-gray-400 relative p-0.5 min-h-[50px]
                  ${isEventAddUntimed ? "bg-blue-200" : ""}
                `}
                onClick={() => {
                  handleNewEventClick(weekDay);
                }}
                style={{ backgroundColor: isWeekend && !isEventAddUntimed ? "#E5E4E2" : "" }}
              >
                {allDayEvents.map((event, index) => {
                  const isEventSelected = selectedEvent && selectedEvent.id === event.id;
                  // only show 4 events max, but if more than 4, show 3 events and a button to show the rest
                  if ((index < 4 && allDayEvents.length <= 4) || (index < 3 && allDayEvents.length > 4)) {
                    return (
                      <div
                        className={`transition hover:scale-[102%] rounded-sm overflow-hidden overflow-ellipsis whitespace-nowrap flex text-xs py-[0.9px] px-0.5 mb-0.5
                          ${isEventSelected ? "scale-[102%]" : ""}
                        `}
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
                  else if (allDayEvents.length > 4 && index === 4) {
                    return (
                      <div
                        className="transition hover:scale-[105%] rounded-sm overflow-hidden overflow-ellipsis whitespace-nowrap flex justify-center text-xs/3 px-0.5 mb-0.5"
                        key={allDayEvents.length}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDayClick(weekDay);
                        }}
                      >
                        <div className="font-bold text-center">+{allDayEvents.length - 3} more</div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            );
          })}
        </div>

        <div style={{ maxHeight: "calc(50vh - 200px)", overflowY: "auto", width: "calc(100% + 15px)", display: "flex" }} ref={scrollContainerRef}>
          {/* left side timeline to show time labels of each grid box */}
          <div className="-mt-3 w-[95px]">
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

          {/* grid of all 24 hours of time boxes for each day */}
          <div className="grid grid-cols-7 grid-auto-rows flex-grow">
            <>
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
                    {/* grid box for each hour of the current day */}
                    {Array.from({ length: 24 }, (_, hr) => {
                      const isCurrentHour = isSameDay(weekDay, currentTime) && hr === currentTime.getHours();
                      const isEventAddTimed = isSameDay(weekDay, eventAdd) && eventAdd?.startTime && eventAdd?.endTime;
                      return (
                        <div
                          key={hr}
                          className={`border-l-[0.5px] border-gray-400 relative
                            ${hr === 0 && "border-t-[0.5px]"} 
                            ${hr === 23 ? "border-b-0" : "border-b-[0.5px]"}
                            ${isEventAddTimed ? "bg-blue-200" : ""}
                          `}
                          style={{ height: "50px", backgroundColor: isWeekend && !isEventAddTimed ? "#E5E4E2" : "" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNewEventClick({
                              ...weekDay,
                              startTime: `${hr}:00`,
                              endTime: `${hr + 1}:00`,
                            });
                          }}
                        >
                          {/* if timeslot is current hour, calc where to put current time line */}
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
                            if (hr >= eventStartHour && hr <= eventEndHour) {
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
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
