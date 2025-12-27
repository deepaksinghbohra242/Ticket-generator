import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { ticketAPI } from "../api/ticketAPI";
import TicketDetails from "../components/ticket/TicketDetails";
import TicketManagement from "../components/ticket/TicketManagement";
import CommentsSection from "../components/ticket/CommentSection";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { adminAPI } from "../api/adminAPI";

function TicketView() {
  const { user, isAdmin } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [departmentUsers, setDepartmentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No ticket ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let ticketData;
        if (isAdmin) {
          ticketData = await ticketAPI.getTicket(id);
        } else {
          ticketData = await ticketAPI.getUserTicket(id);
        }

        if (ticketData) {
          setTicket(ticketData);

          if (ticketData.comments) {
            setComments(ticketData.comments);
          }
        }

        if (isAdmin) {
          try {
            const usersData = await adminAPI.getEmployees();
            setUsers(usersData || []);

            if (ticketData?.department && usersData) {
              const filteredUsers = usersData.filter(
                (user) => user.department === ticketData.department
              );
              setDepartmentUsers(filteredUsers);
            } else {
              setDepartmentUsers(usersData || []);
            }
          } catch (usersError) {
          }
        }
      } catch (error) {
        setError("Failed to load ticket details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAdmin]);

  const updateTicket = (updatedTicket) => {
    setTicket(updatedTicket);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <LoadingSpinner message="Loading ticket details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onGoBack={() => navigate(-1)} />;
  }

  if (!ticket) {
    return (
      <ErrorMessage message="Ticket not found" onGoBack={() => navigate(-1)} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b p-2">
      <div className="mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Ticket #{ticket.ticketNo?.toString().padStart(5, "0") || "N/A"}
          </h1>
        </div>

        <div className={`grid grid-cols-1 xl:grid-cols-3 gap-6`}>
          <div className="xl:col-span-2 space-y-6">
            <TicketDetails ticket={ticket} />
            <CommentsSection
              ticketId={id}
              currentUser={user}
              isAdmin={isAdmin}
              ticketDetails={ticket}
            />
          </div>

            <div className="xl:col-span-1">
              <TicketManagement
                ticket={ticket}
                onUpdateTicket={updateTicket}
                departmentUsers={departmentUsers}
                currentUser={user}
                isAdmin={isAdmin}
                ticketId={id}
              />
            </div>
        </div>
      </div>
    </div>
  );
}

export default TicketView;
