import React, { useEffect, useState } from 'react'
import { 
  Menu, 
  Ticket, 
  BarChart3, 
  Users, 
  CheckSquare,
  Plus,
  Building2,
  BookOpen,
  Clock,
  AlertCircle,
  TrendingUp,
  Loader2,
  X
} from "lucide-react";
import { ticketAPI } from '../../api/ticketAPI';

function HomePage() {
  const [departments, setDepartments] = useState(['HR','IT', 'Finance', 'Hardware']);
  const [selectedDepartment, setSelectedDepartment] = useState('HR');
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedDepartment) return;
      
      try {
        setLoading(true);
        const subs = await ticketAPI.getSubjects(selectedDepartment);
        setSubjects(subs);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedDepartment]);

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
  };

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) return;
    
    try {
      // Add to local state
      setDepartments([...departments, newDepartmentName.trim()]);
      setNewDepartmentName('');
      setShowAddDeptModal(false);
      
      // If this is the first department, select it
      if (departments.length === 0) {
        setSelectedDepartment(newDepartmentName.trim());
      }
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  // Handle add subject
  const handleAddSubject = async () => {
    if (!newSubjectName.trim() || !selectedDepartment) return;
    
    try {
      // Add to local state
      setSubjects([...subjects, newSubjectName.trim()]);
      setNewSubjectName('');
      setShowAddSubjectModal(false);
      
      // Here you could also make an API call to persist the subject
      // await ticketAPI.addSubject(selectedDepartment, newSubjectName.trim());
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const recentActivity = [
    { id: 1, action: 'Ticket #TK-001 assigned to you', time: '2 minutes ago', type: 'assignment' },
    { id: 2, action: 'New ticket created in IT Support', time: '15 minutes ago', type: 'creation' },
    { id: 3, action: 'Ticket #TK-045 resolved', time: '1 hour ago', type: 'resolution' },
    { id: 4, action: 'Priority updated for Ticket #TK-023', time: '2 hours ago', type: 'update' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back, Deepak! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your tickets today.
            </p>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              2 high priority
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              This month
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900">2.3h</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">24h target</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Departments Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Departments
                  </h2>
                  <button 
                    onClick={() => setShowAddDeptModal(true)}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Department
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.map((dept, index) => (
                    <div 
                      key={index} 
                      onClick={() => handleDepartmentClick(dept)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedDepartment === dept 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 hover:shadow-sm hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            selectedDepartment === dept ? 'bg-blue-500' : 'bg-gray-400'
                          }`}></div>
                          <div>
                            <h3 className={`font-medium ${
                              selectedDepartment === dept ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {dept}
                            </h3>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Menu className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Subjects Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Subjects {selectedDepartment && <span className="text-sm font-normal text-gray-500 ml-1">({selectedDepartment})</span>}
                  </h3>
                  <button 
                    onClick={() => setShowAddSubjectModal(true)}
                    disabled={!selectedDepartment}
                    className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {!selectedDepartment ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Select a department to view subjects</p>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Loading subjects...</span>
                  </div>
                ) : subjects.length > 0 ? (
                  <div className="space-y-2">
                    {subjects.slice(0, 5).map((subject, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{subject}</span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Menu className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {subjects.length > 5 && (
                      <p className="text-xs text-gray-500 text-center pt-2">
                        +{subjects.length - 5} more subjects
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No subjects available for {selectedDepartment}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Add New Department</h3>
              <button 
                onClick={() => setShowAddDeptModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department name"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDepartment()}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddDepartment}
                  disabled={!newDepartmentName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Department
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Add New Subject</h3>
              <button 
                onClick={() => setShowAddSubjectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name for {selectedDepartment}
                </label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject name"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSubject}
                  disabled={!newSubjectName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Subject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;