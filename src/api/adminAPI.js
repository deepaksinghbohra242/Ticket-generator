import { apiClient, API_ENDPOINTS } from "./config";

export const adminAPI = {
  getEmployees: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.EMPLOYEES);
    return response.data;
  },

  addEmployee: async (user) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.ADD, {
      empId: user.empId,
      name: user.name,
      email: user.email,
      department: user.department,
      reportingManager: user.reportingManager,
      role: user.role,
      password: user.password,
    });
    return response.data;
  },

  addSubject: async (subjectData) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.SUBJECT, {
      department: subjectData.department,
      subject: subjectData.subject,
    });
    return response.data;
  },

  getDepartments: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.DEPARTMENTS);
    return response.data;
  },

  addDepartment: async (departmentName) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.ADD_DEPARTMENT, {
      department: departmentName,
    });
    return response.data;
  },

  deleteDepartment: async (departmentName) => {
    const url = API_ENDPOINTS.ADMIN.DELETE_DEPARTMENT.replace(
      "{department}",
      encodeURIComponent(departmentName)
    );
    const response = await apiClient.delete(url);
    return response.data;
  },

  getSubjects: async (department) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ADMIN.SUBJECTS}?department=${encodeURIComponent(department)}`
    );
    return response.data;
  },

  addSubject: async (department, subject) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.ADD_SUBJECT, {
      department,
      subject,
    });
    return response.data;
  },

  editSubject: async (department, oldSubject, newSubject) => {
    const response = await apiClient.put(API_ENDPOINTS.ADMIN.EDIT_SUBJECT, {
      department,
      oldSubject,
      newSubject,
    });
    return response.data;
  },

  deleteSubject: async (department, subject) => {
    const url = API_ENDPOINTS.ADMIN.DELETE_SUBJECT
      .replace("{department}", encodeURIComponent(department))
      .replace("{subject}", encodeURIComponent(subject));
    const response = await apiClient.delete(url);
    return response.data;
  },

  getSuperEmployees: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.SUPER_EMPLOYEES);
    return response.data;
  },

  addSuperSubject : async (department, subject) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.SUPER_ADD_SUBJECT, {
      department,
      subject,
    });
    return response.data;
  },
  
  getEmployeeById : async (empId) => {
    const url = API_ENDPOINTS.ADMIN.EMPLOYEE_BY_ID(empId);
    const response = await apiClient.get(url);
    return response.data;
  },

  updateEmployee : async (empId , user) => {
    const url = API_ENDPOINTS.ADMIN.UPDATE_EMPLOYEE(empId);
    const response = await apiClient.put(url , {
      empId: user.empId,
      name: user.name,
      email: user.email,
      department: user.department,
      reportingManager: user.reportingManager,
      role: user.role,
      password: user.password,
    });
    return response.data;
  },

  getEmployeeNames: async (empIds) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.EMPLOYEE_NAMES, empIds);
    return response.data;
  },
};
