import React from "react";
import { Link } from "react-router-dom";
import ResizableWidget from "../components/ResizableWidget";
import Calendar from "../components/Calendar";
import BudgetComponent from "../components/Budget";
import NotesComponent from "../components/Notes";

function DashboardPage({ user }) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-screen lg:h-[calc(100vh-72px)] bg-gray-200">
        <div className="absolute inset-0 bg-opacity-25 backdrop-filter backdrop-blur-md items-stretch justify-center">
          {/* calendar widget */}
          <div className="p-3 w-full lg:h-[calc(50vh)]">
            <ResizableWidget id="calendar">
              <Calendar user={user} />
            </ResizableWidget>
          </div>

          <div className="md:flex-row md:flex-wrap lg:flex lg:flex-nowrap lg:w-full px-3 pb-3 gap-3 lg:h-[calc(50vh-72px)]">
            {/* budget widget */}
            <div className="pb-3 lg:pb-0 lg:w-2/3">
              <ResizableWidget id="budget">
                <BudgetComponent user={user} />
              </ResizableWidget>
            </div>

            {/* notes widget */}
            <div className="lg:w-1/3">
              <ResizableWidget id="notes">
                <NotesComponent user={user} />
              </ResizableWidget>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
