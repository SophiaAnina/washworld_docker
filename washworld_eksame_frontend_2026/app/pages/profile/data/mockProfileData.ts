// Define the type for a menu item
export interface MenuItem {
  id: string;
  label: string;
  route: string;
}

// Define the type for profile data
export interface ProfileData {
  menuItems: MenuItem[];
}

const profileData: ProfileData = {
  menuItems: [
    { id: "membership", label: "Mit Medlemskab", route: "/pages/membership/details" },
    { id: "history", label: "Vaske historik", route: "/pages/history" },
    { id: "details", label: "Mine oplysninger", route: "/pages/details" },
    { id: "logout", label: "Log ud", route: "/" },
    { id: "delete-account", label: "Slet konto", route: "" }, //delete profile
  ],
};

export default profileData;
