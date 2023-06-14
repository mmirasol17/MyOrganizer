import React, { useState, useEffect } from "react";
import { db, collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from "../../firebase/FirebaseConfig";
import Widget from "../ui/Widget";

import NoteEditPopup from "./NoteEditPopup";
import NoteOptions from "./NoteOptions";
import NotesEmptyMsg from "./NotesEmptyMsg";
import NotesHeader from "./NotesHeader";
import NoteCard from "./NoteCard";

export default function NotesWidget({ user }) {
  // * variables needed for this component
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [noteEdit, setNoteEdit] = useState(null);

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
    if (user) fetchNotes();
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
        setNoteEdit(null);
        return;
      }
      const userRef = doc(db, "users", user.uid);
      const noteRef = doc(collection(userRef, "notes"), note.id);
      await updateDoc(noteRef, { content: note.content, updatedAt: new Date().toLocaleString() });
      // get rid of the edited note from the notes array
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== note.id));
      // add the edited note to the notes array with when it was updated
      setNotes((prevNotes) => [...prevNotes, { ...note, updatedAt: new Date().toLocaleString() }]);
      setNoteEdit(null);
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
    <Widget id="notes">
      {/* widget header */}
      <NotesHeader />

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
                <NoteCard key={note.id} note={note} color="yellow-200">
                  <div className="flex gap-2 items-center">
                    <NoteOptions note={note} pinned={true} pinNote={pinNote} unpinNote={unpinNote} setNoteEdit={setNoteEdit} deleteNote={deleteNote} />
                  </div>
                </NoteCard>
              ))}
            </ul>
          )}

          {/* show unpinned notes below the pinned notes */}
          {unpinnedNotes.length > 0 && (
            <ul>
              {unpinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} color="yellow-100">
                  <div className="flex gap-2 items-center">
                    <NoteOptions note={note} pinned={false} pinNote={pinNote} unpinNote={unpinNote} setNoteEdit={setNoteEdit} deleteNote={deleteNote} />
                  </div>
                </NoteCard>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* if no notes exist show a message */}
      <NotesEmptyMsg show={notes.length === 0} />

      {/* edit note popup */}
      <NoteEditPopup noteEdit={noteEdit} setNoteEdit={setNoteEdit} updateNote={updateNote} />
    </Widget>
  );
}
