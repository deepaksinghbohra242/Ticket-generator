import React, { useState, useEffect } from 'react';
import { Building2, Plus, Menu, Trash2 } from "lucide-react";
import { adminAPI } from '../../api/adminAPI';
import { useAuth } from '../../contexts/AuthContext';

const DepartmentsSection = ({ selectedDepartment, onDepartmentSelect }) => {
  const { isSuperAdmin, isAdmin } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDepartments();
      setDepartments(data);
      if (!selectedDepartment && data.length > 0) {
        onDepartmentSelect(data[0]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) return;
    
    try {
      await adminAPI.addDepartment(newDepartmentName.trim());
      setNewDepartmentName('');
      setShowAddModal(false);
      fetchDepartments(); 
    } catch (error) {
      alert("Failed to add department. Please try again.");
    }
  };

  const handleDeleteDepartment = async (departmentName) => {
    if (!window.confirm(`Are you sure you want to delete the "${departmentName}" department? This will also delete all subjects in this department.`)) {
      return;
    }

    try {
      await adminAPI.deleteDepartment(departmentName);
      fetchDepartments();
      
      if (selectedDepartment === departmentName) {
        onDepartmentSelect(null);
      }
    } catch (error) {
      alert("Failed to delete department. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Departments
            </h2>
            {isSuperAdmin && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Department
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {departments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No departments found</p>
              {isSuperAdmin && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add your first department
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((dept, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 transition-all ${
                    selectedDepartment === dept 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:shadow-sm hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center flex-1 cursor-pointer"
                      onClick={() => onDepartmentSelect(dept)}
                    >
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        selectedDepartment === dept ? 'bg-blue-500' : 'bg-gray-400'
                      }`}></div>
                      <h3 className={`font-medium ${
                        selectedDepartment === dept ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {dept}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      {isSuperAdmin && (
                        <button 
                          onClick={() => handleDeleteDepartment(dept)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded"
                          title="Delete Department"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                        <Menu className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Add New Department</h3>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setNewDepartmentName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
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
                  onClick={() => {
                    setShowAddModal(false);
                    setNewDepartmentName('');
                  }}
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
    </>
  );
};

export default DepartmentsSection;