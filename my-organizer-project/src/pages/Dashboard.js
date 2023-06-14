import React from "react";

import CalendarWidget from "../components/calendar/CalendarWidget";
import BudgetWidget from "../components/budget/BudgetWidget";
import NotesWidget from "../components/notes/NotesWidget";

export default function DashboardPage({ user }) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-screen lg:h-[calc(100vh-72px)] bg-gray-200">
        <div className="absolute inset-0 bg-opacity-25 backdrop-filter backdrop-blur-md items-stretch justify-center">
          {/* calendar widget */}
          <div className="p-3 w-full lg:h-[calc(55vh)]">
            <CalendarWidget user={user} />
          </div>

          <div className="md:flex-row md:flex-wrap lg:flex lg:flex-nowrap lg:w-full px-3 pb-3 gap-3 lg:h-[calc(45vh-72px)]">
            {/* budget widget */}
            <div className="pb-3 lg:pb-0 lg:w-2/3">
              <BudgetWidget user={user} />
            </div>

            {/* notes widget */}
            <div className="lg:w-1/3">
              <NotesWidget user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
