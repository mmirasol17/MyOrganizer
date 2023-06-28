import React, { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function Menu({ options, handleOptionClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = `dropdown-menu-${uuid()}`;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuButtonRef.current && menuRef.current && !menuButtonRef.current.contains(event.target) && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="relative inline-block text-left">
      <div>
        <span className="rounded-md shadow-sm">
          <button
            ref={menuButtonRef}
            type="button"
            className="flex items-center justify-center rounded-full w-8 gap-2 py-1 text-sm text-white font-bold bg-gray-800 hover:bg-gray-600 focus:outline-none"
            id={menuId}
            aria-haspopup="true"
            aria-expanded={isOpen}
            onClick={toggleDropdown}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </button>
        </span>
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 w-48"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={menuId}
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option.value}
                className="flex items-center text-white hover:bg-gray-600 w-full pl-6 pr-4 py-2 text-sm"
                role="menuitem"
                onClick={() => {
                  handleOptionClick(option);
                  setIsOpen(false);
                }}
              >
                <div className="justify-self-start">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
