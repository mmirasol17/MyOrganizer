import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-4 text-center">
      <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} MyOrganizer. All rights reserved.</p>
    </footer>
  );
}
