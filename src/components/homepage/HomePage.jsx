// HomePage.jsx - Refactored with components
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StatsDashboard from "./StatsDashboard";
import DepartmentsSection from "./DepartmentsSection";
import SubjectsSection from "./SubjectsSection";

function HomePage() {
  const { user, isSuperAdmin, isDepartmentAdmin  , isAdmin} = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const adminDepartment = user?.department || null;

  useEffect(() => {
    if (isDepartmentAdmin && !isSuperAdmin && adminDepartment) {
      setSelectedDepartment(adminDepartment);
    } else if (isSuperAdmin) {
      setSelectedDepartment(null);
    }
  }, [isDepartmentAdmin, isSuperAdmin, adminDepartment]);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <StatsDashboard 
          user={user} 
          selectedDepartment={selectedDepartment} 
        />

        {(isAdmin) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {isSuperAdmin && (
              <div className="lg:col-span-2">
                <DepartmentsSection
                  selectedDepartment={selectedDepartment}
                  onDepartmentSelect={handleDepartmentSelect}
                />
              </div>
            )}

            <div className="space-y-6">
              <SubjectsSection selectedDepartment={selectedDepartment} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;