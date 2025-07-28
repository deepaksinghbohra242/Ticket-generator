import React from "react";
import { BsPostcardFill } from "react-icons/bs";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100 z-50 p-2 flex justify-between items-center">
      <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
        <BsPostcardFill />
        VBS Ticket Collector
      </div>
      <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
