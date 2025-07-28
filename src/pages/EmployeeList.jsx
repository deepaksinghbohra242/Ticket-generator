import { useState } from "react";
import { FaSearch } from "react-icons/fa";

function EmployeeList() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      department: "IT",
      role: "Developer",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      department: "HR",
      role: "Manager",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
  });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.department.trim() ||
      !formData.role.trim()
    ) {
      return alert("Please fill in all fields.");
    }

    const newEmployee = {
      id: employees.length + 1,
      ...formData,
    };

    setEmployees([...employees, newEmployee]);
    setFormData({ name: "", email: "", department: "", role: "" });
  };

  const filteredEmployees = employees.filter((emp) =>
    Object.values(emp)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">      
      {/* 🔍 Search */}
      <form
        className="flex items-center max-w-xl mx-auto mb-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search employees ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Search
        </button>
      </form>

      <div className="flex justify-end"><button className="bg-green-600 p-2 rounded-xl mb-1"> + Add employee</button></div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-700 bg-white">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{emp.id}</td>
                  <td className="px-6 py-4">{emp.name}</td>
                  <td className="px-6 py-4">{emp.email}</td>
                  <td className="px-6 py-4">{emp.department}</td>
                  <td className="px-6 py-4">{emp.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center px-6 py-6 text-gray-500"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;
