import React from "react";

const ResizableWidget = ({ children }) => {
  return (
    <div className="flex bg-white shadow-lg m-3 flex-grow rounded-lg h-full">
      <div className="w-full flex flex-col items-center">{children}</div>
    </div>
  );
};

export default ResizableWidget;
