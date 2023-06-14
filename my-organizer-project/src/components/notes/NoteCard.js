import React from "react";

export default function NoteCard({ note, color, children }) {
  return (
    <li key={note.id} className={`flex gap-1 rounded-md bg-${color} shadow-md items-center justify-between mb-1.5 py-1 px-2 hover:bg-slate-200`}>
      <div className="text-start">
        <span className="font-bold text-sm">{note.content}</span>
        <p className="text-gray-500 text-xs italic">
          {!note.updatedAt ? "Created" : "Updated"} at {note.createdAt}
        </p>
      </div>
      {children}
    </li>
  );
}
