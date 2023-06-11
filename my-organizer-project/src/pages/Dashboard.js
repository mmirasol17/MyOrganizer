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
              <Calendar user={user} />
            </ResizableWidget>
          </div>

          <div className="flex-grow md:w-1/2 lg:w-2/3 px-3 pb-3">
            <ResizableWidget>
              <BudgetComponent user={user} />
            </ResizableWidget>
          </div>

          <div className="flex-grow md:w-1/2 lg:w-1/3 pr-3 pb-3">
            <ResizableWidget>
              <NotesComponent user={user} />
            </ResizableWidget>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
