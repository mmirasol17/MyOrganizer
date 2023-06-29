import React from "react";
import { db, doc, updateDoc, getDoc, setDoc, collection, getDocs, deleteDoc } from "../../firebase/FirebaseConfig";

import Dropdown from "../ui/Dropdown";
import Menu from "../ui/Menu";

// * view mode options for the calendar
const viewModeOptions = [
  {
    label: "Month",
    value: "month",
  },
  {
    label: "Week",
    value: "week",
  },
];

// * calendar options
const calendarOptions = [
  {
    label: "Clear all events",
    value: "clear",
  },
  {
    label: "Highlight weekends",
    value: "highlight",
  },
];

export default function CalendarHeader({ user, setEvents, setCurrentDate, viewMode, setViewMode }) {
  // * handle when user events happen
  const handleViewModeChange = (modeOption) => {
    setViewMode(modeOption.value);
  };
  const handleCalendarOptionClick = (option) => {
    if (option.value === "clear") {
      clearCalendarEvents();
    } else if (option.value === "highlight") {
      highlightWeekends();
    }
  };

  // * clear all events from the calendar
  const clearCalendarEvents = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const eventsRef = collection(userRef, "calendar_events");
      const querySnapshot = await getDocs(eventsRef);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      // get rid of the deleted events from the state but keep the holidays
      setEvents((prevEvents) => prevEvents.filter((event) => event.type === "holiday"));
    } catch (error) {
      console.error("Error clearing events: ", error);
    }
  };

  // * set the highlight weekends setting to true in Firestore
  const highlightWeekends = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const settingsRef = collection(userRef, "calendar_settings");
      const querySnapshot = await getDocs(settingsRef);
      if (querySnapshot.empty) {
        // if there are no settings, create a new one
        const newSettings = {
          highlightWeekends: true,
        };
        await setDoc(doc(settingsRef), newSettings);
      } else {
        // if there are settings, update the existing one
        const settingsDoc = querySnapshot.docs[0];
        const settings = settingsDoc.data();
        const updatedSettings = {
          ...settings,
          highlightWeekends: true,
        };
        await updateDoc(settingsDoc.ref, updatedSettings);
      }
    } catch (error) {
      console.error("Error updating calendar settings: ", error);
    }
  };

  // * UI for the calendar header
  return (
    <div className="bg-blue-200 grid grid-cols-3 rounded-t-lg w-full h-12 font-bold items-center px-2 sticky">
      <div className="col-span-1 justify-self-start">
        {/* button to go to the week or month of today */}
        <button
          className="inline-flex items-center justify-center py-2 px-4 my-1.5 text-sm text-white font-bold bg-gray-800 rounded-md hover:bg-gray-600 focus:outline-none"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </button>
      </div>
      {/* calendar title in the middle */}
      <div className="col-span-1 justify-center flex items-center gap-1">
        <div>My Calendar</div>
        <svg className="h-6 w-6" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M12,14a1,1,0,1,0-1-1A1,1,0,0,0,12,14Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,14Zm-5,4a1,1,0,1,0-1-1A1,1,0,0,0,12,18Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,18ZM7,14a1,1,0,1,0-1-1A1,1,0,0,0,7,14ZM19,4H18V3a1,1,0,0,0-2,0V4H8V3A1,1,0,0,0,6,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H19a1,1,0,0,1,1,1ZM7,18a1,1,0,1,0-1-1A1,1,0,0,0,7,18Z"></path>
          </g>
        </svg>
      </div>
      {/* buttons to change the view mode or view calendar options */}
      <div className="flex items-center gap-2 col-span-1 justify-self-end my-1.5">
        <Dropdown options={viewModeOptions} selectedOption={viewModeOptions.find((option) => option.value === viewMode)} setSelectedOption={handleViewModeChange} />
        <Menu options={calendarOptions} handleOptionClick={handleCalendarOptionClick} />
      </div>
    </div>
  );
}
