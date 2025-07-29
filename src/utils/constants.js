const mockTickets = {
  assigned: [
    {
      id: "#12345",
      status: "Open",
      department: "IT",
      description: "System crash on login - users unable to access portal",
      createdAt: "2025-07-27",
      createdBy: "John Doe",
      priority: "High"
    },
    {
      id: "#12348",
      status: "In Progress", 
      department: "IT",
      description: "Network connectivity issues in building A",
      createdAt: "2025-07-26",
      createdBy: "Jane Smith",
      priority: "Medium"
    },
    {
      id: "#12349",
      status: "Open",
      department: "Security",
      description: "Access card not working for conference room",
      createdAt: "2025-07-25",
      createdBy: "Mike Johnson",
      priority: "Low"
    }
  ],
  deleted: [
    {
      id: "#12346",
      status: "Closed",
      department: "HR",
      description: "Access revoked issue - resolved via policy update",
      deletedOn: "2025-07-25",
      deletedBy: "Admin"
    },
    {
      id: "#12350",
      status: "Closed",
      department: "Finance",
      description: "Duplicate expense report submission",
      deletedOn: "2025-07-24",
      deletedBy: "Finance Manager"
    }
  ],
  raised: [
    {
      id: "#12347",
      status: "Open",
      department: "Finance",
      description: "Payroll calculation error for overtime hours",
      createdAt: "2025-07-24",
      assignee: "Finance Team",
      priority: "High"
    },
    {
      id: "#12351",
      status: "Pending",
      department: "Facilities",
      description: "Air conditioning not working in office 2B",
      createdAt: "2025-07-23",
      assignee: "Maintenance Team",
      priority: "Medium"
    }
  ]
};

