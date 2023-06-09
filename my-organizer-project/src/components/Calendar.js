import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-4">
        <button className="text-blue-500 font-bold" onClick={handlePrevMonth}>
          Prev
        </button>
        <h2 className="text-xl font-bold">{format(monthStart, "MMMM yyyy")}</h2>
        <button className="text-blue-500 font-bold" onClick={handleNextMonth}>
          Next
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`p-2 text-center ${isSameMonth(day, monthStart) ? "text-gray-800" : "text-gray-400"} ${isSameDay(day, currentDate) ? "bg-blue-200" : ""}`}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
