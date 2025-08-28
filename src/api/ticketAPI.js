import { apiClient, API_ENDPOINTS } from "./config";

export const ticketAPI = {
  getAllTickets: async () => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.LIST);
    return response.data;
  },

  raisedTickets: async () => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.RAISED);
    return response.data;
  },

  closedTickets: async (id , payload) => {
    const response = await apiClient.put(API_ENDPOINTS.TICKET.CLOSEDID(id),payload);
    return response.data;
  },

  assignedTickets: async () => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.ASSIGNED);
    return response.data;
  },

  fixedTicket: async (ticketId, payload) => {
    const response = await apiClient.put(API_ENDPOINTS.TICKET.FIXED(ticketId), payload);
    return response.data;
  },

  reopenTicket: async (ticketId) => {
    const response = await apiClient.put(API_ENDPOINTS.TICKET.REOPEN(ticketId));
    return response.data;
  },

  addTicket: async (ticket) => {
    const response = await apiClient.post(API_ENDPOINTS.TICKET.ADD, {
      subject : ticket.subject,
      department : ticket.department,
      detailedMessage : ticket.detailedMessage,
      priority : ticket.priority,
      ccEmployeeIds : ticket.ccEmployeeIds,
      attachmentLink: ticket.attachmentLink,
    });
    return response.data;
  },

  getSubjects: async (dep) => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.SUBJECT(dep));
    return response.data;
  },

  getTicket: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.GET(id));
    return response.data;
  },

  getUserTickets : async () => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.GETUSERS);
    return response.data;
  },

  getUserTicket : async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.GETUSER(id));
    return response.data;
  },

  closeTicket: async (ticketId) => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.CLOSED);
    return response.data;
  },

  closeAdminTicket: async (ticketId) => {
    const response = await apiClient.put(API_ENDPOINTS.TICKET.CLOSEDID(ticketId));
    return response.data;
  },

  assignToMe: async (id) => {
    const response = await apiClient.put(API_ENDPOINTS.TICKET.ASSIGNETOME(id))
    return response.data;
  },

  updateTicketAssignee: async (ticketId, assigneeEmpId) => {
    const response = await apiClient.put(API_ENDPOINTS.TICKET.UPDATETICKETASIGNNE(ticketId , assigneeEmpId));
    return response.data;
  },

  getCommentForTicket: async (ticketId) => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.COMMENT(ticketId));
    return response.data;
  },

  sendTicket: async (id , message) => {
    const response = await apiClient.post(API_ENDPOINTS.TICKET.SENDCOMMENT(id), {
      message: message,
    });
    return response.data;
  },

  ccTicket: async () => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.CC);
    return response.data;
  },

  updateTicketStatus: async (ticketId, status) => {
    const response = await apiClient.put(API_ENDPOINTS.TICKET.UPDATESTATUS(ticketId , status));
    return response.data;
  },

  updateTicketDetails : async (ticketId, ticket) => {
    const response = await apiClient.put(API_ENDPOINTS.TICKET.UPDATETICKET(ticketId), {
      subject : ticket.subject,
      department : ticket.department,
      detailedMessage : ticket.detailedMessage,
      priority : ticket.priority,
      ccEmployeeIds : ticket.ccEmployeeIds,
      attachmentLink: ticket.attachmentLink,
      status : ticket.status
    });
    return response.data;
  }, 

  dropdownData : async () => {
    const response = await apiClient.get(API_ENDPOINTS.TICKET.DROPDOWN);
    return response.data;
  }
};
