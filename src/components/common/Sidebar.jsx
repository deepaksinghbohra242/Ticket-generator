import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navStyle = ({ isActive }) =>
    isActive
      ? "block px-4 py-2 bg-blue-600 text-white rounded"
      : "block px-4 py-2 hover:bg-blue-100 rounded";

  return (
    <div className="w-64 min-h-screen bg-gray-100 shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <nav className="space-y-2">
        <NavLink to="/dashboard/tickets" className={navStyle}>Tickets</NavLink>
        <NavLink to="/dashboard/reports" className={navStyle}>Reports</NavLink>
        <NavLink to="/dashboard/employeelist" className={navStyle}>Employees</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
