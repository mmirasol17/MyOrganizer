import React, { useState, useEffect } from "react";
import { db, collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from "../firebase/FirebaseConfig";

function NotesComponent({ user }) {
  // * variables needed for this component
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [pinnedNotes, setPinnedNotes] = useState([]);

  // * handle note input change
  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
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
        setPinnedNotes((prevPinnedNotes) => [...prevPinnedNotes, note]);
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
      setPinnedNotes((prevPinnedNotes) => prevPinnedNotes.filter((n) => n !== note));
    } catch (error) {
      console.error("Error unpinning note: ", error);
    }
  };

  // * delete a note
  const deleteNote = async (note) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const noteRef = doc(collection(userRef, "notes"), note.id);
      await deleteDoc(noteRef);
      setNotes((prevNotes) => prevNotes.filter((n) => n !== note));
      setPinnedNotes((prevPinnedNotes) => prevPinnedNotes.filter((n) => n !== note));
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  // * separate pinned and unpinned notes
  const unpinnedNotes = notes.filter((note) => !note.pinned);
  const filteredPinnedNotes = notes.filter((note) => note.pinned);

  return (
    <>
      <div className="bg-yellow-200 rounded-t-lg w-full text-center p-3 font-bold">My Notes</div>
      <div className="w-full p-2 text-center overflow-y-auto">
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
                <li key={note.id} className="flex rounded-md bg-yellow-200 shadow-md items-center justify-between mb-1.5 p-2 hover:bg-slate-200">
                  <div className="text-start">
                    <span className="font-bold">{note.content}</span>
                    <p className="text-gray-500 text-xs italic">Created at {note.createdAt && note.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
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

          {unpinnedNotes.length > 0 && (
            <ul>
              {unpinnedNotes.map((note) => (
                <li key={note.id} className="flex rounded-md bg-yellow-100 shadow-md items-center justify-between mb-1.5 p-2 hover:bg-slate-200">
                  <div className="text-start">
                    <span className="font-bold">{note.content}</span>
                    <p className="text-gray-500 text-xs italic">Created at {note.createdAt && note.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
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
    </>
  );
}

export default NotesComponent;
