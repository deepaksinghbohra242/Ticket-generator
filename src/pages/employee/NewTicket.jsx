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
  });

  const [employees, setEmployees] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      const fetchTicket = async () => {
        try {
          const data = await ticketAPI.getTicket(id);
          setFormData({
            subject: data.subject,
            detailedMessage: data.detailedMessage,
            department: data.department,
            priority: data.priority,
            status: data.status,
            assignedTo: data.assignedTo || "",
          });

          // fetch subjects for the department
          const subs = await ticketAPI.getSubjectsByDepartment(data.department);
          setSubjects(subs);
        } catch (err) {
          console.error("Error fetching ticket:", err);
        }
      };
      fetchTicket();
    }

    if (user.role === "ADMIN") {
      adminAPI.getEmployees().then(setEmployees).catch(console.error);
    }
  }, [id, isEditMode, user.role]);

  // 🔄 Update formData
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Fetch subjects when department changes
    if (name === "department") {
      try {
        const subs = await ticketAPI.getSubjects(value);
        setSubjects(subs);
        setFormData((prev) => ({ ...prev, subject: "" })); // reset subject
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    }
  };

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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">-- Select Department --</option>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">-- Select Subject --</option>
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
