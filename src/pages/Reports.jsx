import React from "react";

const cardData = [
  { title: "Ticket Status", value: 42, bg: "bg-blue-500" },
  { title: "Daily Ticket Count", value: 13, bg: "bg-red-500" },
  { title: "By Departments", value: 5, bg: "bg-yellow-500" },
];

function Reports() {
  return (
    <div className="p-6">
      <div className="text-center text-2xl font-bold mb-6">
        📊 Live Admin Dashboard
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-lg text-white ${card.bg}`}
          >
            <div className="text-sm uppercase tracking-wider">{card.title}</div>
            <div className="text-3xl font-semibold mt-2">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reports;
