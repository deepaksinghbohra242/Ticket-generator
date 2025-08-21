import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ticketAPI } from "../../api/ticketAPI";
import { adminAPI } from "../../api/adminAPI";

function NewTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { user, departments } = useAuth();

  const [formData, setFormData] = useState({
    subject: "",
    detailedMessage: "",
    department: "",
    priority: "MEDIUM",
    status: "OPEN",
    assignedTo: "",
    ccEmployeeIds: "", // Comma-separated string of employee IDs
    attachmentLink: "",
  });

  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]); // For CC dropdown
  const [subjects, setSubjects] = useState([]);
  const [selectedCCEmployees, setSelectedCCEmployees] = useState([]); // For managing selected CC employees
  const [ccSearchTerm, setCCSearchTerm] = useState(""); // For searching CC employees
  const [showCCDropdown, setShowCCDropdown] = useState(false); // Control dropdown visibility

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all employees for CC dropdown
      try {
        const response = await fetch("http://localhost:8080/api/employee/tickets/dropdown");
        const allEmps = await response.json();
        setAllEmployees(allEmps);
      } catch (err) {
        console.error("Error fetching all employees:", err);
      }

      if (isEditMode) {
        try {
          const data = await ticketAPI.getUserTicket(id);

          // Parse ccEmployeeIds from comma-separated string to array
          const ccIds = data.ccEmployeeIds ? data.ccEmployeeIds.split(",") : [];
          setSelectedCCEmployees(ccIds);

          setFormData({
            subject: data.subject,
            detailedMessage: data.detailedMessage,
            department: data.department,
            priority: data.priority,
            status: data.status,
            assignedTo: data.assignedTo || "",
            ccEmployeeIds: data.ccEmployeeIds || "",
            attachmentLink: data.attachmentLink || "",
          });

          
          const subs = await ticketAPI.getSubjects(data.department);
          setSubjects(subs);
        } catch (err) {
          console.error("Error fetching ticket:", err);
        }
      }

      if (user.role === "ADMIN") {
        adminAPI.getEmployees().then(setEmployees).catch(console.error);
      }
    };

    fetchData();
  }, [id, isEditMode, user.role]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "department") {
      try {
        const subs = await ticketAPI.getSubjects(value);
        setSubjects(subs);
        setFormData((prev) => ({ ...prev, subject: "" }));
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    }
  };

  const handleCCChange = (employeeId) => {
    let updatedSelection;
    if (selectedCCEmployees.includes(employeeId)) {
      // Remove employee if already selected
      updatedSelection = selectedCCEmployees.filter(id => id !== employeeId);
    } else {
      // Add employee if not selected
      updatedSelection = [...selectedCCEmployees, employeeId];
    }
    
    setSelectedCCEmployees(updatedSelection);
    
    // Update formData with comma-separated string
    setFormData(prev => ({
      ...prev,
      ccEmployeeIds: updatedSelection.join(",")
    }));
  };

  const getSelectedEmployeeNames = () => {
    return selectedCCEmployees
      .map(id => {
        const emp = allEmployees.find(e => e.empId === id);
        return emp ? emp.name : id;
      })
      .join(", ");
  };

  // Filter employees based on search term
  const filteredEmployees = allEmployees.filter(employee =>
    employee.name.toLowerCase().includes(ccSearchTerm.toLowerCase()) ||
    employee.empId.toLowerCase().includes(ccSearchTerm.toLowerCase())
  );

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await ticketAPI.updateTicket(id, formData);
        alert("Ticket updated successfully");
      } else {
        await ticketAPI.addTicket(formData);
        alert("Ticket created successfully");
      }
      navigate("/dashboard/");
    } catch (err) {
      console.error("Ticket submit error:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md border border-gray-200 rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        {isEditMode ? "✏️ Edit Ticket" : "📝 Submit New Ticket"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Department Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            disabled={isEditMode}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
              isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">-- Select Department --</option>

            {/* If edit mode and department not in list, still show it */}
            {isEditMode &&
              formData.department &&
              !departments.includes(formData.department) && (
                <option value={formData.department}>
                  {formData.department}
                </option>
              )}

            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none`}
          >
            <option value="">-- Select Subject --</option>

            {/* If edit mode and subject not in list, still show it */}
            {isEditMode &&
              formData.subject &&
              !subjects.includes(formData.subject) && (
                <option value={formData.subject}>{formData.subject}</option>
              )}

            {subjects.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="detailedMessage"
            rows="4"
            placeholder="Describe the issue..."
            value={formData.detailedMessage}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-400 focus:ring-2 focus:outline-none"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* CC Employees Dropdown with Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CC Employees
          </label>
          <div className="relative">
            {/* Search input with selected employees */}
            <div className="relative">
              <input
                type="text"
                placeholder={selectedCCEmployees.length > 0 
                  ? `${selectedCCEmployees.length} employee(s) selected` 
                  : "Search and select employees to CC..."
                }
                value={ccSearchTerm}
                onChange={(e) => setCCSearchTerm(e.target.value)}
                onFocus={() => setShowCCDropdown(true)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {selectedCCEmployees.length > 0 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {selectedCCEmployees.length}
                  </span>
                </div>
              )}
            </div>
            
            {/* Selected employees tags (below search input) */}
            {selectedCCEmployees.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                {selectedCCEmployees.map(empId => {
                  const employee = allEmployees.find(emp => emp.empId === empId);
                  return (
                    <span
                      key={empId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {employee ? employee.name : empId}
                      <button
                        type="button"
                        onClick={() => handleCCChange(empId)}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            
            {/* Dropdown with filtered employees */}
            {showCCDropdown && (
              <div className="mt-1 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg z-10 absolute w-full">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <label
                      key={employee.empId}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCCEmployees.includes(employee.empId)}
                        onChange={() => handleCCChange(employee.empId)}
                        className="mr-3 text-blue-600 focus:ring-blue-400 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        {employee.name} ({employee.empId})
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No employees found matching "{ccSearchTerm}"
                  </div>
                )}
              </div>
            )}
            
            {/* Close dropdown when clicking outside */}
            {showCCDropdown && (
              <div 
                className="fixed inset-0 z-0" 
                onClick={() => setShowCCDropdown(false)}
              />
            )}
          </div>
        </div>

        {/* Attachment Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachment Link
          </label>
          <input
            type="url"
            name="attachmentLink"
            placeholder="https://drive.google.com/file/d/... or other file link"
            value={formData.attachmentLink}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Provide a link to any supporting documents or files
          </p>
        </div>

        {/* Status (edit only) */}
        {isEditMode && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {isEditMode ? "Update Ticket" : "Submit Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTicket;