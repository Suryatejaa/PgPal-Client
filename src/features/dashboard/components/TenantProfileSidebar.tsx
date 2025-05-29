import React from "react";
import ConfirmDialog from "../../../components/ConfirmDialog";

const TenantProfileSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  profile,
  handleLogout,
  showLogoutConfirm,
  setShowLogoutConfirm,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  profile: any;
  handleLogout: () => void;
  showLogoutConfirm: boolean;
  setShowLogoutConfirm: (open: boolean) => void;
}) => {
  return (
    sidebarOpen && (
      <div className="fixed inset-0 z-[9999] flex justify-end">
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative bg-white w-72 max-w-full h-full shadow-lg p-6 z-40 flex flex-col items-center">
          <button
            className="absolute top-2 right-2 text-sm bg-transparent text-gray-500"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-700 mb-2 mt-6">
            {profile?.username?.[0] || "T"}
          </div>
          <div className="font-bold text-lg text-purple-800 mb-2">
            {profile?.username}
          </div>
          <div className="text-gray-600 flex flex-col items-center w-full mb-2">
            <span>{profile?.email}</span>
            <span>{profile?.phoneNumber}</span>
          </div>
          <div className="text-gray-600 flex flex-col items-start w-full mt-1 border-2 rounded-xl p-2 border-purple-700">
            <div className="text-gray-600 capitalize">
              <b>Role:</b> {profile?.role}
            </div>
            <div className="text-gray-600">
              <b>PGPal ID:</b> {profile?.pgpalId}
            </div>
          </div>
          <button
            className="px-2 py-1 mt-4 text-red-600 w-full rounded-lg border-2 bg-transparent border-red-600 hover:bg-red-600 hover:border-red-600 hover:text-white"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Logout
          </button>
          <ConfirmDialog
            open={showLogoutConfirm}
            title="Logout"
            message="Are you sure you want to logout."
            onConfirm={() => {
              setShowLogoutConfirm(false);
              handleLogout();
            }}
            onCancel={() => setShowLogoutConfirm(false)}
            confirmText="Logout"
            cancelText="Cancel"
          />
        </div>
      </div>
    )
  );
};

export default TenantProfileSidebar;
