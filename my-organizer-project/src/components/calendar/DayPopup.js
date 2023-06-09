import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Popup from "../ui/Popup";
import { shortenTime, convertToRegularTime } from "./CalendarUtils";
import { is } from "date-fns/locale";

export default function DayPopup({ selectedDay, getEventsForDay, setSelectedDay, handleEventClick, handleEventEditClick }) {
  const [show, setShow] = useState(false);

  // * handle event popup close
  const handleDayPopupClose = () => {
    setShow(false);
  };

  // * when event changes in parent component, show the popup
  useEffect(() => {
    if (selectedDay) {
      setShow(true);
    }
  }, [selectedDay]);

  // * when popup closes, set the event to null
  useEffect(() => {
    if (!show) {
      setSelectedDay(null);
    }
  }, [show, setSelectedDay]);

  // * the popup ui
  return (
    <>
      {selectedDay && (
        <Popup open={show} setOpen={setShow} onClose={handleDayPopupClose}>
          {/* popup header */}
          <div className="bg-blue-200 h-12 flex items-center justify-center gap-1 rounded-t-lg w-full text-center font-bold p-3">
            <div>Calendar Day</div>
            <svg className="h-6 w-6" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M12,14a1,1,0,1,0-1-1A1,1,0,0,0,12,14Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,14Zm-5,4a1,1,0,1,0-1-1A1,1,0,0,0,12,18Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,18ZM7,14a1,1,0,1,0-1-1A1,1,0,0,0,7,14ZM19,4H18V3a1,1,0,0,0-2,0V4H8V3A1,1,0,0,0,6,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H19a1,1,0,0,1,1,1ZM7,18a1,1,0,1,0-1-1A1,1,0,0,0,7,18Z"></path>
              </g>
            </svg>
          </div>
          {/* popup body */}
          <div className="p-4">
            <div className="text-2xl text-center font-bold mb-2">
              {format(selectedDay, "eeee")}, {format(selectedDay, "MMMM d, yyyy")}
            </div>
            {getEventsForDay(selectedDay).length > 0 ? (
              <div className="justify-start">
                {/* put untimed events at top and sort rest by start time */}
                {getEventsForDay(selectedDay)
                  .sort((a, b) => {
                    if (!a.startTime && !b.startTime) {
                      return 0;
                    }
                    if (!a.startTime) {
                      return -1;
                    }
                    if (!b.startTime) {
                      return 1;
                    }
                    return a.startTime.localeCompare(b.startTime);
                  })
                  .map((event) => {
                    const isTimed = event.startTime && event.endTime;

                    return (
                      <div
                        key={event.name}
                        className="flex items-center justify-between rounded-lg p-2 mb-2 cursor-pointer transition hover:scale-[101%]"
                        style={{ backgroundColor: event.color }}
                        onClick={() => {
                          handleDayPopupClose();
                          handleEventClick(event);
                        }}
                      >
                        <div className="flex items-center">
                          {isTimed ? (
                            <div className="text-lg">
                              {shortenTime(convertToRegularTime(event.startTime))}-{shortenTime(convertToRegularTime(event.endTime))}
                            </div>
                          ) : (
                            <div className="text-lg">all-day</div>
                          )}
                          &nbsp;
                          <div className="text-lg font-bold">{event.name}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className="transition hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDayPopupClose();
                              handleEventEditClick(event);
                            }}
                          >
                            <svg className="w-4 h-4" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#000000">
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                              <g id="SVGRepo_iconCarrier">
                                <style type="text/css"> </style>
                                <g>
                                  <path
                                    className="st0"
                                    d="M494.56,55.774l-38.344-38.328c-23.253-23.262-60.965-23.253-84.226,0l-35.878,35.878l122.563,122.563 l35.886-35.878C517.814,116.747,517.814,79.044,494.56,55.774z"
                                  ></path>
                                  <polygon className="st0" points="0,389.435 0,511.998 122.571,511.998 425.246,209.314 302.691,86.751 "></polygon>
                                </g>
                              </g>
                            </svg>
                          </div>
                          <div
                            className="transition hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDayPopupClose();
                            }}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                              <g id="SVGRepo_iconCarrier">
                                <path
                                  d="M8 1.5V2.5H3C2.44772 2.5 2 2.94772 2 3.5V4.5C2 5.05228 2.44772 5.5 3 5.5H21C21.5523 5.5 22 5.05228 22 4.5V3.5C22 2.94772 21.5523 2.5 21 2.5H16V1.5C16 0.947715 15.5523 0.5 15 0.5H9C8.44772 0.5 8 0.947715 8 1.5Z"
                                  fill="#000000"
                                ></path>
                                <path
                                  d="M3.9231 7.5H20.0767L19.1344 20.2216C19.0183 21.7882 17.7135 23 16.1426 23H7.85724C6.28636 23 4.98148 21.7882 4.86544 20.2216L3.9231 7.5Z"
                                  fill="#000000"
                                ></path>
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center">No events for this day</div>
            )}
          </div>
          {/* popup footer */}
          <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleDayPopupClose}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </Popup>
      )}
    </>
  );
}
