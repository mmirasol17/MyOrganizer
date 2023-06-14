import React, { useEffect, useRef } from "react";

export default function Popup({ children, open, setOpen, onClose }) {
  const popupRef = useRef(null);

  // * if a user clicks outside of the popup or presses the escape key, close it
  useEffect(() => {
    const handleClickOutsideOrEscape = (event) => {
      if (popupRef.current && (!popupRef.current.contains(event.target) || event.key === "Escape")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideOrEscape);
    document.addEventListener("keydown", handleClickOutsideOrEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOrEscape);
      document.removeEventListener("keydown", handleClickOutsideOrEscape);
    };
  }, [popupRef, setOpen]);

  // * the popup ui
  return (
    <>
      {open && (
        <div className={`edit-note-popup fixed z-10 inset-0 overflow-y-auto`}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* overlay */}
            <div className={`fixed inset-0 transition-opacity ${open ? "opacity-75" : "opacity-0"}`} aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500"></div>
            </div>

            {/* popup content */}
            <span className={`hidden sm:inline-block sm:align-middle sm:h-screen ${open ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
              &#8203;
            </span>
            <div
              ref={popupRef}
              className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
