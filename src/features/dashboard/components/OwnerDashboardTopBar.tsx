import { BellIcon } from "@heroicons/react/24/outline";

type OwnerDashboardTopBarProps = {
  unreadCount: number;
  setNotificationOpen: (open: boolean) => void;
  profile: { profile: any, role: string };
  userName: string;
  setSidebarOpen: (open: boolean) => void;
};

const OwnerDashboardTopBar = ({
  unreadCount,
  setNotificationOpen,
  profile,
  userName,
  setSidebarOpen,
}: OwnerDashboardTopBarProps) =>{
  const role = profile?.role || "Tenant";

  return (
    <div className="fixed top-0 left-0 w-full text-white bg-purple-700 z-10 px-3 py-3 shadow flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        Purple PG<span className="text-sm"> ({role})</span>
      </h1>
      <div className="flex items-center">
        <div className="relative">
          <BellIcon
            className="w-7 h-7 -mr-1 cursor-pointer text-white hover:text-yellow-300"
          onClick={() => setNotificationOpen(true)}
          title="Notifications"
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
      <button
        className="-mr-4 flex items-center bg-transparent rounded-full  h-9 focus:outline-none hover:focus:outline-none border-none"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open profile"
      >
        <span className="inline-block w-9 h-9 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-sm">
          {profile?.username?.[0] || userName?.[0] || "P"}
        </span>
      </button>
    </div>
  </div>
  );
}

export default OwnerDashboardTopBar;
