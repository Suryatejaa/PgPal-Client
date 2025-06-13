import React, { useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  NoSymbolIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

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
  subscriptionStatus?: {
    status: string;
    endDate?: string;
  };
  isSuspended: boolean;
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  onViewUser: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onSuspendUser: (userId: string) => void;
  onActivateUser: (userId: string) => void;
  onBulkAction: (action: string, userIds: string[]) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onSuspendUser,
  onActivateUser,
  onBulkAction,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const isSuspended = (user: User) => user.isSuspended;

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "owner":
        return "bg-blue-100 text-blue-800";
      case "tenant":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return "bg-red-100 text-red-800";
    if (!isVerified) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // console.log(users)

  const getStatusText = (isSuspended: boolean, isVerified: boolean) => {
    //   console.log(isSuspended)
    if (isSuspended) return "Suspended";
    if (!isVerified) return "Unverified";
    return "Active";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="bg-purple-50 px-6 py-3 border-b border-purple-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-700">
              {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onBulkAction("verify", selectedUsers)}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Verify
              </button>
              <button
                onClick={() => onBulkAction("suspend", selectedUsers)}
                className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Suspend
              </button>
              <button
                onClick={() => onBulkAction("unsuspend", selectedUsers)}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Activate
              </button>
              <button
                onClick={() => onBulkAction("delete", selectedUsers)}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>{" "}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          {user.phoneNumber}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {user.pgpalId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          user.isSuspended,
                          user.isVerified
                        )}`}
                      >
                        {getStatusText(user.isSuspended, user.isVerified)}
                      </span>
                      {user.isVerified && (
                        <CheckCircleIcon className="h-4 w-4 text-green-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.currentPlan || "Free"}
                    {user.subscriptionStatus?.status && (
                      <div className="text-xs text-gray-500">
                        {user.subscriptionStatus.status}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewUser(user._id)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditUser(user._id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Edit User"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {isSuspended(user) ? (
                        <button
                          onClick={() => onActivateUser(user._id)}
                          className="text-green-600 hover:text-yellow-900 p-1 rounded"
                          title="Activate User"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onSuspendUser(user._id)}
                          className="text-yellow-600 hover:text-green-900 p-1 rounded"
                          title="Suspend User"
                        >
                          <NoSymbolIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete User"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>{" "}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  {users === undefined ? "Loading users..." : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {users && users.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No users found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
