import React, { useState, useEffect } from "react";
import {
  UsersIcon,
  DocumentArrowDownIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import UserTable from "./UserTable";
import UserDetailsModal from "./UserDetailsModal";
import UserFilters from "./UserFilters";
import Pagination from "./Pagination";
import {
  getAllUsers,
  bulkUserOperations,
  deleteUser,
  suspendUser,
  activateUser,
  exportUserData,
  sendBulkNotification,
} from "../services/adminService";

// Development mode - set to true when backend is not available
const DEVELOPMENT_MODE = false;

// Mock data for development
const mockUsers: User[] = [
  {
    _id: "1",
    username: "john_doe",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    role: "owner",
    isVerified: true,
    isActive: true,
    isSuspended: false,
    pgpalId: "PGP001",
    createdAt: "2024-01-15T10:30:00Z",
    lastLogin: "2024-06-10T15:45:00Z",
    currentPlan: "Premium",
  },
  {
    _id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    phoneNumber: "+1234567891",
    role: "tenant",
    isVerified: true,
    isSuspended: false,
    isActive: true,
    pgpalId: "PGP002",
    createdAt: "2024-02-20T14:15:00Z",
    lastLogin: "2024-06-11T09:30:00Z",
  },
  {
    _id: "3",
    username: "admin_user",
    email: "admin@pgpaal.com",
    phoneNumber: "+1234567892",
    role: "admin",
    isSuspended: false,
    isVerified: true,
    isActive: true,
    pgpalId: "PGP003",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-06-11T12:00:00Z",
  },
];

interface User {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: "owner" | "tenant" | "admin";
  isVerified: boolean;
  isActive: boolean;
  pgpalId: string;
  createdAt: string;
  lastLogin?: string;
  currentPlan?: string;
  isSuspended: boolean;
  subscriptionStatus?: {
    status: string;
    endDate?: string;
  };
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Filter states
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isVerified, setIsVerified] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // UI states
  const [showBulkNotification, setShowBulkNotification] = useState(false);
  const [bulkNotificationData, setBulkNotificationData] = useState({
    title: "",
    message: "",
    audience: "all" as "all" | "owners" | "tenants",
  });

  useEffect(() => {
    fetchUsers();
  }, [
    currentPage,
    itemsPerPage,
    search,
    role,
    isVerified,
    isActive,
    sortBy,
    sortOrder,
  ]);
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      if (DEVELOPMENT_MODE) {
        // Mock API response for development
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        let filteredUsers = [...mockUsers];

        // Apply search filter
        if (search) {
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.username.toLowerCase().includes(search.toLowerCase()) ||
              user.email.toLowerCase().includes(search.toLowerCase()) ||
              user.phoneNumber.includes(search)
          );
        }

        // Apply role filter
        if (role) {
          filteredUsers = filteredUsers.filter((user) => user.role === role);
        }

        // Apply verification filter
        if (isVerified) {
          filteredUsers = filteredUsers.filter(
            (user) => user.isVerified === (isVerified === "true")
          );
        }

        // Apply active filter
        if (isActive) {
          filteredUsers = filteredUsers.filter(
            (user) => user.isActive === (isActive === "true")
          );
        }

        // Pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        setUsers(paginatedUsers);
        setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
        setTotalItems(filteredUsers.length);
      } else {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          ...(search && { search }),
          ...(role && { role }),
          ...(isVerified && { isVerified: isVerified === "true" }),
          ...(isActive && { isActive: isActive === "true" }),
          sortBy,
          sortOrder,
        };

        const response = await getAllUsers(params);
        console.log(response.data.data.users);
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
        setTotalItems(response.data.data.totalUsers);
      }
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch users. Please check if the backend server is running."
      );
      // Set empty array to prevent undefined errors
      setUsers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowUserDetails(true);
  };

  const handleEditUser = (userId: string) => {
    // This would open an edit modal - implement as needed
    console.log("Edit user:", userId);
  };
  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      if (DEVELOPMENT_MODE) {
        console.log("Mock delete user:", userId);
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        await deleteUser(userId);
      }
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };
  const handleSuspendUser = async (userId: string) => {
    const reason = window.prompt("Enter reason for suspension (optional):");
    if (reason === null) return; // User cancelled

    try {
      if (DEVELOPMENT_MODE) {
        console.log("Mock suspend user:", userId, "Reason:", reason);
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        const res = await suspendUser(userId, { reason });
        console.log(res);
      }
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to suspend user");
    }
  };

  const handleActivateUser = async (userId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to activate this user? They will regain access to the system."
      )
    ) {
      return;
    }
    try {
      if (DEVELOPMENT_MODE) {
        const res = await activateUser(userId);
        console.log(res);
      } else {
        const res = await activateUser(userId);
        console.log(res);
        fetchUsers(); // Refresh the list
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to activate user");
    }
  };

  const handleBulkAction = async (action: string, userIds: string[]) => {
    let confirmMessage = "";
    switch (action) {
      case "delete":
        confirmMessage = `Are you sure you want to delete ${userIds.length} user(s)? This action cannot be undone.`;
        break;
      case "suspend":
        confirmMessage = `Are you sure you want to suspend ${userIds.length} user(s)?`;
        break;
      case "unsuspend":
        confirmMessage = `Are you sure you want to activate ${userIds.length} user(s)?`;
        break;
      case "verify":
        confirmMessage = `Are you sure you want to verify ${userIds.length} user(s)?`;
        break;
      default:
        return;
    }
    if (!window.confirm(confirmMessage)) return;

    try {
      if (DEVELOPMENT_MODE) {
        // Mock successful operation
        console.log(`Mock ${action} operation on users:`, userIds);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

        // In development, just refresh to show the change worked
        fetchUsers();
      } else {
        const res = await bulkUserOperations({
          operation: action as any,
          userIds,
          ...(action === "suspend" && { reason: "Bulk suspension by admin" }),
        });
        console.log(res);
        fetchUsers(); // Refresh the list
      }
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || `Failed to ${action} users`);
    }
  };
  const handleExportUsers = async () => {
    try {
      if (DEVELOPMENT_MODE) {
        // Mock CSV export for development
        console.log("Mock export users");
        const csvContent =
          "Username,Email,Role,Status\n" +
          mockUsers
            .map(
              (user) =>
                `${user.username},${user.email},${user.role},${
                  user.isActive ? "Active" : "Inactive"
                }`
            )
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `users_export_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const response = await exportUserData({ format: "csv" });
        // Handle file download
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `users_export_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to export users");
    }
  };
  const handleSendBulkNotification = async () => {
    try {
      if (DEVELOPMENT_MODE) {
        console.log("Mock send bulk notification:", bulkNotificationData);
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        await sendBulkNotification(bulkNotificationData);
      }
      setShowBulkNotification(false);
      setBulkNotificationData({ title: "", message: "", audience: "all" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send notification");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setRole("");
    setIsVerified("");
    setIsActive("");
    setCurrentPage(1);
  };
  return (
    <div className="space-y-6">
      {/* Development Mode Notice */}
      {DEVELOPMENT_MODE && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Development Mode
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Currently showing mock data. Change DEVELOPMENT_MODE to false in
                UserManagement.tsx to connect to the real API.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
            <UsersIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-purple-600" />
            User Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage all users in the system
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowBulkNotification(true)}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <BellIcon className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Send Notification</span>
            <span className="sm:hidden">Notify</span>
          </button>
          <button
            onClick={handleExportUsers}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Export Users</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters */}
      <UserFilters
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        isVerified={isVerified}
        onVerifiedChange={setIsVerified}
        isActive={isActive}
        onActiveChange={setIsActive}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onClearFilters={clearFilters}
      />

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading users
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  fetchUsers();
                }}
                className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Table */}
      <UserTable
        users={users}
        loading={loading}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onSuspendUser={handleSuspendUser}
        onBulkAction={handleBulkAction}
        onActivateUser={handleActivateUser}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newItemsPerPage) => {
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={showUserDetails}
        onClose={() => {
          setShowUserDetails(false);
          setSelectedUserId(null);
        }}
      />

      {/* Bulk Notification Modal */}
      {showBulkNotification && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Send Bulk Notification
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Audience
                    </label>
                    <select
                      value={bulkNotificationData.audience}
                      onChange={(e) =>
                        setBulkNotificationData((prev) => ({
                          ...prev,
                          audience: e.target.value as
                            | "all"
                            | "owners"
                            | "tenants",
                        }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="all">All Users</option>
                      <option value="owners">Owners Only</option>
                      <option value="tenants">Tenants Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={bulkNotificationData.title}
                      onChange={(e) =>
                        setBulkNotificationData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Notification title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      value={bulkNotificationData.message}
                      onChange={(e) =>
                        setBulkNotificationData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Notification message"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSendBulkNotification}
                  disabled={
                    !bulkNotificationData.title || !bulkNotificationData.message
                  }
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send Notification
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkNotification(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
