import { useState } from "react";
import { Search, Plus, Mail, Building, User, Briefcase, Edit, Trash2, Eye, Filter } from "lucide-react";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const handleSearch = () => {
    // Search functionality handled by filter below
  };

  const getDepartments = () => {
    const departments = [...new Set(employees.map(emp => emp.department))];
    return ["All", ...departments];
  };

  const getStatusBadge = (status) => {
    const styles = {
      "Active": "bg-green-100 text-green-800 border-green-200",
      "On Leave": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Inactive": "bg-red-100 text-red-800 border-red-200"
    };
    return `px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles["Active"]}`;
  };

  const getDepartmentColor = (department) => {
    const colors = {
      "IT": "bg-blue-100 text-blue-800",
      "HR": "bg-purple-100 text-purple-800",
      "Finance": "bg-green-100 text-green-800",
      "Marketing": "bg-pink-100 text-pink-800",
      "Operations": "bg-orange-100 text-orange-800"
    };
    return colors[department] || "bg-gray-100 text-gray-800";
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = Object.values(emp)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "All" || emp.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSearch} className="flex items-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by ticket number, department, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-l-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-r-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="flex items-center gap-2">
                <Search size={18} />
                Search
              </div>
            </button>
          </form>

        <div className="flex justify-between items-center mb-6">
          
          <button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <Plus size={20} />
            Add Employee
          </button>
        </div>

        {/* Employee Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100/80 to-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200/30">
                    Employee
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200/30">
                    Contact
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200/30">
                    Department
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200/30">
                    Role
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200/30">
                    Join Date
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200/30">
                    Status
                  </th>
                  <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200/30">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-indigo-50/70 transition-all duration-300 group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          
                          <div>
                            <div className="font-bold text-gray-900 text-lg mb-1">{emp.name}</div>
                            <div className="text-gray-500 text-sm font-medium">ID: {emp.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <Mail size={16} className="text-blue-600" />
                          </div>
                          <span className="text-gray-700 font-medium">{emp.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getDepartmentColor(emp.department)}`}>
                          <Building size={14} className="mr-2" />
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg mr-3">
                            <Briefcase size={16} className="text-purple-600" />
                          </div>
                          <span className="text-gray-700 font-semibold">{emp.role}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-600 font-medium bg-gray-50 px-3 py-1 rounded-lg">
                          {emp.joinDate}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={getStatusBadge(emp.status)}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="View Details"
                            className="p-3 text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-110"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            title="Edit Employee"
                            className="p-3 text-green-600 hover:text-white hover:bg-green-600 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-110"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            title="Delete Employee"
                            className="p-3 text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-110"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
                          <User size={36} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">No employees found</h3>
                        <p className="text-gray-500 text-lg">Try adjusting your search terms or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;