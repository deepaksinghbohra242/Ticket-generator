import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import React from "react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user="admin" />

      <main className="flex-1 pt-24 ml-66">
        <Outlet /> 
      </main>
    </div>
  );
}

export default Dashboard;
