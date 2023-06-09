import React from "react";

const ResizableWidget = ({ children }) => {
  return (
    <div className="flex bg-white shadow-2xl flex-grow rounded-lg h-full">
      <div className="w-full flex flex-col items-center">{children}</div>
    </div>
  );
};

export default ResizableWidget;
