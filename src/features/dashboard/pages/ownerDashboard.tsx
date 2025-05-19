import React from "react";
import OwnerProperties from "../../property/pages/OwnerProperties";

const OwnerDashboard: React.FC<{
  userId: string;
  userName: string;
  userRole: string;
}> = ({ userId, userName, userRole }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("http://localhost:4000/api/auth-service/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []); 

  return (
    <div className="min-h-screen bg-purple-100 text-purple-800">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full text-white bg-purple-700 z-10 px-6 py-1 shadow flex items-center justify-between">
        <h1 className="text-2xl font-bold">👑PGPAL Owner</h1>
        <button
          className="-mr-4 flex items-center bg-transparent rounded-full focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open profile"
        >
          <span className="inline-block w-9 h-9 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-sm">
            {profile?.username?.[0] || userName?.[0] || "P"}
          </span>
        </button>
      </div>
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 flex justify-end">
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative bg-white w-72 max-w-full h-full shadow-lg p-6 z-40">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="flex flex-col items-center mt-6">
              <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-700 mb-2">
                {profile?.username?.[0] || userName?.[0] || "P"}
              </div>
              <div className="font-bold text-lg">
                {profile?.username || userName}
              </div>
              <div className="text-gray-600">{profile?.email}</div>
              <div className="text-gray-600">{profile?.phoneNumber}</div>
              <div className="text-gray-600 capitalize">{profile?.role}</div>
              <div className="text-gray-600">{profile?.pgpalId}</div>
            </div>
          </div>
        </div>
      )}
      <div className="pt-12 w-full">
        <div className="text-gradient-to-br from-purple-600 to-indigo-700 bg-white-100 shadow-lg p-2">
          <OwnerProperties
            userId={userId}
            userName={userName}
            userRole={userRole}
          />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
