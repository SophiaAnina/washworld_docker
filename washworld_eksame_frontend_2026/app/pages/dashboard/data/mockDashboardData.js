const mockDashboardData = {
  user: {
    firstName: "Filip",
    membershipTier: "Medlemskab: Premium",
    points: 120,
  },
  notifications: {
    unreadCount: 2,
  },
  activeBooking: {
    serviceName: "Premium vask",
    locationName: "WashWorld Aarhus C",
    scheduledAt: "I dag kl. 16:30",
    status: "Bekræftet",
  },
  quickActions: [
    { id: "book", label: "Book vask", icon: "🚗", targetRoute: "/pages/booking" },
    { id: "membership", label: "Medlemskab", icon: "⭐", targetRoute: "/pages/membership" },
    { id: "locations", label: "Lokationer", icon: "📍", targetRoute: "/pages/locations" },
    { id: "history", label: "Historik", icon: "🧾", targetRoute: "/pages/history" },
  ],
  recentActivity: [
    { id: "1", title: "Udvending vask", date: "10 maj", amount: "99 kr", status: "Afsluttet" },
    { id: "2", title: "Premium vask", date: "07 maj", amount: "149 kr", status: "Afsluttet" },
  ],
};

export default mockDashboardData;
