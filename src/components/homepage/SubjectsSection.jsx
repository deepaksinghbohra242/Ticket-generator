import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Menu, Trash2, Edit2, Loader2 } from "lucide-react";
import { adminAPI } from '../../api/adminAPI';
import { useAuth } from '../../contexts/AuthContext';

const SubjectsSection = ({ selectedDepartment }) => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingSubject, setEditingSubject] = useState(null);
  const [editedSubjectName, setEditedSubjectName] = useState('');

  useEffect(() => {
    if (selectedDepartment) {
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [selectedDepartment]);

  const fetchSubjects = async () => {
    if (!selectedDepartment) return;
    
    try {
      setLoading(true);
      const data = await adminAPI.getSubjects(selectedDepartment);
      setSubjects(data);
    } catch (error) {
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim() || !selectedDepartment) return;
    
    try {
      if(!isSuperAdmin){
        await adminAPI.addSubject(selectedDepartment, newSubjectName.trim());
      }else{
        await adminAPI.addSuperSubject(selectedDepartment , newSubjectName.trim());  
      }
      setNewSubjectName('');
      setShowAddModal(false);
      fetchSubjects(); 
    } catch (error) {
      alert("Failed to add subject. Please try again.");
    }
  };

  const handleEditSubject = async () => {
    if (!editedSubjectName.trim() || !editingSubject) return;
    
    try {
      await adminAPI.editSubject(
        selectedDepartment, 
        editingSubject, 
        editedSubjectName.trim()
      );
      setEditingSubject(null);
      setEditedSubjectName('');
      setShowEditModal(false);
      fetchSubjects(); 
    } catch (error) {
      alert("Failed to edit subject. Please try again.");
    }
  };

  const handleDeleteSubject = async (subject) => {
    if (!window.confirm(`Are you sure you want to delete the "${subject}" subject?`)) {
      return;
    }

    try {
      await adminAPI.deleteSubject(selectedDepartment, subject);
      fetchSubjects(); 
    } catch (error) {
      alert("Failed to delete subject. Please try again.");
    }
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setEditedSubjectName(subject);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingSubject(null);
    setEditedSubjectName('');
    setShowEditModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Subjects {selectedDepartment && <span className="text-sm font-normal text-gray-500 ml-1">({selectedDepartment})</span>}
            </h3>
            {(isAdmin || isSuperAdmin) && (
              <button 
                onClick={() => setShowAddModal(true)}
                disabled={!selectedDepartment}
                className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </button>
            )}
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
              {subjects.slice(0, 8).map((subject, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-700 flex-1">{subject}</span>
                  <div className="flex items-center space-x-1 ml-2">
                    {(isAdmin || isSuperAdmin) && (
                      <>
                        <button 
                          onClick={() => openEditModal(subject)}
                          className="text-gray-400 hover:text-blue-600 p-1 rounded"
                          title="Edit Subject"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSubject(subject)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                      <Menu className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {subjects.length > 8 && (
                <p className="text-xs text-gray-500 text-center pt-2">
                  +{subjects.length - 8} more subjects
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-2">No subjects available for {selectedDepartment}</p>
              {(isAdmin || isSuperAdmin) && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add your first subject
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Add New Subject</h3>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setNewSubjectName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
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
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSubjectName('');
                  }}
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

      {/* Edit Subject Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Edit Subject</h3>
              <button 
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name for {selectedDepartment}
                </label>
                <input
                  type="text"
                  value={editedSubjectName}
                  onChange={(e) => setEditedSubjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new subject name"
                  onKeyPress={(e) => e.key === 'Enter' && handleEditSubject()}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditSubject}
                  disabled={!editedSubjectName.trim() || editedSubjectName === editingSubject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubjectsSection;