import React, { useState, useEffect } from "react";
import { format, parseISO, getDate, addMonths, setDate, addDays } from "date-fns";
import { db, collection, addDoc, doc } from "../../firebase/FirebaseConfig";
import Popup from "../ui/Popup";

export default function EventAddPopup({ user, eventAdd, setEventAdd, setEvents }) {
  const [show, setShow] = useState(false);

  // * event data that will be saved to Firestore
  const [eventColor, setEventColor] = useState("blue");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState("created");

  // * validation variables
  const [validEventName, setValidEventName] = useState(true);
  const [validEventDate, setValidEventDate] = useState(true);
  const [validEventEndDate, setValidEventEndDate] = useState(true);
  const [validEventStartTime, setValidEventStartTime] = useState(true);
  const [validEventEndTime, setValidEventEndTime] = useState(true);

  // * repeat event data
  const [repeatDays, setRepeatDays] = useState([]);
  const [repeatEnd, setRepeatEnd] = useState("");
  const [repeatOption, setRepeatOption] = useState("none");

  // * functions to handle state changes
  const handleEventNameChange = (e) => {
    setEventName(e.target.value);
    setValidEventName(validateEventName(e));
  };
  const handleEventDateChange = (e) => {
    setEventDate(e.target.value);
    setValidEventDate(validateEventDate(e));
  };
  const handleEventStartTimeChange = (e) => {
    setEventStartTime(e.target.value);
    setValidEventStartTime(validateEventStartTime(e));
  };
  const handleEventEndTimeChange = (e) => {
    setEventEndTime(e.target.value);
    setValidEventEndTime(validateEventEndTime(e));
  };
  const handleEventDescriptionChange = (e) => {
    setEventDescription(e.target.value);
  };
  const handleRepeatDayToggle = (day) => {
    if (repeatDays.includes(day)) setRepeatDays((prevDays) => prevDays.filter((d) => d !== day));
    else setRepeatDays((prevDays) => [...prevDays, day]);
  };
  const handleRepeatOptionChange = (e) => {
    setRepeatOption(e.target.value);
  };
  const handleRepeatEndChange = (e) => {
    setRepeatEnd(e.target.value);
    setValidEventEndDate(validateEventEndDate(e));
  };
  const handleEventAddPopupClose = () => {
    setShow(false);
  };

  // * functions to validate inputs
  const validateEventName = (e) => {
    return e.target.value.length > 0;
  };
  const validateEventDate = (e) => {
    return e.target.value.length > 0;
  };
  const validateEventEndDate = (e) => {
    return e.target.value.length > 0;
  };
  const validateEventStartTime = (e) => {
    return e.target.value.length > 0;
  };
  const validateEventEndTime = (e) => {
    return e.target.value.length > 0;
  };

  // * function to create a single event
  const createEvent = async (event, eventsRef) => {
    try {
      await addDoc(eventsRef, {
        id: `${format(event.date, "yyyy-MM-dd")}: ${event.name}`,
        ...event,
      });
      setEvents((prevEvents) => [...prevEvents, event]);
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  // * function to create repeated events, whether daily, weekly, or monthly
  const createRepeatedEvents = async (event, eventsRef, repeatEnd, repeatDays) => {
    let date = event.date;

    const endDate = parseISO(repeatEnd);
    while (date <= endDate) {
      console.log("date: ", date);
      console.log("time: ", event.startTime + " - " + event.endTime);
      if (
        repeatDays?.includes(format(date, "eeee")) || // For weekly events
        !repeatDays // For daily and monthly events
      ) {
        const repeatedEvent = {
          id: `${format(date, "yyyy-MM-dd")}: ${event.name}`,
          ...event,
          date: parseISO(date), // Use the updated date
          type: repeatDays ? `weekly event (${repeatDays.join(", ")})` : `${event.repeatOption} event`,
        };
        await createEvent(repeatedEvent, eventsRef);
      }
      // Increment the date based on the repeat option
      if (event.repeatOption === "daily") {
        date = parseISO(addDays(date, 1));
      } else if (event.repeatOption === "weekly") {
        date = parseISO(addDays(date, 7));
      } else if (event.repeatOption === "monthly") {
        date = addMonths(date, 1);
      }
    }
  };

  // * function to handle saving the event when the save button is clicked
  const handleEventSaveClick = () => {
    // check for any input errors
    if (eventName.trim() === "") {
      setValidEventName(false);
      return;
    }
    if (eventDate === "") {
      setValidEventDate(false);
      return;
    }
    if (eventStartTime === "" && eventEndTime !== "") {
      setValidEventStartTime(false);
      return;
    }
    if (eventEndTime === "" && eventStartTime !== "") {
      setValidEventEndTime(false);
      return;
    }
    if (eventStartTime !== "" && eventEndTime !== "" && eventStartTime >= eventEndTime) {
      setValidEventStartTime(false);
      setValidEventEndTime(false);
      return;
    }
    if (repeatOption !== "none" && repeatEnd === "") {
      setValidEventEndDate(false);
      return;
    }

    if (validEventName && validEventDate && validEventEndDate && validEventStartTime && validEventEndTime) {
      // create the new event if there are no errors
      const event = {
        color: eventColor,
        name: eventName.trim(),
        date: parseISO(eventDate),
        startTime: eventStartTime,
        endTime: eventEndTime,
        description: eventDescription,
        type: eventType,
        repeatOption: repeatOption,
      };
      try {
        const userRef = doc(db, "users", user.uid);
        const eventsRef = collection(userRef, "events");

        // If the event is repeating, create the repeated events
        if (repeatOption !== "none") createRepeatedEvents(event, eventsRef, repeatEnd, repeatDays);
        // Otherwise, just add the single event to Firestore
        else createEvent(event, eventsRef);
      } catch (error) {
        console.error("Error adding event: ", error);
      } finally {
        setEvents((prevEvents) => [...prevEvents, event]);
        setShow(false);
      }
    }
  };

  // * when day changes, show the popup and initialize the event
  useEffect(() => {
    if (eventAdd) {
      // reset the event data
      setEventColor("blue");
      setEventName("");
      setEventDate(eventAdd ? format(eventAdd, "yyyy-MM-dd") : "");
      setEventStartTime(eventAdd?.startTime ?? "");
      setEventEndTime(eventAdd?.endTime ?? "");
      setEventDescription("");
      setRepeatDays([]);
      setRepeatOption("none");
      setRepeatEnd("");
      setEventType(eventAdd?.type ?? "created");

      // reset all the validation variables
      setValidEventName(true);
      setValidEventDate(true);
      setValidEventEndDate(true);
      setValidEventStartTime(true);
      setValidEventEndTime(true);

      // show the popup
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
                <div className="flex items-center gap-1.5">
                  {/* event color input */}
                  <div className={`flex transition hover:scale-110 shadow-lg justify-center items-center w-8 h-8 bg-${eventColor}-200 rounded-full`}>
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
                    className={`border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 ${
                      validEventName ? "" : "ring-2 ring-red-500"
                    }`}
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
                className={`border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 ${
                  validEventDate ? "" : "ring-2 ring-red-500"
                }`}
                placeholder="New Event Date"
              />
            </div>
            <div className="flex gap-2">
              {/* event start time input */}
              <div className="mb-4 flex flex-col w-1/2">
                <label htmlFor="time" className="block text-gray-700 font-bold mb-2 text-lg">
                  Starts
                </label>
                <input
                  type="time"
                  name="start_time"
                  id="start_time"
                  value={eventStartTime}
                  onChange={handleEventStartTimeChange}
                  className={`border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500
                  ${validEventStartTime ? "" : "ring-2 ring-red-500"}`}
                  placeholder="Start Time"
                />
              </div>

              {/* event end time input */}
              <div className="mb-4 flex flex-col w-1/2">
                <label htmlFor="time" className="block text-gray-700 font-bold mb-2 text-lg">
                  Ends
                </label>
                <input
                  type="time"
                  name="end_time"
                  id="end_time"
                  value={eventEndTime}
                  onChange={handleEventEndTimeChange}
                  className={`border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500
                  ${validEventEndTime ? "" : "ring-2 ring-red-500"}`}
                  placeholder="End Time"
                />
              </div>
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
                {/* show the weekly repeat days if the repeat option is weekly */}
                {repeatOption === "weekly" && (
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-lg">Repeat on:</label>
                    <div className="flex gap-2">
                      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                        <button
                          key={day}
                          className={`transition hover:scale-110 border border-gray-300 shadow-sm bg-gray-100 items-center justify-center rounded-full w-10 h-10 ${
                            repeatDays.includes(day) && "bg-gray-800 border-none text-white font-bold"
                          }`}
                          onClick={() => handleRepeatDayToggle(day)}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* show the end date input if the event is repeating */}
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
                        className={`border border-gray-300 rounded-md w-full px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 ${
                          validateEventEndDate ? "" : "ring-2 ring-red-500"
                        }`}
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
