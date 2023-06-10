import React from "react";
import { Link } from "react-router-dom";
import ResizableWidget from "../components/ResizableWidget";
import Calendar from "../components/Calendar";
import BudgetComponent from "../components/Budget";
import NotesComponent from "../components/Notes";

function DashboardPage({ user }) {
  return (
    <div className="flex items-center justify-center">
      {/* Updated line */}
      <div className="relative w-screen h-[calc(100vh-72px)] bg-gray-200">
        <div className="absolute inset-0 bg-opacity-25 backdrop-filter backdrop-blur-md flex flex-col md:flex-row md:flex-wrap items-stretch justify-center">
          <div className="flex-grow md:w-screen p-3">
            <ResizableWidget>
              <div className="bg-blue-200 rounded-t-lg w-full text-center p-3 font-bold">Calendar</div>
              <div className="w-full p-2 text-center">
                <Calendar />
              </div>
            </ResizableWidget>
          </div>

          <div className="flex-grow md:w-1/2 lg:w-1/2 px-3 pb-3">
            <ResizableWidget>
              <div className="bg-green-200 rounded-t-lg w-full text-center p-3 font-bold">Budget Summary</div>
              <div className="w-full p-2 text-center">
                <BudgetComponent />
              </div>
            </ResizableWidget>
          </div>

          <div className="flex-grow md:w-1/2 lg:w-1/2 pr-3 pb-3">
            <ResizableWidget>
              <div className="bg-yellow-200 rounded-t-lg w-full text-center p-3 font-bold">Notes</div>
              <div className="w-full p-2 text-center">
                <NotesComponent />
              </div>
            </ResizableWidget>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
