import React from "react";
import { Link } from "react-router-dom";
import Widget from "../components/ui/Widget";
import Calendar from "../components/calendar/Calendar";
import BudgetComponent from "../components/budget/Budget";
import NotesComponent from "../components/notes/Notes";

export default function DashboardPage({ user }) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-screen lg:h-[calc(100vh-72px)] bg-gray-200">
        <div className="absolute inset-0 bg-opacity-25 backdrop-filter backdrop-blur-md items-stretch justify-center">
          {/* calendar widget */}
          <div className="p-3 w-full lg:h-[calc(55vh)]">
            <Widget id="calendar">
              <Calendar user={user} />
            </Widget>
          </div>

          <div className="md:flex-row md:flex-wrap lg:flex lg:flex-nowrap lg:w-full px-3 pb-3 gap-3 lg:h-[calc(45vh-72px)]">
            {/* budget widget */}
            <div className="pb-3 lg:pb-0 lg:w-2/3">
              <Widget id="budget">
                <BudgetComponent user={user} />
              </Widget>
            </div>

            {/* notes widget */}
            <div className="lg:w-1/3">
              <Widget id="notes">
                <NotesComponent user={user} />
              </Widget>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
