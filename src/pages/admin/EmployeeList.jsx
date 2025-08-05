import { useState } from "react";
import UserTable from "../../components/common/UserTable";

function EmployeeList() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      department: "IT",
      role: "Senior Developer",
      joinDate: "2023-01-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      department: "HR",
      role: "HR Manager",
      joinDate: "2022-08-20",
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      department: "Finance",
      role: "Financial Analyst",
      joinDate: "2023-05-10",
      status: "Active",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      department: "Marketing",
      role: "Marketing Specialist",
      joinDate: "2023-03-08",
      status: "On Leave",
    },
  ]);

  return <UserTable employees={employees} />;
}

export default EmployeeList;