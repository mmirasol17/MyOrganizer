import React from "react";
import { Link } from "react-router-dom";
import ResizableWidget from "../components/ResizableWidget";

function DashboardPage({ user }) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-screen h-screen bg-gray-200">
        <div className="absolute inset-0 bg-opacity-25 backdrop-filter backdrop-blur-md flex flex-col md:flex-row md:flex-wrap items-stretch justify-center">
          <div className="flex-grow md:w-screen mb-6">
            <ResizableWidget>
              <div className="bg-blue-200 p-4 font-bold">Calendar</div>
            </ResizableWidget>
          </div>

          <div className="flex-grow md:w-1/2 lg:w-1/2">
            <ResizableWidget>
              <div className="bg-green-200 p-4 font-bold">Budget</div>
            </ResizableWidget>
          </div>

          <div className="flex-grow md:w-1/2 lg:w-1/2">
            <ResizableWidget>
              <div className="bg-yellow-200 p-4 font-bold">Notes</div>
            </ResizableWidget>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
