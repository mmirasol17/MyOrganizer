import React, { useState } from "react";

function NotesComponent() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [pinnedNotes, setPinnedNotes] = useState([]);

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const addNote = () => {
    if (newNote.trim() !== "") {
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setNewNote("");
    }
  };

  const pinNote = (note) => {
    const updatedPinnedNotes = [note, ...pinnedNotes];
    setPinnedNotes(updatedPinnedNotes);
  };

  const unpinNote = (note) => {
    const updatedPinnedNotes = pinnedNotes.filter((n) => n !== note);
    setPinnedNotes(updatedPinnedNotes);
  };

  return (
    <div>
      <h2>Notes</h2>
      <div>
        <input type="text" value={newNote} onChange={handleNoteChange} placeholder="Write a note..." />
        <button onClick={addNote}>Add</button>
      </div>
      <h3>Unpinned Notes</h3>
      {notes.map((note) => (
        <div key={note}>
          <span>{note}</span>
          <button onClick={() => pinNote(note)}>Pin</button>
        </div>
      ))}
      <h3>Pinned Notes</h3>
      {pinnedNotes.map((note) => (
        <div key={note}>
          <span>{note}</span>
          <button onClick={() => unpinNote(note)}>Unpin</button>
        </div>
      ))}
    </div>
  );
}

export default NotesComponent;
