import React from "react";

export default function ResizableWidget({ children }) {
  return (
    <div className="flex bg-white shadow-2xl rounded-lg h-full">
      <div className="w-full flex flex-col items-center">{children}</div>
    </div>
  );
}
