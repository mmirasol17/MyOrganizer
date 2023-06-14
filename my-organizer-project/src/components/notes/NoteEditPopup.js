import React, { useState, useEffect } from "react";
import Popup from "../ui/Popup";

export default function NoteEditPopupPopup({ noteEdit, setNoteEdit, updateNote }) {
  const [show, setShow] = useState(false);

  // * handle edit note change
  const handlenoteEditChange = (e) => {
    setNoteEdit({
      ...noteEdit,
      content: e.target.value,
    });
  };
  // * handle edit note popup close
  const handlenoteEditPopupClose = () => {
    setShow(false);
  };

  // * when edit note edit changes in parent component, show the popup
  useEffect(() => {
    if (noteEdit) {
      setShow(true);
    }
  }, [noteEdit]);

  // * when popup closes, set the edit note to null
  useEffect(() => {
    if (!show) {
      setNoteEdit(null);
    }
  }, [show]);

  // * the popup ui
  return (
    <>
      {noteEdit && (
        <Popup open={show} setOpen={setShow} onClose={handlenoteEditPopupClose}>
          {/* popup header */}
          <div className="bg-yellow-200 h-12 flex items-center justify-center gap-1 rounded-t-lg w-full text-center font-bold p-3">
            <div>Edit Note</div>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g id="File / Note_Edit">
                  <path
                    id="Vector"
                    d="M10.0002 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2839 19.7822 18.9076C20 18.4802 20 17.921 20 16.8031V14M16 5L10 11V14H13L19 8M16 5L19 2L22 5L19 8M16 5L19 8"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
          {/* popup body */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="w-full">
              <div className="mb-2 flex flex-col items-center justify-center">
                <label htmlFor="note" className="block text-gray-700 font-bold mb-2 text-lg">
                  Note
                </label>
                <textarea
                  type="text"
                  onChange={handlenoteEditChange}
                  value={noteEdit.content}
                  placeholder="Write a note..."
                  className="text-center flex-col flex-grow w-4/5 py-1.5 border border-gray-300 rounded focus:outline-none"
                />
              </div>
              <div className="text-sm italic text-center">
                {!noteEdit.updatedAt ? "Created" : "Last updated"} at {noteEdit.createdAt}
              </div>
            </div>
          </div>
          {/* popup footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => updateNote(noteEdit)}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Update
            </button>
            <button
              onClick={handlenoteEditPopupClose}
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
