import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ticketAPI } from "../../api/ticketAPI";
import { adminAPI } from "../../api/adminAPI";
import { Loader2, X, CheckCircle, AlertCircle } from "lucide-react";

function NewTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { user, departments } = useAuth();

  const [originalTicketData, setOriginalTicketData] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    detailedMessage: "",
    department: "",
    priority: "MEDIUM",
    status: "OPEN",
    assignedTo: "",
    ccEmployeeIds: "",
    attachmentLink: "",
  });

  const [state, setState] = useState({
    employees: [],
    allEmployees: [],
    subjects: [],
    selectedCCEmployees: [],
    ccSearchTerm: "",
    showCCDropdown: false,
    isSubmitting: false,
    isLoading: true,
    error: null,
    success: null,
  });

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        updateState({ isLoading: true, error: null });

        // Fetch all employees for CC dropdown
        const response = await ticketAPI.dropdownData();
        console.log("Dropdown data response:", response);
        
        const allEmps = response || [];
        updateState({ allEmployees: allEmps });

        if (isEditMode && id) {
          // Fetch the ticket data for editing
          const data = await ticketAPI.getUserTicket(id);
          console.log("Fetched ticket data:", data);
          
          // Store original data for reference
          setOriginalTicketData(data);
          
          const ccIds = data.ccEmployeeIds ? data.ccEmployeeIds.split(",").filter(Boolean) : [];
          
          // Preserve original values or use defaults
          setFormData({
            subject: data.subject || "",
            detailedMessage: data.detailedMessage || "",
            department: data.department || "",
            priority: data.priority || "MEDIUM",
            status: data.status || "OPEN",
            assignedTo: data.assignedTo || "",
            ccEmployeeIds: data.ccEmployeeIds || "",
            attachmentLink: data.attachmentLink || "",
          });

          updateState({ selectedCCEmployees: ccIds });

          // Fetch subjects for the department if it exists
          if (data.department) {
            try {
              const subs = await ticketAPI.getSubjects(data.department);
              updateState({ subjects: subs });
            } catch (err) {
              console.warn("Failed to load subjects for department:", data.department);
              updateState({ subjects: [] });
            }
          }
        }

        // Fetch employees for admin users
        if (user.role === "ADMIN") {
          try {
            const employees = await adminAPI.getEmployees();
            updateState({ employees });
          } catch (err) {
            console.warn("Failed to load employees for admin");
          }
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        updateState({ 
          error: "Failed to load data. Please refresh the page and try again." 
        });
      } finally {
        updateState({ isLoading: false });
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
        updateState({ error: null });
        const subs = await ticketAPI.getSubjects(value);
        updateState({ subjects: subs });
        // Only reset subject if we're not in edit mode
        if (!isEditMode) {
          setFormData((prev) => ({ ...prev, subject: "" }));
        }
      } catch (err) {
        console.error("Error loading subjects:", err);
        updateState({ error: "Failed to load subjects for selected department." });
      }
    }
  };

  const handleCCChange = (employeeId) => {
    let updatedSelection;
    if (state.selectedCCEmployees.includes(employeeId)) {
      updatedSelection = state.selectedCCEmployees.filter((id) => id !== employeeId);
    } else {
      updatedSelection = [...state.selectedCCEmployees, employeeId];
    }

    updateState({ selectedCCEmployees: updatedSelection });

    setFormData((prev) => ({
      ...prev,
      ccEmployeeIds: updatedSelection.join(","),
    }));
  };

  const filteredEmployees = state.allEmployees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(state.ccSearchTerm.toLowerCase()) ||
      employee.empId.toLowerCase().includes(state.ccSearchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.detailedMessage || !formData.department) {
      updateState({ error: "Please fill in all required fields." });
      return;
    }

    try {
      updateState({ 
        isSubmitting: true, 
        error: null, 
        success: null 
      });

      // Prepare submission data
      const submissionData = { ...formData };
      
      // For edit mode, preserve original values for unchanged fields
      if (isEditMode && originalTicketData) {
        // Only send fields that have actually changed or are explicitly set
        Object.keys(submissionData).forEach(key => {
          if (submissionData[key] === "" && originalTicketData[key]) {
            submissionData[key] = originalTicketData[key];
          }
        });
      }

      console.log("Submitting data:", submissionData);

      if (isEditMode && id) {
        await ticketAPI.updateTicketDetails(id, submissionData);
        updateState({ 
          success: "Ticket updated successfully! Redirecting...",
          isSubmitting: false 
        });
      } else {
        await ticketAPI.addTicket(submissionData);
        updateState({ 
          success: "Ticket created successfully! Redirecting...",
          isSubmitting: false 
        });
      }

      setTimeout(() => {
        navigate("/dashboard/raisedticket");
      }, 2000);

    } catch (err) {
      console.error("Error submitting ticket:", err);
      updateState({ 
        error: `Failed to ${isEditMode ? 'update' : 'create'} ticket. Please try again.`,
        isSubmitting: false 
      });
    }
  };

  const dismissMessage = (type) => {
    if (type === 'error') {
      updateState({ error: null });
    } else {
      updateState({ success: null });
    }
  };

  // Loading state
  if (state.isLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading ticket form...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md border border-gray-200 rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        {isEditMode ? "✏️ Edit Ticket" : "📝 Submit New Ticket"}
      </h2>

      {state.success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{state.success}</p>
          </div>
          <button
            onClick={() => dismissMessage('success')}
            className="text-green-500 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {state.error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{state.error}</p>
          </div>
          <button
            onClick={() => dismissMessage('error')}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            disabled={state.isSubmitting}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
              state.isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">-- Select Department --</option>

            {/* Show current department in edit mode even if not in departments list */}
            {isEditMode &&
              formData.department &&
              !departments?.includes(formData.department) && (
                <option value={formData.department}>
                  {formData.department}
                </option>
              )}

            {Array.isArray(departments) &&
              departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            disabled={state.isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Select Subject --</option>

            {/* Show current subject in edit mode even if not in subjects list */}
            {isEditMode &&
              formData.subject &&
              !state.subjects.includes(formData.subject) && (
                <option value={formData.subject}>{formData.subject}</option>
              )}

            {state.subjects.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="detailedMessage"
            rows="4"
            placeholder="Describe the issue..."
            value={formData.detailedMessage}
            onChange={handleChange}
            required
            disabled={state.isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={state.isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-400 focus:ring-2 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CC Employees
          </label>
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder={
                  state.selectedCCEmployees.length > 0
                    ? `${state.selectedCCEmployees.length} employee(s) selected`
                    : "Search and select employees to CC..."
                }
                value={state.ccSearchTerm}
                onChange={(e) => updateState({ ccSearchTerm: e.target.value })}
                onFocus={() => updateState({ showCCDropdown: true })}
                disabled={state.isSubmitting}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {state.selectedCCEmployees.length > 0 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {state.selectedCCEmployees.length}
                  </span>
                </div>
              )}
            </div>

            {state.selectedCCEmployees.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                {state.selectedCCEmployees.map((empId) => {
                  const employee = state.allEmployees.find(
                    (emp) => emp.empId === empId
                  );
                  return (
                    <span
                      key={empId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {employee ? employee.name : empId}
                      <button
                        type="button"
                        onClick={() => handleCCChange(empId)}
                        disabled={state.isSubmitting}
                        className="text-blue-600 hover:text-blue-800 ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {state.showCCDropdown && !state.isSubmitting && (
              <div className="mt-1 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg z-10 absolute w-full">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <label
                      key={employee.empId}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={state.selectedCCEmployees.includes(employee.empId)}
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
                    No employees found matching "{state.ccSearchTerm}"
                  </div>
                )}
              </div>
            )}

            {state.showCCDropdown && (
              <div
                className="fixed inset-0 z-0"
                onClick={() => updateState({ showCCDropdown: false })}
              />
            )}
          </div>
        </div>

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
            disabled={state.isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Provide a link to any supporting documents or files
          </p>
        </div>

        {isEditMode && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={state.isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        )}

        {/* Show assigned to field for admin users in edit mode */}
        {isEditMode && user.role === "ADMIN" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={state.isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">-- Not Assigned --</option>
              {state.employees.map((emp) => (
                <option key={emp.empId} value={emp.empId}>
                  {emp.name} ({emp.empId})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={state.isSubmitting }
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {state.isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditMode ? "Updating..." : "Submitting..."}
              </>
            ) : (
              <>
                {isEditMode ? "Update Ticket" : "Submit Ticket"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTicket;