import React, { useState, useEffect, useRef } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";

function Calendar({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const selectedDayPopupRef = useRef(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handlePrevMonth = () => {
    setCurrentDate(addDays(monthStart, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addDays(monthEnd, 1));
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

  return (
    <>
      <div className="bg-blue-200 rounded-t-lg w-full text-center p-3 font-bold">My Calendar</div>
      <div className="w-full p-2 text-center overflow-y-auto no-scrollbar">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <button className="text-blue-500 font-bold" onClick={handlePrevMonth}>
              Prev
            </button>
            <h2 className="text-xl font-bold">{format(monthStart, "MMMM yyyy")}</h2>
            <button className="text-blue-500 font-bold" onClick={handleNextMonth}>
              Next
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
              const isCurrentDay = isSameDay(day, currentDate);
              const isSelectedDay = isSameDay(day, selectedDay);
              const isToday = isSameDay(day, new Date());

              console.log("day is " + day + "today is " + new Date() + "isToday is " + isToday);

              return (
                <div
                  key={day.toString()}
                  className={`p-1 text-center border border-gray-300 ${isCurrentMonth ? "text-gray-800" : "text-gray-400"} ${isSelectedDay ? "bg-blue-200" : ""}`}
                  style={{
                    height: "80px",
                  }}
                  onClick={() => {
                    handleDayClick(day);
                    console.log(day + " was clicked" + " selectedDay is " + selectedDay);
                  }}
                >
                  <div className={`font-bold w-8 ${isToday ? "text-white bg-blue-500 rounded-full p-1" : ""} ${isSelectedDay ? "text-blue-500" : ""}`}>
                    {format(day, "d")}
                  </div>

                  {dayEvents.map((event, index) => (index < 2 ? <div key={event.name}>{event.name}</div> : index === 2 ? renderEventButton(dayEvents.length - 2) : null))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

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

export default Calendar;
