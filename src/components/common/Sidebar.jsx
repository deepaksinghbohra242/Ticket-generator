import { NavLink, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { 
  Ticket, 
  Users, 
  Plus, 
  CheckSquare, 
  Trash2,
  Home,
} from "lucide-react";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { FaClosedCaptioning } from "react-icons/fa";
import { RiMailCloseFill } from "react-icons/ri";


function Sidebar({ user }) {
  const location = useLocation();
  const [activeParent, setActiveParent] = useState(null);

  // Track the active parent when navigating
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Store the current non-nested route as active parent
    const directRoutes = [
      '/dashboard/homepage',
      '/dashboard/tickets', 
      '/dashboard/newticket',
      '/dashboard/raisedticket',
      '/dashboard/assignedticket',
      '/dashboard/closedticket',
      '/dashboard/cc',
      '/dashboard/employeelist'
    ];
    
    const directRoute = directRoutes.find(route => currentPath === route);
    if (directRoute) {
      setActiveParent(directRoute);
    }
    // If on a nested route, keep the previous active parent
  }, [location.pathname]);

  const adminNavItems = [
    { path: '/dashboard/employeelist', icon: Users, label: 'Employees' },
  ];

  const userNavItems = [
    { path: '/dashboard/homepage', icon: Home, label: 'Dashboard' },
    { path: '/dashboard/tickets', icon: Ticket, label: 'All Tickets' },
    { path: '/dashboard/newticket', icon: Plus, label: 'New Ticket' },
    { path: '/dashboard/raisedticket', icon: HiOutlineHandRaised, label: 'Raised Tickets' },
    { path: '/dashboard/assignedticket', icon: CheckSquare, label: 'Assigned Tickets' },
    { path: '/dashboard/closedticket', icon: RiMailCloseFill, label: 'Closed Tickets' },
    { path: '/dashboard/cc', icon: FaClosedCaptioning, label: 'CC to me' },
  ];

  const navItems =
    user === 'superadmin' || user === 'admin'
      ? [...adminNavItems, ...userNavItems]
      : userNavItems;

  const isActiveNavItem = (itemPath) => {
    const currentPath = location.pathname;
    
    if (currentPath === itemPath) {
      return true;
    }
    
    if (currentPath.startsWith('/dashboard/editticket') && itemPath === '/dashboard/newticket') {
      return true;
    }
    
    if (currentPath.startsWith('/dashboard/addemployee') && itemPath === '/dashboard/employeelist') {
      return true;
    }
    
    if (currentPath.startsWith('/dashboard/viewticket')) {
      return activeParent === itemPath;
    }
    
    return false;
  };

  const roleStyles = {
    superadmin: {
      wrapper: "bg-red-100 text-red-700",
      dot: "bg-red-500",
      label: "SuperAdmin",
    },
    admin: {
      wrapper: "bg-purple-100 text-purple-700",
      dot: "bg-purple-500",
      label: "Administrator",
    },
    employee: {
      wrapper: "bg-green-100 text-green-700",
      dot: "bg-green-500",
      label: "Employee",
    },
  };

  const role = roleStyles[user] || roleStyles.employee;

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl border-r border-gray-200 z-40">
      <div className="p-6">
        {/* role badge */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${role.wrapper}`}
          >
            <div className={`w-2 h-2 rounded-full ${role.dot}`} />
            {role.label}
          </div>
        </div>

        {/* nav items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = isActiveNavItem(item.path);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;