import React, { useState } from "react";

function NotesComponent({ user }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [pinnedNotes, setPinnedNotes] = useState([]);

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const addNote = () => {
    if (newNote.trim() !== "") {
      const updatedNotes = [...notes, { id: Date.now(), content: newNote, pinned: false }];
      setNotes(updatedNotes);
      setNewNote("");
    }
  };

  const pinNote = (note) => {
    if (!note.pinned) {
      const updatedNotes = notes.map((n) => (n === note ? { ...n, pinned: true } : n));
      const updatedPinnedNotes = [...pinnedNotes, note];
      setNotes(updatedNotes);
      setPinnedNotes(updatedPinnedNotes);
    }
  };

  const unpinNote = (note) => {
    const updatedNotes = notes.map((n) => (n === note ? { ...n, pinned: false } : n));
    const updatedPinnedNotes = pinnedNotes.filter((n) => n !== note);
    setNotes(updatedNotes);
    setPinnedNotes(updatedPinnedNotes);
  };

  const deleteNote = (note) => {
    const updatedNotes = notes.filter((n) => n !== note);
    const updatedPinnedNotes = pinnedNotes.filter((n) => n !== note);
    setNotes(updatedNotes);
    setPinnedNotes(updatedPinnedNotes);
  };

  const unpinnedNotes = notes.filter((note) => !note.pinned);
  const filteredPinnedNotes = notes.filter((note) => note.pinned);

  return (
    <>
      <div className="bg-yellow-200 rounded-t-lg w-full text-center p-3 font-bold">My Notes</div>
      <div className="w-full p-2 text-center">
        <div className="w-full p-4">
          <div className="flex mb-4">
            <input
              type="text"
              value={newNote}
              onChange={handleNoteChange}
              placeholder="Write a note..."
              className="flex-grow px-4 py-2 mr-2 border border-gray-300 rounded focus:outline-none"
            />
            <button onClick={addNote} className="px-4 py-2 bg-gray-800 text-white font-bold rounded hover:bg-gray-600 focus:outline-none">
              Add
            </button>
          </div>

          {filteredPinnedNotes.length > 0 && (
            <ul>
              {filteredPinnedNotes.map((note) => (
                <li key={note.id} className="flex rounded-md items-center justify-between p-2 hover:bg-slate-200">
                  <span className="font-bold">{note.content}</span>
                  <div onClick={() => unpinNote(note)}>
                    <svg className="w-6 h-6" fill="#000000" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <polygon
                          fill-rule="evenodd"
                          points="407.375 180.927 226.292 0 196.135 30.188 226.303 60.331 159.062 127.562 79.771 146.51 15.177 211.104 90.59 286.517 0 376.956 0 407.125 30.169 407.125 120.76 316.688 196.198 392.125 260.812 327.521 279.75 248.229 347.025 180.954 377.208 211.115"
                          transform="translate(64 40.875)"
                        ></polygon>
                      </g>
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {unpinnedNotes.length > 0 && (
            <ul>
              {unpinnedNotes.map((note) => (
                <li key={note.id} className="flex rounded-md items-center justify-between p-2 hover:bg-slate-200">
                  <span className="font-bold">{note.content}</span>
                  <div onClick={() => pinNote(note)}>
                    <svg className="w-6 h-6" fill="#000000" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          fill-rule="evenodd"
                          d="M226.291627,7.10542736e-15 L407.374933,180.927147 L377.20832,211.114667 L347.02464,180.954453 L279.749973,248.22912 L260.812373,327.520853 L196.19776,392.125013 L120.76032,316.687573 L30.1691733,407.12512 L7.10542736e-15,407.12512 L7.10542736e-15,376.955947 L90.5898667,286.51712 L15.17696,211.104 L79.7706667,146.510293 L159.0624,127.562453 L226.30336,60.3306667 L196.135467,30.18752 L226.291627,7.10542736e-15 Z M256.481707,90.4859733 L180.708267,166.25024 L101.416533,185.19808 L75.5101867,211.104427 L196.19776,331.792 L222.104107,305.896107 L241.041707,226.59392 L316.845013,150.799787 L256.481707,90.4859733 Z"
                          transform="translate(64 40.875)"
                        ></path>
                      </g>
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default NotesComponent;
