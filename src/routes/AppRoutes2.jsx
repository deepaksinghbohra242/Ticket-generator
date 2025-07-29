import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/authentication/Login";
import EmployeeList from "../pages/admin/EmployeeList";
import Tickets from "../pages/admin/Tickets";
import Reports from "../pages/admin/Reports";
import Dashboard from "../components/dashboard/Dashboard";
import AddEmployee from "../pages/admin/AddEmployee";
import DeletedTickets from "../pages/employee/DeletedTickets";
import AssignedTickets from "../pages/employee/AssignedTickets";
import RaisedTickets from "../pages/employee/RaisedTickets";
import NewTicket from "../pages/employee/NewTicket";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
  const user = "admin";

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            user?.role === "admin" ? (
              <Navigate to="tickets" replace />
            ) : (
              <Navigate to="assignedticket" replace />
            )
          }
        />

        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="tickets"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Tickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="employeelist"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="addemployee"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="newticket"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <NewTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="raisedticket"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <RaisedTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="assignedticket"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <AssignedTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="deletedticket"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <DeletedTickets />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
