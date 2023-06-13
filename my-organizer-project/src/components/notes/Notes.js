import React, { useState, useEffect } from "react";
import { db, collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from "../../firebase/FirebaseConfig";

export default function NotesComponent({ user }) {
  // * variables needed for this component
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editNote, setEditNote] = useState(null);

  // * handle note input change
  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  // * handle edit note change
  const handleEditNoteChange = (e) => {
    setEditNote({
      ...editNote,
      content: e.target.value,
    });
  };

  // * handle edit note modal close
  const handleEditNotePopupClose = () => {
    setEditNote(null);
  };

  // * initially fetch existing notes from Firestore
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const notesRef = collection(userRef, "notes");
        const snapshot = await getDocs(notesRef);
        if (!snapshot.empty) {
          const fetchedNotes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setNotes(fetchedNotes);
        }
      } catch (error) {
        console.error("Error fetching notes: ", error);
      }
    };
    if (user) {
      fetchNotes();
    }
  }, [user]);

  // * add a new note
  const addNote = async () => {
    if (newNote.trim() !== "") {
      const currentDate = new Date();
      const note = {
        content: newNote,
        pinned: false,
        createdAt: currentDate.toLocaleString(),
      };
      try {
        const userRef = doc(db, "users", user.uid);
        const notesRef = collection(userRef, "notes");
        const newNoteRef = await addDoc(notesRef, note);
        setNotes((prevNotes) => [...prevNotes, { id: newNoteRef.id, ...note }]);
        setNewNote("");
      } catch (error) {
        console.error("Error adding note: ", error);
      }
    }
  };

  // * pin a note
  const pinNote = async (note) => {
    if (!note.pinned) {
      try {
        const userRef = doc(db, "users", user.uid);
        const noteRef = doc(collection(userRef, "notes"), note.id);
        await updateDoc(noteRef, { pinned: true });
        setNotes((prevNotes) => prevNotes.map((n) => (n === note ? { ...n, pinned: true } : n)));
      } catch (error) {
        console.error("Error pinning note: ", error);
      }
    }
  };

  // * unpin a note
  const unpinNote = async (note) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const noteRef = doc(collection(userRef, "notes"), note.id);
      await updateDoc(noteRef, { pinned: false });
      setNotes((prevNotes) => prevNotes.map((n) => (n === note ? { ...n, pinned: false } : n)));
    } catch (error) {
      console.error("Error unpinning note: ", error);
    }
  };

  // * update an edited note
  const updateNote = async (note) => {
    try {
      if (note.content.trim() === "") {
        deleteNote(note);
        setEditNote(null);
        return;
      }
      const userRef = doc(db, "users", user.uid);
      const noteRef = doc(collection(userRef, "notes"), note.id);
      await updateDoc(noteRef, { content: note.content, updatedAt: new Date().toLocaleString() });
      // get rid of the edited note from the notes array
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== note.id));
      // add the edited note to the notes array with when it was updated
      setNotes((prevNotes) => [...prevNotes, { ...note, updatedAt: new Date().toLocaleString() }]);
      setEditNote(null);
    } catch (error) {
      console.error("Error updating note: ", error);
    }
  };

  // * delete a note
  const deleteNote = async (note) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const noteRef = doc(collection(userRef, "notes"), note.id);
      await deleteDoc(noteRef);
      setNotes((prevNotes) => prevNotes.filter((n) => n !== note));
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  // * separate pinned and unpinned notes
  const unpinnedNotes = notes.filter((note) => !note.pinned);
  const filteredPinnedNotes = notes.filter((note) => note.pinned);

  return (
    <>
      {/* widget header */}
      <div className="bg-yellow-200 h-12 items-center grid grid-cols-3 rounded-t-lg w-full text-center font-bold p-3">
        <div className="col-span-1 justify-self-start"></div>
        <div className="flex justify-center gap-1 ">
          <div>My Notes</div>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <g id="File / Note_Edit">
                <path
                  id="Vector"
                  d="M10.0002 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2839 19.7822 18.9076C20 18.4802 20 17.921 20 16.8031V14M16 5L10 11V14H13L19 8M16 5L19 2L22 5L19 8M16 5L19 8"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </g>
          </svg>
        </div>
        <div className="col-span-1 justify-self-end">
          <svg className="h-6 w-6 transition hover:scale-110 fill-gray-800 hover:fill-gray-600" fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M1703.534 960c0-41.788-3.84-84.48-11.633-127.172l210.184-182.174-199.454-340.856-265.186 88.433c-66.974-55.567-143.323-99.389-223.85-128.415L1158.932 0h-397.78L706.49 269.704c-81.43 29.138-156.423 72.282-223.962 128.414l-265.073-88.32L18 650.654l210.184 182.174C220.39 875.52 216.55 918.212 216.55 960s3.84 84.48 11.633 127.172L18 1269.346l199.454 340.856 265.186-88.433c66.974 55.567 143.322 99.389 223.85 128.415L761.152 1920h397.779l54.663-269.704c81.318-29.138 156.424-72.282 223.963-128.414l265.073 88.433 199.454-340.856-210.184-182.174c7.793-42.805 11.633-85.497 11.633-127.285m-743.492 395.294c-217.976 0-395.294-177.318-395.294-395.294 0-217.976 177.318-395.294 395.294-395.294 217.977 0 395.294 177.318 395.294 395.294 0 217.976-177.317 395.294-395.294 395.294"
                fillRule="evenodd"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      <div className="w-full p-2 text-center overflow-y-auto">
        {/* new note input field with add button */}
        <div className="w-full p-4">
          <div className="flex mb-4 gap-1.5">
            <input
              type="text"
              value={newNote}
              onChange={handleNoteChange}
              placeholder="Write a note..."
              className="flex-grow px-4 py-1.5 border border-gray-300 rounded focus:outline-none"
            />
            <button onClick={addNote} className="px-4 py-1.5 bg-gray-800 text-white text-sm font-bold rounded hover:bg-gray-600 focus:outline-none">
              Add
            </button>
          </div>

          {/* show pinned notes at the top */}
          {filteredPinnedNotes.length > 0 && (
            <ul>
              {filteredPinnedNotes.map((note) => (
                <li key={note.id} className="flex rounded-md bg-yellow-200 shadow-md items-center justify-between mb-1.5 py-1 px-2 hover:bg-slate-200">
                  <div className="text-start">
                    <span className="font-bold text-sm">{note.content}</span>
                    <p className="text-gray-500 text-xs italic">
                      {!note.updatedAt ? "Created" : "Updated"} at {note.createdAt}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {/* unpin note icon */}
                    <div className="cursor-pointer transition hover:scale-110" onClick={() => unpinNote(note)}>
                      <svg className="w-5 h-5" fill="#000000" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <polygon
                            fillRule="evenodd"
                            points="407.375 180.927 226.292 0 196.135 30.188 226.303 60.331 159.062 127.562 79.771 146.51 15.177 211.104 90.59 286.517 0 376.956 0 407.125 30.169 407.125 120.76 316.688 196.198 392.125 260.812 327.521 279.75 248.229 347.025 180.954 377.208 211.115"
                            transform="translate(64 40.875)"
                          ></polygon>
                        </g>
                      </svg>
                    </div>
                    {/* edit note icon */}
                    <div className="cursor-pointer transition hover:scale-110" onClick={() => setEditNote(note)}>
                      <svg className="w-4 h-4" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#000000">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <style type="text/css"> </style>
                          <g>
                            <path
                              className="st0"
                              d="M494.56,55.774l-38.344-38.328c-23.253-23.262-60.965-23.253-84.226,0l-35.878,35.878l122.563,122.563 l35.886-35.878C517.814,116.747,517.814,79.044,494.56,55.774z"
                            ></path>
                            <polygon className="st0" points="0,389.435 0,511.998 122.571,511.998 425.246,209.314 302.691,86.751 "></polygon>{" "}
                          </g>
                        </g>
                      </svg>
                    </div>
                    {/* delete note icon */}
                    <div className="cursor-pointer transition hover:scale-110" onClick={() => deleteNote(note)}>
                      <svg className="w-5 h-5 cf-icon-svg" fill="#FF0000" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path>
                        </g>
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* show unpinned notes below the pinned notes */}
          {unpinnedNotes.length > 0 && (
            <ul>
              {unpinnedNotes.map((note) => (
                <li key={note.id} className="flex rounded-md bg-yellow-100 shadow-md items-center justify-between mb-1.5 py-1 px-2 hover:bg-slate-200">
                  <div className="text-start">
                    <span className="font-bold text-sm">{note.content}</span>
                    <p className="text-gray-500 text-xs italic">
                      {!note.updatedAt ? "Created" : "Updated"} at {note.createdAt}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {/* pin note icon */}
                    <div className="cursor-pointer transition hover:scale-110" onClick={() => pinNote(note)}>
                      <svg className="w-5 h-5" fill="#000000" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            fillRule="evenodd"
                            d="M226.291627,7.10542736e-15 L407.374933,180.927147 L377.20832,211.114667 L347.02464,180.954453 L279.749973,248.22912 L260.812373,327.520853 L196.19776,392.125013 L120.76032,316.687573 L30.1691733,407.12512 L7.10542736e-15,407.12512 L7.10542736e-15,376.955947 L90.5898667,286.51712 L15.17696,211.104 L79.7706667,146.510293 L159.0624,127.562453 L226.30336,60.3306667 L196.135467,30.18752 L226.291627,7.10542736e-15 Z M256.481707,90.4859733 L180.708267,166.25024 L101.416533,185.19808 L75.5101867,211.104427 L196.19776,331.792 L222.104107,305.896107 L241.041707,226.59392 L316.845013,150.799787 L256.481707,90.4859733 Z"
                            transform="translate(64 40.875)"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    {/* edit note icon */}
                    <div className="cursor-pointer transition hover:scale-110" onClick={() => setEditNote(note)}>
                      <svg className="w-4 h-4" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#000000">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <style type="text/css"> </style>
                          <g>
                            <path
                              className="st0"
                              d="M494.56,55.774l-38.344-38.328c-23.253-23.262-60.965-23.253-84.226,0l-35.878,35.878l122.563,122.563 l35.886-35.878C517.814,116.747,517.814,79.044,494.56,55.774z"
                            ></path>
                            <polygon className="st0" points="0,389.435 0,511.998 122.571,511.998 425.246,209.314 302.691,86.751 "></polygon>{" "}
                          </g>
                        </g>
                      </svg>
                    </div>
                    {/* delete note icon */}
                    <div className="cursor-pointer transition hover:scale-110" onClick={() => deleteNote(note)}>
                      <svg className="w-5 h-5 cf-icon-svg" fill="#FF0000" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path>
                        </g>
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* if no notes exist show a message */}
      {notes.length === 0 && (
        <div className="p-10 flex flex-col mb-8 gap-1 text-center w-1/2 rounded-lg justify-center items-center bg-gray-200">
          <svg className="h-10 w-10 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M8.28906 6.29C7.86906 6.29 7.53906 5.95 7.53906 5.54V2.75C7.53906 2.34 7.86906 2 8.28906 2C8.70906 2 9.03906 2.34 9.03906 2.75V5.53C9.03906 5.95 8.70906 6.29 8.28906 6.29Z"
                fill="rgb(107 114 128 / var(--tw-text-opacity))"
              ></path>
              <path
                d="M15.7109 6.29C15.2909 6.29 14.9609 5.95 14.9609 5.54V2.75C14.9609 2.33 15.3009 2 15.7109 2C16.1309 2 16.4609 2.34 16.4609 2.75V5.53C16.4609 5.95 16.1309 6.29 15.7109 6.29Z"
                fill="rgb(107 114 128 / var(--tw-text-opacity))"
              ></path>
              <path
                d="M19.57 4.5C18.91 4.01 17.96 4.48 17.96 5.31V5.41C17.96 6.58 17.12 7.66 15.95 7.78C14.6 7.92 13.46 6.86 13.46 5.54V4.5C13.46 3.95 13.01 3.5 12.46 3.5H11.54C10.99 3.5 10.54 3.95 10.54 4.5V5.54C10.54 6.33 10.13 7.03 9.51 7.42C9.42 7.48 9.32 7.53 9.22 7.58C9.13 7.63 9.03 7.67 8.92 7.7C8.8 7.74 8.67 7.77 8.53 7.78C8.37 7.8 8.21 7.8 8.05 7.78C7.91 7.77 7.78 7.74 7.66 7.7C7.56 7.67 7.46 7.63 7.36 7.58C7.26 7.53 7.16 7.48 7.07 7.42C6.44 6.98 6.04 6.22 6.04 5.41V5.31C6.04 4.54 5.22 4.08 4.57 4.41C4.56 4.42 4.55 4.42 4.54 4.43C4.5 4.45 4.47 4.47 4.43 4.5C4.4 4.53 4.36 4.55 4.33 4.58C4.05 4.8 3.8 5.05 3.59 5.32C3.48 5.44 3.39 5.57 3.31 5.7C3.3 5.71 3.29 5.72 3.28 5.74C3.19 5.87 3.11 6.02 3.04 6.16C3.02 6.18 3.01 6.19 3.01 6.21C2.95 6.33 2.89 6.45 2.85 6.58C2.82 6.63 2.81 6.67 2.79 6.72C2.73 6.87 2.69 7.02 2.65 7.17C2.61 7.31 2.58 7.46 2.56 7.61C2.54 7.72 2.53 7.83 2.52 7.95C2.51 8.09 2.5 8.23 2.5 8.37V17.13C2.5 19.82 4.68 22 7.37 22H16.63C19.32 22 21.5 19.82 21.5 17.13V8.37C21.5 6.78 20.74 5.39 19.57 4.5ZM12 16.25H10.31V18C10.31 18.41 9.97 18.75 9.56 18.75C9.14 18.75 8.81 18.41 8.81 18V16.25H7C6.59 16.25 6.25 15.91 6.25 15.5C6.25 15.09 6.59 14.75 7 14.75H8.81V13C8.81 12.59 9.14 12.25 9.56 12.25C9.97 12.25 10.31 12.59 10.31 13V14.75H12C12.41 14.75 12.75 15.09 12.75 15.5C12.75 15.91 12.41 16.25 12 16.25Z"
                fill="rgb(107 114 128 / var(--tw-text-opacity))"
              ></path>
            </g>
          </svg>
          <p className="text-gray-500 text-sm">No notes yet. Create a new note above to see them here!</p>
        </div>
      )}

      {/* edit note popup */}
      {editNote && (
        <div className="edit-note-popup fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* popup content */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {/* popup header */}
              <div className="bg-yellow-200 h-12 flex items-center justify-center gap-1 rounded-t-lg w-full text-center font-bold p-3">
                <div>Edit Note</div>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <g id="File / Note_Edit">
                      <path
                        id="Vector"
                        d="M10.0002 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2839 19.7822 18.9076C20 18.4802 20 17.921 20 16.8031V14M16 5L10 11V14H13L19 8M16 5L19 2L22 5L19 8M16 5L19 8"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </g>
                </svg>
              </div>
              {/* popup body */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="w-full">
                  <div className="mb-2 flex flex-col items-center justify-center">
                    <label htmlFor="note" className="block text-gray-700 font-bold mb-2 text-lg">
                      Note
                    </label>
                    <textarea
                      type="text"
                      onChange={handleEditNoteChange}
                      value={editNote.content}
                      placeholder="Write a note..."
                      className=" flex-col flex-grow w-4/5 py-1.5 border border-gray-300 rounded focus:outline-none"
                    />
                  </div>
                  <div className="text-sm italic text-center">
                    {!editNote.updatedAt ? "Created" : "Last updated"} at {editNote.createdAt}
                  </div>
                </div>
              </div>
              {/* popup footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => updateNote(editNote)}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update
                </button>
                <button
                  onClick={handleEditNotePopupClose}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
