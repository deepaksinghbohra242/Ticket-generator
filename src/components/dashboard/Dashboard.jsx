import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";

function Dashboard() {
  return (
    <div className="pt-12"> 
      <div className="flex">
        <div className="w-64 fixed top-12 left-0 h-[calc(100vh-3rem)] bg-gray-200 shadow-md z-40">
          <Sidebar />
        </div>

        <main className="ml-64 w-full min-h-[calc(100vh-3rem)] p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
