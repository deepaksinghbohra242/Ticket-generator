import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserTable from "../../components/common/UserTable";
import { adminAPI } from "../../api/adminAPI";
import { User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        if (isSuperAdmin) {
          const data = await adminAPI.getSuperEmployees();
          setEmployees(data);
        } else {
          const data = await adminAPI.getEmployees();
          setEmployees(data);
        }
      } catch (error) {
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Employee List</h2>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded" />
      </div>

      <div className="mb-4">
        <Link
          to="/dashboard/addemployee"
          className="inline-block px-4 py-2 text-white bg-green-700 rounded hover:bg-green-800 transition"
        >
          Add Employee
        </Link>
      </div>

      <UserTable employees={employees} />
    </div>
  );
}

export default EmployeeList;
