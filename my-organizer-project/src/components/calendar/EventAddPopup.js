import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { db, collection, addDoc, doc } from "../../firebase/FirebaseConfig";
import Popup from "../ui/Popup";

export default function EventAddPopup({ user, eventAdd, setEventAdd, setEvents }) {
  const [show, setShow] = useState(false);

  const [eventColor, setEventColor] = useState("blue");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState("created");
  const [repeatDays, setRepeatDays] = useState([]);
  const [repeatEnd, setRepeatEnd] = useState("");
  const [repeatOption, setRepeatOption] = useState("none");

  const handleRepeatOptionChange = (e) => {
    setRepeatOption(e.target.value);
  };

  // * handle event popup close
  const handleEventAddPopupClose = () => {
    setShow(false);
  };

  // * handle edit note click
  const handleEventSaveClick = async () => {
    const event = {
      color: eventColor,
      name: eventName,
      date: eventDate,
      time: eventTime.toLocaleUpperCase(),
      description: eventDescription,
      type: eventType,
      repeatOption,
      repeatDays,
      repeatEnd,
    };

    try {
      const userRef = doc(db, "users", user.uid);
      const eventsRef = collection(userRef, "events");
      const newEventRef = await addDoc(eventsRef, event);
      setEvents((prevEvents) => [...prevEvents, { id: newEventRef.id, ...event }]);
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  // * handle event name change
  const handleEventNameChange = (e) => {
    setEventName(e.target.value);
  };

  const handleEventDateChange = (e) => {
    setEventDate(e.target.value);
  };

  const handleEventTimeChange = (e) => {
    console.log(e.target.value);
    setEventTime(e.target.value);
  };

  const handleEventDescriptionChange = (e) => {
    setEventDescription(e.target.value);
  };

  const handleRepeatDayToggle = (day) => {
    if (repeatDays.includes(day)) {
      setRepeatDays((prevDays) => prevDays.filter((d) => d !== day));
    } else {
      setRepeatDays((prevDays) => [...prevDays, day]);
    }
  };

  const handleRepeatEndChange = (e) => {
    setRepeatEnd(e.target.value);
  };

  // * when day changes, show the popup and initialize the event
  useEffect(() => {
    if (eventAdd) {
      setEventColor("blue");
      setEventName("");
      setEventDate(eventAdd ? format(eventAdd, "yyyy-MM-dd") : "");
      setEventTime(eventAdd ? eventAdd.time : "");
      setEventDescription("");
      setRepeatDays([eventAdd ? format(eventAdd, "eeee") : ""]);
      setRepeatOption("none");
      setRepeatEnd("");
      setEventType(eventAdd ? eventAdd.type : "created");
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
          <div className="bg-white px-4 pt-2 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-4 flex flex-col gap-2">
              <div className="flex flex-col">
                <label htmlFor="event" className="block text-gray-700 font-bold mb-2 text-lg">
                  Event
                </label>
                <div className="flex items-center gap-2">
                  {/* event color input */}
                  <div className={`flex transition hover:scale-110 shadow-lg justify-center items-center w-7 h-7 bg-${eventColor}-200 rounded-full`}>
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
                  {/* event name input */}
                  <input
                    type="text"
                    name="event"
                    id="event"
                    value={eventName}
                    onChange={handleEventNameChange}
                    className="border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="New Event Name"
                  />
                </div>
              </div>
            </div>
            {/* event date input */}
            <div className="mb-4 flex flex-col">
              <label htmlFor="date" className="block text-gray-700 font-bold mb-2 text-lg">
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={eventDate}
                onChange={handleEventDateChange}
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="New Event Date"
              />
            </div>
            {/* event time input */}
            <div className="mb-4 flex flex-col">
              <label htmlFor="time" className="block text-gray-700 font-bold mb-2 text-lg">
                Time
              </label>
              <input
                type="time"
                name="time"
                id="time"
                value={eventTime}
                onChange={handleEventTimeChange}
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="New Event Time"
              />
            </div>
            {/* event description input */}
            <div className="mb-4 flex flex-col">
              <label htmlFor="description" className="block text-gray-700 font-bold mb-2 text-lg">
                Description
              </label>
              <textarea
                type="text"
                name="description"
                id="description"
                value={eventDescription}
                onChange={handleEventDescriptionChange}
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="Description (optional)"
              />
            </div>

            {/* repeat event */}
            <div className="mb-4 flex flex-col">
              <label htmlFor="repeat" className="block text-gray-700 font-bold mb-2 text-lg">
                Repeat
              </label>
              <div className="flex flex-col gap-2">
                {/* repeat options */}
                <select
                  name="repeat"
                  id="repeat"
                  value={repeatOption}
                  onChange={handleRepeatOptionChange}
                  className="border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="none">Do not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>

                {repeatOption === "weekly" && (
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-lg">Repeat on:</label>
                    <div className="flex gap-2">
                      <button
                        className={`transition hover:scale-110 border border-gray-300 shadow-sm bg-gray-100 items-center justify-center rounded-full w-10 h-10 ${
                          repeatDays.includes("Sunday") && "bg-gray-800 border-none text-white font-bold"
                        }`}
                        onClick={() => handleRepeatDayToggle("Sunday")}
                      >
                        Sun
                      </button>
                      <button
                        className={`transition hover:scale-110 border border-gray-300 shadow-sm bg-gray-100 items-center justify-center rounded-full w-10 h-10 ${
                          repeatDays.includes("Monday") && "bg-gray-800 border-none text-white font-bold"
                        }`}
                        onClick={() => handleRepeatDayToggle("Monday")}
                      >
                        Mon
                      </button>
                      <button
                        className={`transition hover:scale-110 border border-gray-300 shadow-sm bg-gray-100 items-center justify-center rounded-full w-10 h-10 ${
                          repeatDays.includes("Tuesday") && "bg-gray-800 border-none text-white font-bold"
                        }`}
                        onClick={() => handleRepeatDayToggle("Tuesday")}
                      >
                        Tue
                      </button>
                      <button
                        className={`transition hover:scale-110 border border-gray-300 shadow-sm bg-gray-100 items-center justify-center rounded-full w-10 h-10 ${
                          repeatDays.includes("Wednesday") && "bg-gray-800 border-none text-white font-bold"
                        }`}
                        onClick={() => handleRepeatDayToggle("Wednesday")}
                      >
                        Wed
                      </button>
                      <button
                        className={`transition hover:scale-110 border border-gray-300 shadow-sm bg-gray-100 items-center justify-center rounded-full w-10 h-10 ${
                          repeatDays.includes("Thursday") && "bg-gray-800 border-none text-white font-bold"
                        }`}
                        onClick={() => handleRepeatDayToggle("Thursday")}
                      >
                        Thu
                      </button>
                      <button
                        className={`transition hover:scale-110 border border-gray-300 shadow-sm bg-gray-100 items-center justify-center rounded-full w-10 h-10 ${
                          repeatDays.includes("Friday") && "bg-gray-800 border-none text-white font-bold"
                        }`}
                        onClick={() => handleRepeatDayToggle("Friday")}
                      >
                        Fri
                      </button>
                      <button
                        className={`transition hover:scale-110 border border-gray-300 shadow-sm bg-gray-100 items-center justify-center rounded-full w-10 h-10 ${
                          repeatDays.includes("Saturday") && "bg-gray-800 border-none text-white font-bold"
                        }`}
                        onClick={() => handleRepeatDayToggle("Saturday")}
                      >
                        Sat
                      </button>
                    </div>
                  </div>
                )}

                {repeatOption !== "none" && (
                  <>
                    <div>
                      {/* repeat end date input */}
                      <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2 text-lg">
                        End on
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={repeatEnd}
                        onChange={handleRepeatEndChange}
                        className="border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500"
                        placeholder="Repeat end date"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
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
