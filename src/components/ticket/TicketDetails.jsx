import React, { useEffect, useState } from "react";
import { User, Calendar, Clock, Paperclip, ExternalLink } from "lucide-react";
import { adminAPI } from "../../api/adminAPI";

const priorityColors = {
  HIGH: "border-red-500 text-red-600 bg-red-50",
  MEDIUM: "border-yellow-500 text-yellow-600 bg-yellow-50",
  LOW: "border-green-500 text-green-600 bg-green-50",
};

const statusColors = {
  OPEN: "border-blue-500 text-blue-600 bg-blue-50",
  ASSIGNED: "border-purple-500 text-purple-600 bg-purple-50",
  IN_PROGRESS: "border-yellow-500 text-yellow-600 bg-yellow-50",
  RESOLVED: "border-green-500 text-green-600 bg-green-50",
  CLOSED: "border-gray-500 text-gray-600 bg-gray-50",
  FIXED: "border-green-500 text-green-600 bg-green-50",
};

function TicketDetails({ ticket }) {
  const [employeeName, setEmployeeName] = useState(ticket.employeeName || "");
  const [ccEmployeeNames, setCcEmployeeNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Updated ccEmployeeNames:", ccEmployeeNames);
  }, [ccEmployeeNames]);

  useEffect(() => {
    const fetchEmployeeNames = async () => {
      try {
        setIsLoading(true);
        let mainEmpId = null;
        let ccIds = [];
        if (ticket.empId) {
          mainEmpId = ticket.empId.toString();
        }
        if (ticket.ccEmployeeIds) {
          if (typeof ticket.ccEmployeeIds === "string") {
            ccIds = ticket.ccEmployeeIds
              .split(",")
              .map((id) => id.trim())
              .filter((id) => id);
          } else if (Array.isArray(ticket.ccEmployeeIds)) {
            ccIds = ticket.ccEmployeeIds.map(id => id.toString().trim()).filter((id) => id);
          }
        }
        if (ccIds.length > 0) {
          try {
            const ccRes = await adminAPI.getEmployeeNames(ccIds);
            
            if (ccRes.data && Array.isArray(ccRes.data)) {
              setCcEmployeeNames(ccRes.data);
            } else if (ccRes && Array.isArray(ccRes)) {
              setCcEmployeeNames(ccRes);
            } else {
              setCcEmployeeNames([]);
            }
          } catch (ccError) {
            setCcEmployeeNames([]);
          }
        } else {
          setCcEmployeeNames([]);
        }

        // Then fetch main employee name if we have it
        if (mainEmpId) {
          try {
            const mainRes = await adminAPI.getEmployeeNames([mainEmpId]);
            
            if (mainRes.data && Array.isArray(mainRes.data) && mainRes.data.length > 0) {
              setEmployeeName(mainRes.data[0]);
            } else if (mainRes && Array.isArray(mainRes) && mainRes.length > 0) {
              setEmployeeName(mainRes[0]);
            } else {
              setEmployeeName(mainEmpId);
            }
          } catch (mainError) {
            setEmployeeName(mainEmpId);
          }
        }

      } catch (error) {
        setEmployeeName(ticket.empId || "N/A");
        setCcEmployeeNames([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (ticket && (ticket.empId || ticket.ccEmployeeIds)) {
      fetchEmployeeNames();
    }
  }, [ticket.empId, ticket.ccEmployeeIds]); 

  const getFileNameFromUrl = (url) => {
    if (!url) return "";
    try {
      if (url.includes("drive.google.com")) return "Google Drive File";
      const fileName = url.split("/").pop().split("?")[0];
      return fileName || "Attachment";
    } catch {
      return "Attachment";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {ticket.subject || "No Subject"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {ticket.priority && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                priorityColors[ticket.priority] || priorityColors.MEDIUM
              }`}
            >
              {ticket.priority}
            </span>
          )}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              statusColors[ticket.status] || statusColors.OPEN
            }`}
          >
            {ticket.status?.replace("_", " ") || "Open"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">Employee:</span>
          <span className="font-medium">
            {isLoading ? "Loading..." : (employeeName || ticket.empId || "N/A")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">Department:</span>
          <span className="font-medium">{ticket.department || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">Created:</span>
          <span className="font-medium">
            {ticket.createdAt
              ? new Date(ticket.createdAt).toLocaleString()
              : "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">Assigned to:</span>
          <span className="font-medium">{ticket.assignee || "Unassigned"}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          CC'd Employees
        </h3>
        <div className="flex flex-wrap gap-2">
          {isLoading ? (
            <span className="text-gray-500">Loading CC employees...</span>
          ) : ccEmployeeNames.length > 0 ? (
            ccEmployeeNames.map((ccName, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
              >
                {ccName}
              </span>
            ))
          ) : (
            <span className="text-gray-500">
              No CC'd employees
              {ticket.ccEmployeeIds ? ` (Raw: ${ticket.ccEmployeeIds})` : ""}
            </span>
          )}
        </div>
      </div>

      {ticket.attachmentLink && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            Attachments
          </h3>
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <a
              href={ticket.attachmentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="font-medium">
                {getFileNameFromUrl(ticket.attachmentLink)}
              </span>
            </a>
            <p className="text-xs text-gray-500 mt-1">
              Click to open attachment in new tab
            </p>
          </div>
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-800 mb-3">Description</h3>
        <p className="text-gray-600 leading-relaxed">
          {ticket.detailedMessage || "No description provided"}
        </p>
      </div>
    </div>
  );
}

export default TicketDetails;