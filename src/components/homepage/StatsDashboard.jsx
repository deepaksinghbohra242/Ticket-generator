// components/StatsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Ticket, CheckSquare, BarChart3, Users, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import { ticketAPI } from '../../api/ticketAPI'; 

const StatsDashboard = ({ user, selectedDepartment }) => {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("User in StatsDashboard:", stats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        let data;
        
        if (isSuperAdmin) {
          if (selectedDepartment) {
            // Super admin has selected a specific department
            data = await ticketAPI.departmentSummary(selectedDepartment);
          } else {
            // Super admin with no department selected - don't make API call
            setStats(null);
            setLoading(false);
            return;
          }
        } else {
          // Regular admin - show only their department stats
          data = await ticketAPI.departmentSummary(user.department);
        }
        
        setStats(data);
      } catch (error) {
        console.error("Error fetching ticket stats:", error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isSuperAdmin, user, selectedDepartment]);

  // Show loading state
  if (loading) {
    return <p className="text-gray-500">Loading stats...</p>;
  }

  // Show message when super admin has no department selected
  if (isSuperAdmin && !selectedDepartment) {
    return (
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">
                Please select a department to view its statistics.
              </p>
              <p className="text-sm font-medium text-blue-600">
                Viewing: No Department Selected
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message when no stats available
  if (!stats) {
    return <p className="text-gray-500">No stats available.</p>;
  }

  // Determine what to show in the header
  const getHeaderTitle = () => {
    if (isSuperAdmin) {
      return selectedDepartment ? `${selectedDepartment} Department` : 'Global Overview';
    }
    return `${user.department} Department`;
  };

  const getHeaderDescription = () => {
    if (isSuperAdmin) {
      return selectedDepartment 
        ? `Here's what's happening with ${selectedDepartment} tickets today.`
        : "Here's what's happening with all tickets across departments today.";
    }
    return "Here's what's happening with your department's tickets today.";
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">
                {getHeaderDescription()}
              </p>
              <p className="text-sm font-medium text-blue-600">
                Viewing: {getHeaderTitle()}
              </p>
            </div>
            {isSuperAdmin && selectedDepartment && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Department View</p>
                <p className="text-sm font-medium text-gray-700">{selectedDepartment}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Open Tickets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.openTickets}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Showing open issues
          </p>
        </div>

        {/* Assigned Tickets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{stats.assignedTickets}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            In progress
          </p>
        </div>

        {/* Closed Tickets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.closedTickets}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Successfully resolved
          </p>
        </div>

        {/* All Tickets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">All Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.allTickets}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Total tickets tracked</p>
        </div>
      </div>
    </>
  );
};

export default StatsDashboard;