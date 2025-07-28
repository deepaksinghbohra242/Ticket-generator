import { Routes, Route, Navigate } from "react-router-dom";
import Login from '../components/authentication/Login';
import EmployeeList from '../pages/admin/EmployeeList';
import Tickets from '../pages/admin/Tickets';
import Reports from '../pages/admin/Reports';
import Dashboard from '../components/dashboard/Dashboard';
import AddEmployee from '../pages/admin/AddEmployee';
import DeletedTickets from '../pages/employee/DeletedTickets';
import AssignedTickets from "../pages/employee/AssignedTickets";
import RaisedTickets from "../pages/employee/RaisedTickets";
import NewTicket from "../pages/employee/NewTicket";

function AppRoutes() {
  const user = "user";
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/dashboard/" element={<Dashboard />}>
        <Route index element={<Navigate to={user=="admin" ? "tickets" : "assignedticket"} replace />} />
        <Route path="reports" element={<Reports />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="employeelist" element={<EmployeeList />} />
        <Route path="addemployee" element={<AddEmployee />} />  
        <Route path="newticket" element={<NewTicket />} />  
        <Route path="raisedticket" element={<RaisedTickets />} />  
        <Route path="assignedticket" element={<AssignedTickets />} />  
        <Route path="deletedticket" element={<DeletedTickets />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
