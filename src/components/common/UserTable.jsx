import React from 'react';
import { User, Trash2, Edit3 } from 'lucide-react';

function UserTable({ employees = [] }) {
  const userHeaders = ["CompanyId", "Name", "Email", "Department", "Role", "Joining Date", "Actions"];

  return (
    <div className="mb-12">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Employee List</h2>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded" />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                {userHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap font-semibold text-indigo-600">
                    {emp.id.toString().padStart(6, '0')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-800">{emp.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">{emp.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">{emp.department}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">{emp.role}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    {new Date(emp.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex gap-3">
                      <button className="text-blue-600 hover:text-blue-800 transition" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={userHeaders.length} className="px-4 py-4 text-center text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserTable;
