import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { getUserDetails } from "../services/adminService";

// Development mode - should match UserManagement.tsx
const DEVELOPMENT_MODE = false;

// Mock detailed user data
const mockUserDetails: { [key: string]: UserDetails } = {
  "1": {
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
    updatedAt: "2024-06-10T15:45:00Z",
    lastLogin: "2024-06-10T15:45:00Z",
    currentPlan: "Premium",
    subscriptionStatus: {
      status: "active",
      startDate: "2024-01-15T10:30:00Z",
      endDate: "2025-01-15T10:30:00Z",
    },
    properties: [
      { _id: "prop1", name: "Downtown Apartment", roomCount: 5 },
      { _id: "prop2", name: "Suburban House", roomCount: 8 },
    ],
    loginHistory: [
      { date: "2024-06-10T15:45:00Z", ip: "192.168.1.1" },
      { date: "2024-06-09T09:30:00Z", ip: "192.168.1.1" },
    ],
  },
  "2": {
    _id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    phoneNumber: "+1234567891",
    role: "tenant",
    isVerified: true,
    isActive: true,
    isSuspended: false,
    pgpalId: "PGP002",
    createdAt: "2024-02-20T14:15:00Z",
    updatedAt: "2024-06-11T09:30:00Z",
    lastLogin: "2024-06-11T09:30:00Z",
    currentStay: {
      property: "Downtown Apartment",
      room: "Room 3A",
      checkIn: "2024-02-20T14:15:00Z",
      monthlyRent: 800,
    },
    loginHistory: [
      { date: "2024-06-11T09:30:00Z", ip: "192.168.1.2" },
      { date: "2024-06-10T18:20:00Z", ip: "192.168.1.2" },
    ],
  },
  "3": {
    _id: "3",
    username: "admin_user",
    email: "admin@pgpaal.com",
    phoneNumber: "+1234567892",
    role: "admin",
    isVerified: true,
    isSuspended: false,
    isActive: true,
    pgpalId: "PGP003",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-11T12:00:00Z",
    lastLogin: "2024-06-11T12:00:00Z",
    loginHistory: [
      { date: "2024-06-11T12:00:00Z", ip: "192.168.1.10" },
      { date: "2024-06-10T12:00:00Z", ip: "192.168.1.10" },
    ],
  },
};

interface UserDetailsModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface UserDetails {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: "owner" | "tenant" | "admin";
  isVerified: boolean;
  isSuspended: boolean;
  isActive: boolean;
  pgpalId: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  currentPlan?: string;
  subscriptionStatus?: {
    status: string;
    startDate?: string;
    endDate?: string;
  };
  properties?: any[];
  currentStay?: any;
  loginHistory?: any[];
  paymentHistory?: any[];
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId && isOpen) {
      fetchUserDetails();
    }
  }, [userId, isOpen]);
  const fetchUserDetails = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      if (DEVELOPMENT_MODE) {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockUser = mockUserDetails[userId];
        if (mockUser) {
          setUser(mockUser);
        } else {
          setError("User not found");
        }
      } else {
        const response = await getUserDetails(userId);
        // console.log(response);
        setUser(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "owner":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "tenant":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                User Details
              </h3>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {user && !loading && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {user.username}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ID: {user.pgpalId}
                      </p>
                      <div className="flex items-center mt-2">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                        <div className="ml-3 flex items-center">
                          {user.isVerified ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          )}
                          <span className="ml-1 text-sm text-gray-600">
                            {user.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                        <div className="ml-3 flex items-center">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              !user.isSuspended ? "bg-green-400" : "bg-red-400"
                            }`}
                          />
                          <span className="ml-1 text-sm text-gray-600">
                            {user.isSuspended ? "Suspended" : "Active"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500">Email</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.phoneNumber}
                        </p>
                        <p className="text-xs text-gray-500">Phone</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(user.createdAt)}
                        </p>
                        <p className="text-xs text-gray-500">Joined</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.lastLogin
                            ? formatDate(user.lastLogin)
                            : "Never"}
                        </p>
                        <p className="text-xs text-gray-500">Last Login</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Information */}
                {user.currentPlan && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <CreditCardIcon className="h-5 w-5 mr-2" />
                      Subscription Details
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.currentPlan}
                        </p>
                        <p className="text-xs text-gray-500">Current Plan</p>
                      </div>
                      {user.subscriptionStatus && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.subscriptionStatus.status}
                            </p>
                            <p className="text-xs text-gray-500">Status</p>
                          </div>
                          {user.subscriptionStatus.endDate && (
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(user.subscriptionStatus.endDate)}
                              </p>
                              <p className="text-xs text-gray-500">Expires</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Properties/Stay Information */}
                {user.role === "owner" &&
                  user.properties &&
                  user.properties.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-6">
                      <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <HomeIcon className="h-5 w-5 mr-2" />
                        Properties ({user.properties.length})
                      </h5>
                      <div className="space-y-2">
                        {user.properties
                          .slice(0, 3)
                          .map((property: any, index: number) => (
                            <div
                              key={index}
                              className="bg-white rounded p-3 border"
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {property.name || property.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {property.location?.address || property.address}
                              </p>
                            </div>
                          ))}
                        {user.properties.length > 3 && (
                          <p className="text-sm text-gray-500">
                            ...and {user.properties.length - 3} more properties
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {user.role === "tenant" && user.currentStay && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <HomeIcon className="h-5 w-5 mr-2" />
                      Current Stay
                    </h5>
                    <div className="bg-white rounded p-3 border">
                      <p className="text-sm font-medium text-gray-900">
                        {user.currentStay.propertyName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Room: {user.currentStay.roomId} | Bed:{" "}
                        {user.currentStay.bedId}
                      </p>
                      <p className="text-xs text-gray-500">
                        Check-in: {formatDate(user.currentStay.checkInDate)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Login History */}
                {user.loginHistory && user.loginHistory.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h5 className="text-lg font-medium text-gray-900 mb-4">
                      Recent Login History
                    </h5>
                    <div className="space-y-2">
                      {user.loginHistory
                        .slice(0, 5)
                        .map((login: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b last:border-b-0"
                          >
                            <div>
                              <p className="text-sm text-gray-900">
                                {formatDate(login.timestamp)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {login.ipAddress}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                login.success
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {login.success ? "Success" : "Failed"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
