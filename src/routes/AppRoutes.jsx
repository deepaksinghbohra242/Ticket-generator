import { Routes, Route, Navigate } from "react-router-dom";
import Login from '../components/authentication/Login';
import EmployeeList from '../pages/admin/EmployeeList';
import Tickets from '../pages/admin/Tickets';
import Dashboard from '../components/dashboard/Dashboard';
import AddEmployee from '../pages/admin/AddEmployee';
import AssignedTickets from "../pages/employee/AssignedTickets";
import RaisedTickets from "../pages/employee/RaisedTickets";
import NewTicket from "../pages/employee/NewTicket";
import HomePage from "../components/dashboard/HomePage";
import ClosedTickets from "../pages/employee/ClosedTickets";

function AppRoutes() {
  const user = "admin";
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard/" element={<Dashboard />}>
        <Route index element={<Navigate to="homepage" replace />} />
        <Route path="homepage" element={<HomePage />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="employeelist" element={<EmployeeList />} />
        <Route path="addemployee" element={<AddEmployee />} />  
        <Route path="newticket" element={<NewTicket />} />  
        <Route path="raisedticket" element={<RaisedTickets />} />  
        <Route path="assignedticket" element={<AssignedTickets />} />  
        <Route path="closedticket" element={<ClosedTickets />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
