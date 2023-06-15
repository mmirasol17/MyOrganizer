import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Popup from "../ui/Popup";

export default function EventPopup({ selectedEvent, setSelectedEvent, setEventEdit }) {
  const [show, setShow] = useState(false);

  // * handle event popup close
  const handleEventPopupClose = () => {
    setShow(false);
  };

  // * handle edit note click
  const handleEventEditClick = (e) => {
    setEventEdit(selectedEvent);
    setShow(false);
  };

  // * when event changes in parent component, show the popup
  useEffect(() => {
    if (selectedEvent) {
      setShow(true);
    }
  }, [selectedEvent]);

  // * when popup closes, set the event to null
  useEffect(() => {
    if (!show) {
      setSelectedEvent(null);
    }
  }, [show, setSelectedEvent]);

  // * the popup ui
  return (
    <>
      {selectedEvent && (
        <Popup open={show} setOpen={setShow} onClose={handleEventPopupClose}>
          {/* popup header */}
          <div className="bg-blue-200 h-12 flex items-center justify-center gap-1 rounded-t-lg w-full text-center font-bold p-3">
            <div>Calendar Event</div>
            <svg className="h-6 w-6" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M12,14a1,1,0,1,0-1-1A1,1,0,0,0,12,14Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,14Zm-5,4a1,1,0,1,0-1-1A1,1,0,0,0,12,18Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,18ZM7,14a1,1,0,1,0-1-1A1,1,0,0,0,7,14ZM19,4H18V3a1,1,0,0,0-2,0V4H8V3A1,1,0,0,0,6,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H19a1,1,0,0,1,1,1ZM7,18a1,1,0,1,0-1-1A1,1,0,0,0,7,18Z"></path>
              </g>
            </svg>
          </div>
          {/* popup body */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-4 flex flex-col gap-2">
              {/* the event with its representational color and its date */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 mt-1 rounded-full bg-${selectedEvent.color}-200`} />
                  <p className="font-bold text-2xl">{selectedEvent.name}</p>
                </div>
                <p className="text-gray-700 text-md ml-8">{format(selectedEvent.date, "eeee, MMMM d, yyyy")}</p>
              </div>
              {/* the time of the event */}
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <title>time</title>{" "}
                    <path d="M0 16q0-3.232 1.28-6.208t3.392-5.12 5.12-3.392 6.208-1.28q3.264 0 6.24 1.28t5.088 3.392 3.392 5.12 1.28 6.208q0 3.264-1.28 6.208t-3.392 5.12-5.12 3.424-6.208 1.248-6.208-1.248-5.12-3.424-3.392-5.12-1.28-6.208zM4 16q0 3.264 1.6 6.048t4.384 4.352 6.016 1.6 6.016-1.6 4.384-4.352 1.6-6.048-1.6-6.016-4.384-4.352-6.016-1.632-6.016 1.632-4.384 4.352-1.6 6.016zM14.016 16v-5.984q0-0.832 0.576-1.408t1.408-0.608 1.408 0.608 0.608 1.408v4h4q0.8 0 1.408 0.576t0.576 1.408-0.576 1.44-1.408 0.576h-6.016q-0.832 0-1.408-0.576t-0.576-1.44z"></path>{" "}
                  </g>
                </svg>
                <p className="text-gray-700 text-md">{selectedEvent.time}</p>
              </div>
              {/* the event type */}
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 bi bi-calendar-event-fill" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"></path>{" "}
                  </g>
                </svg>
                <p className="text-gray-700 text-md">{selectedEvent.type}</p>
              </div>
            </div>
          </div>
          {/* popup footer */}
          <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {selectedEvent.type !== "holiday" && (
              <button
                onClick={handleEventEditClick}
                type="button"
                className="w-full inline-flex items-center gap-2 justify-center rounded-md border border-transparent shadow-sm pl-4 pr-3 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Edit
                <svg className="w-3 h-3 fill-white" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#000000">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path
                        class="st0"
                        d="M494.56,55.774l-38.344-38.328c-23.253-23.262-60.965-23.253-84.226,0l-35.878,35.878l122.563,122.563 l35.886-35.878C517.814,116.747,517.814,79.044,494.56,55.774z"
                      ></path>
                      <polygon class="st0" points="0,389.435 0,511.998 122.571,511.998 425.246,209.314 302.691,86.751 "></polygon>{" "}
                    </g>
                  </g>
                </svg>
              </button>
            )}
            <button
              onClick={handleEventPopupClose}
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
