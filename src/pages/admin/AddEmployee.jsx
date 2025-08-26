import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAPI } from "../../api/adminAPI";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2, AlertCircle, CheckCircle, X } from "lucide-react";

function AddEmployee() {
  const { empId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(empId);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    email: "",
    department: user?.department || "",
    reportingManager: user?.empId || "",
    role: "EMPLOYEE",
    ...(isEditMode ? {} : { password: "" })
  });

  const [state, setState] = useState({
    isLoading: false,
    isSubmitting: false,
    error: null,
    success: null,
    initialLoading: isEditMode,
  });

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (isEditMode && empId) {
      const fetchEmployee = async () => {
        try {
          updateState({ initialLoading: true, error: null });
          
          const data = await adminAPI.getEmployeeById(empId);
          
          if (data) {
            setFormData({
              empId: data.empId,
              name: data.name || "",
              email: data.email || "",
              department: data.department || "",
              reportingManager: data.reportingManager || "",
              role: data.role || "EMPLOYEE",
            });
          } else {
            updateState({ 
              error: "Employee not found",
              initialLoading: false 
            });
          }
        } catch (error) {
          updateState({ 
            error: error.response?.status === 404 
              ? "Employee not found" 
              : "Failed to load employee data",
            initialLoading: false 
          });
        } finally {
          updateState({ initialLoading: false });
        }
      };

      fetchEmployee();
    }
  }, [empId, isEditMode, updateState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (state.error) {
      updateState({ error: null });
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.empId.trim()) {
      errors.push("Employee ID is required");
    }

    if (!formData.name.trim()) {
      errors.push("Full name is required");
    }

    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!isEditMode) {
      if (!formData.password?.trim()) {
        errors.push("Password is required");
      } else if (formData.password.length < 6) {
        errors.push("Password must be at least 6 characters long");
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      updateState({ error: validationErrors.join(", ") });
      return;
    }

    try {
      updateState({ 
        isSubmitting: true, 
        error: null, 
        success: null 
      });

      const submitData = { ...formData };

      if (isEditMode) {
        delete submitData.password;
        await adminAPI.updateEmployee(empId, submitData);
        updateState({ 
          success: "Employee updated successfully! Redirecting...",
          isSubmitting: false 
        });
      } else {
        await adminAPI.addEmployee(submitData);
        updateState({ 
          success: "Employee added successfully! Redirecting...",
          isSubmitting: false 
        });
      }

      setTimeout(() => {
        navigate("/dashboard/employees");
      }, 1500);

    } catch (error) {
      
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'add'} employee`;
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Invalid data provided";
      } else if (error.response?.status === 409) {
        errorMessage = "Employee ID or email already exists";
      } else if (error.response?.status === 404 && isEditMode) {
        errorMessage = "Employee not found";
      }
      
      updateState({ 
        error: errorMessage,
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

  if (state.initialLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-5">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading employee data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-5 bg-white shadow-md rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
        👤 {isEditMode ? "Edit" : "Add"} Employee
        {isEditMode && (
          <span className="block text-sm font-normal text-gray-600 mt-1">
            ID: {empId}
          </span>
        )}
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
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Employee ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="empId"
            placeholder="Enter Employee ID"
            value={formData.empId}
            onChange={handleChange}
            disabled={isEditMode || state.isSubmitting}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
              isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${state.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            required
          />
          {isEditMode && (
            <p className="text-xs text-gray-500 mt-1">
              Employee ID cannot be changed
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter employee name"
            value={formData.name}
            onChange={handleChange}
            disabled={state.isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@company.com"
            value={formData.email}
            onChange={handleChange}
            disabled={state.isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
        </div>

        {!isEditMode && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password (min 6 characters)"
              value={formData.password || ""}
              onChange={handleChange}
              disabled={state.isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              required
              minLength={6}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Department
          </label>
          <input
            type="text"
            name="department"
            placeholder="Enter department"
            value={formData.department}
            onChange={handleChange}
            disabled={state.isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Reporting Manager ID
          </label>
          <input
            type="text"
            name="reportingManager"
            placeholder="Enter reporting manager ID"
            value={formData.reportingManager}
            onChange={handleChange}
            disabled={state.isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={state.isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={state.isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {state.isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditMode ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                {isEditMode ? "Update" : "Add"} Employee
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;