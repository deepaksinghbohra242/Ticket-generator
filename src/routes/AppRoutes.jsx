import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Login from '../components/authentication/Login';
import EmployeeList from '../pages/EmployeeList';
import Tickets from '../pages/Tickets';
import Reports from '../pages/Reports';
import Dashboard from '../components/dashboard/Dashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/dashboard/" element={<Dashboard />}>
        <Route index element={<Navigate to="tickets" replace />} />

        <Route path="reports" element={<Reports />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="employeelist" element={<EmployeeList />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
