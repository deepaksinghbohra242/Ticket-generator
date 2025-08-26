// HomePage.jsx - Refactored with components
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StatsDashboard from "./StatsDashboard";
import DepartmentsSection from "./DepartmentsSection";
import SubjectsSection from "./SubjectsSection";

function HomePage() {
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const adminDepartment = user?.department || null;

  useEffect(() => {
    if (isAdmin && adminDepartment) {
      setSelectedDepartment(adminDepartment);
    }
  }, [isAdmin, adminDepartment]);

  useEffect(() => {
    if (isSuperAdmin) {
      setSelectedDepartment(null);
    }
  }, [isSuperAdmin]);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <StatsDashboard user={user} />

        {(isAdmin || isSuperAdmin) && (
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
