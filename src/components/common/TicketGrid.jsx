import React from 'react'
import Card from './Card';

function TicketGrid({ tickets, type, title }) {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket, i) => (
          <Card key={`${ticket.id}-${i}`} ticket={ticket} type={type} />
        ))}
      </div>
    </div>
  );
}

export default TicketGrid
