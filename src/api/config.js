import axios from "axios";

export const API_CONFIG = {
  BASE_URL: "http://localhost:8080/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/";
    } else if (error.response?.status === 403) {
      console.error("Access forbidden");
    } else if (error.response?.status >= 500) {
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    VERIFY_TOKEN: "/auth/me",
  },
  ADMIN:{
    EMPLOYEES: "/admin/get_employees",
    ADD: "/admin/add_employees",
    SUBJECT: "/admin/tickets/add_subjects",
    DEPARTMENTS: "/employee/tickets/departments",
    SUBJECTS: "/employee/tickets/get_subjects",
    EDIT_SUBJECT: "/admin/edit-subject",
    DELETE_SUBJECT: "/admin/{department}/subjects/{subject}",
    ADD_DEPARTMENT: "/superadmin/add_department",
    DELETE_DEPARTMENT: "/superadmin/{department}",
    SUPER_EMPLOYEES: "/superadmin/employees",
    ADD_SUBJECT: `/admin/tickets/add_subjects`,
    SUPER_ADD_SUBJECT : '/superadmin/add_subjects',
    EMPLOYEE_BY_ID: (empId) => `/employeeticket/${empId}`,
    UPDATE_EMPLOYEE: (empId) => `/admin/edit/${empId}`,
    EMPLOYEE_NAMES: "/employeeticket/names",
  },
  TICKET:{
    LIST:"/superadmin/tickets",
    GETUSERS:"/employee/tickets/department-tickets",
    RAISED:"/employee/tickets/raised",
    CLOSED:"/employee/tickets/closed",
    ASSIGNED:"/employee/tickets/assigned",
    FIXED:(id) => `/employee/tickets/assigned/${id}/fix`,
    REOPEN:(id) => `/employee/tickets/reopen/${id}`,
    ADD:"/employee/tickets/submit",
    SUBJECT:(id) => `/employee/tickets/get_subjects?department=${id}`,
    GET:(id) => `/admin/tickets/${id}`,
    GETUSER:(id) => `/employee/tickets/${id}`,
    UPDATE:(id , key) => `/admin/tickets/${id}/assignee?assignee=${key}`,
    CLOSEDID:(id)=>`/admin/tickets/close/${id}`,
    ASSIGNETOME: (id)=>`/employee/tickets/assign-to-me/${id}`,
    UPDATETICKETASIGNNE: (id , eid)=> `/admin/tickets/${id}/assignee?assignee=${eid}`,
    COMMENT: (id) => `/chat/${id}`,
    SENDCOMMENT: (id) => `/tickets/${id}/messages`,
    CC : "/employee/tickets/cc-tickets",
    UPDATESTATUS: (id , status) => `employee/tickets/${id}/close/${status}`
  }
};