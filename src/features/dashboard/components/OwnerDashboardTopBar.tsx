import { BellAlertIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom"; // <-- Add this import

type OwnerDashboardTopBarProps = {
  unreadCount: number;
  setNotificationOpen: (open: boolean) => void;
  profile: { profile: any; role: string };
  userName: string;
  setSidebarOpen: (open: boolean) => void;
  isActive?: boolean; // Optional prop to indicate if the user is active
};

const OwnerDashboardTopBar = ({
  unreadCount,
  setNotificationOpen,
  profile,
  userName,
  setSidebarOpen,
  isActive,
}: OwnerDashboardTopBarProps) => {
  const role = profile?.role || "Tenant";
  const navigate = useNavigate(); // <-- Add this

  // Only show Explore button for active tenant or owner
  const showExplore =
    role?.toLowerCase() === "owner" ||
    (role?.toLowerCase() === "tenant" && isActive);

  // console.log(isActive !== true)

  return (
    <div className="fixed top-0 left-0 w-full text-white bg-purple-700 z-10 px-3 py-3 shadow flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        Purple PG<span className="text-sm"> ({role})</span>
      </h1>
      <div className="flex items-center gap-3">
        {showExplore && (
          <button
            className=" p-0 bg-transparent text-purple-700 hover:border-none transition focus:outline-none rounded-full h-9 w-9 flex items-center justify-center"
            onClick={() => navigate("/explore")}
            title="Explore PGs"
          >
            <span className="text-2xl bg-transparent">🧭</span>
          </button>
        )}
        <div className="relative">
          <BellAlertIcon
            className="w-7 h-7 cursor-pointer text-white hover:text-yellow-300"
            onClick={() => setNotificationOpen(true)}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
        <button
          className="flex items-center bg-transparent rounded-full  h-9 focus:outline-none hover:focus:outline-none border-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open profile"
        >
          <span className="inline-block w-9 h-9 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-xl">
            {profile?.profile?.username?.[0].toUpperCase() || userName?.[0].toUpperCase() || "P"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default OwnerDashboardTopBar;
