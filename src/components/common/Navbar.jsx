import React from "react";
import { BsPostcardFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-200 z-50 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2 text-xl font-semibold text-blue-700">
        <BsPostcardFill size={22} />
        <span>VBS Ticket Collector</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <CgProfile size={18} className="text-blue-600" />
          <span>Deepak Singh</span> 
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
