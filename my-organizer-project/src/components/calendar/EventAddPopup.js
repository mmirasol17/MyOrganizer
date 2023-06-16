import React, { useState, useEffect } from "react";
import { format, set } from "date-fns";
import { db, collection, doc, updateDoc, deleteDoc } from "../../firebase/FirebaseConfig";
import Popup from "../ui/Popup";

export default function EventAddPopup({ eventAdd, setEventAdd, setEvents }) {
  const [show, setShow] = useState(false);

  const [eventColor, setEventColor] = useState("blue");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(eventAdd ? eventAdd.date : "");
  const [eventTime, setEventTime] = useState(eventAdd ? eventAdd.time : "");
  const [eventType, setEventType] = useState(eventAdd ? eventAdd.type : "");

  // * handle event popup close
  const handleEventAddPopupClose = () => {
    setShow(false);
  };

  // * handle edit note click
  const handleEventSaveClick = (e) => {
    setEvents((prevEvents) => [...prevEvents, eventAdd]);
    setShow(false);
  };

  // * when event changes in parent component, show the popup
  useEffect(() => {
    if (eventAdd) {
      setShow(true);
    }
  }, [eventAdd]);

  // * when popup closes, set the event to null
  useEffect(() => {
    if (!show) {
      setEventAdd(null);
    }
  }, [show, setEventAdd]);

  // * the popup ui
  return (
    <>
      {eventAdd && (
        <Popup open={show} setOpen={setShow} onClose={handleEventAddPopupClose}>
          {/* popup header */}
          <div className="bg-blue-200 h-12 flex items-center justify-center gap-1 rounded-t-lg w-full text-center font-bold p-3">
            <div>Add an Event</div>
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
            <div className="mb-4 flex flex-col gap-2"></div>
          </div>
          {/* popup footer */}
          <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleEventSaveClick}
              type="button"
              className="w-full inline-flex items-center gap-2 justify-center rounded-md border border-transparent shadow-sm pl-4 pr-3 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
              <svg className="w-4 h-4" viewBox="4 4 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="Interface / Check">
                    <path id="Vector" d="M6 12L10.2426 16.2426L18.727 7.75732" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </g>
                </g>
              </svg>
            </button>
            <button
              onClick={handleEventAddPopupClose}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </Popup>
      )}
    </>
  );
}
