import React from "react";
import { db, doc, collection, updateDoc, deleteDoc } from "../../firebase/FirebaseConfig";

export default function NoteOptions({ user, note, pinned, setNotes, setNoteEdit }) {
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

  return (
    <>
      {note.pinned ? (
        // unpin note icon
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
      ) : (
        // pin note icon
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
      )}

      {/* edit note icon */}
      <div className="cursor-pointer transition hover:scale-110" onClick={() => setNoteEdit(note)}>
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
              <polygon className="st0" points="0,389.435 0,511.998 122.571,511.998 425.246,209.314 302.691,86.751 "></polygon>
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
    </>
  );
}
