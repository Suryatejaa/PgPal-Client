import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../../services/notificationApis";
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // Fixed import
import { TrashIcon } from "@heroicons/react/24/solid";
import { markAllNotificationsAsRead } from "../../services/notificationApis";
import { useState, useEffect } from "react";
import axiosInstance from "../../../../services/axiosInstance";

const NotificationSection = ({
  open,
  setOpen,
  userId,
  setUnreadCount,
  isTenant,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
  setUnreadCount: (count: number) => void;
  isTenant: boolean;
}) => {
  // Updated parameter types for better type safety
  const [notifications, setNotifications] = useState<
    {
      _id: string;
      isRead: boolean;
      title: string;
      message: string;
      createdAt: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    notification: any | null;
  }>({ open: false, notification: null });
  const [tenantDetails, setTenantDetails] = useState<any>(null);
  const [tenantLoading, setTenantLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    const Tenant = isTenant || false; // Ensure isTenant is a boolean
    const Owner = !isTenant; // Ensure Owner is the opposite of isTenant
    const params = {
      ...(Tenant ? { tenantId: userId, audience: "tenant" } : {}),
      ...(Owner ? { ownerId: userId, audience: "owner" } : {}),
    };
    console.log("Fetching notifications with params:", params);
    try {
      const res = await getNotifications(params);
      console.log(res);
      setNotifications(res.data || []);
      // Calculate unread count and update parent
      const unread = (res.data || []).filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err: any) {
      console.log(err);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
    // eslint-disable-next-line
  }, [open]);

  const handleMarkAllRead = async () => {
    const Tenant = isTenant || false; // Ensure isTenant is a boolean
    const Owner = !isTenant; // Ensure Owner is the opposite of isTenant
    const params = {
      ...(Tenant ? { tenantId: userId, audience: "tenant" } : {}),
      ...(Owner ? { ownerId: userId, audience: "owner" } : {}),
    };
    console.log(params);
    try {
      setLoading(true);
      const res = await markAllNotificationsAsRead(params);
      console.log(res);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
    const res = await markAllNotificationsAsRead(params);
    console.log(res);
    await fetchNotifications();
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    await fetchNotifications();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    await fetchNotifications();
  };

  const handleConfirm = async () => {
    // await deleteNotification(id);
    await fetchNotifications();
  };

  const handleDeleteAll = async () => {
    const Tenant = isTenant || false; // Ensure isTenant is a boolean
    const Owner = !isTenant; // Ensure Owner is the opposite of isTenant
    const params = {
      ...(Tenant ? { tenantId: userId } : {}),
      ...(Owner ? { ownerId: userId } : {}),
    };
    console.log(params);
    try {
      const res = await deleteAllNotifications(params);
      console.log(res);
      await fetchNotifications();
    } catch (error) {
      console.log(error);
      console.error("Error deleting all notifications:", error);
    }
  };

  const handleOpenModal = async (notification: any) => {
    setModal({ open: true, notification });
    setTenantDetails(null);
    if (
      notification.type === "complaint_update" &&
      notification.createdBy &&
      !isTenant // Only for owner
    ) {
      setTenantLoading(true);
      try {
        const res = await fetch(
          `/api/tenant-service/tenants?ppid=${notification.createdBy}`
        );
        const data = await res.json();
        setTenantDetails(data[0]);
      } catch {
        setTenantDetails(null);
      } finally {
        setTenantLoading(false);
      }
    }
  };

  const handleConfirmAttendance = async (title: string, message: string) => {
    console.log(title, message);
    const msg = message.split(" ");
    let meal = msg[msg.length - 1]; // Assuming the last word is the meal type //remove  period at last
    if (meal.endsWith(".")) {
      meal = meal.slice(0, -1); // Remove period if present
    }
    const date = title.split(" ")[title.split(" ").length - 1]; // Assuming the last word is the date

    console.log(meal, date);
    try {
      const response = await axiosInstance.put(
        "http://localhost:4000/api/kitchen-service/meal/attendance",
        JSON.stringify({ meal, date }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      if (!response || response.status !== 200) {
        throw new Error("Failed to confirm attendance");
      }

      console.log("Attendance confirmed successfully");
      await fetchNotifications(); // Refresh notifications after confirmation
    } catch (error) {
      console.error("Error confirming attendance:", error);
    }
  };

  return open ? (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={() => setOpen(false)}
      />
      <div className="relative bg-white w-96 max-w-full h-full shadow-lg p-0 z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 hover:border-none">
          <span className="font-bold text-lg">Notifications</span>
          <div className="flex gap-1">
            <button
              className="flex items-center bg-transparent py-1 px-2 gap-1 text-md text-purple-700 hover:underline"
              onClick={handleMarkAllRead}
              disabled={notifications.every((n) => n.isRead)}
              title="Mark all as read"
            >
              <CheckCircleIcon className="w-4 h-4" />
            </button>
            <button
              className="flex items-center bg-transparent py-1 px-2 gap-1 text-red-600 hover:underline"
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
              title="Delete all"
            >
              <TrashIcon className="w-4 h-4 tex-lg" />
            </button>
            <button
              className="flex items-center gap-1 px-2 py-1 text-sm bg-transparent text-gray-600 hover:underline"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-2 p-3 mb-2 rounded cursor-pointer border ${
                  n.isRead ? "bg-gray-100" : "bg-purple-50 border-purple-200"
                }`}
                onClick={() => handleOpenModal(n)}
              >
                <div className="flex-1">
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-xs text-gray-700">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  {!n.isRead && (
                    <button
                      className="text-green-600 text-xs"
                      title="Mark as read"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(n._id);
                      }}
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="text-red-500 text-xs"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(n._id);
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Modal for full notification */}
        {modal.open && modal.notification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={() => setModal({ open: false, notification: null })}
              >
                ✕
              </button>
              <div className="font-bold text-lg mb-2">
                {modal.notification.title}
              </div>
              <div className="text-gray-700 mb-2">
                {modal.notification.message}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {new Date(modal.notification.createdAt).toLocaleString()}
              </div>
              {modal.notification.type === "complaint_update" && !isTenant && (
                <div className="bg-purple-50 rounded p-2 my-2">
                  <div className="font-semibold text-purple-700 mb-1">
                    Tenant Details:
                  </div>
                  {tenantLoading ? (
                    <div className="text-xs text-gray-500">Loading...</div>
                  ) : tenantDetails ? (
                    <div className="text-xs text-gray-700">
                      <div>
                        <span className="font-semibold">Name:</span>{" "}
                        {tenantDetails.name}
                      </div>
                      <div>
                        <span className="font-semibold">Phone:</span>{" "}
                        {tenantDetails.phone}
                      </div>
                      <div>
                        <span className="font-semibold">Room:</span>{" "}
                        {tenantDetails.currentStay?.roomPpid}
                      </div>
                      <div>
                        <span className="font-semibold">Bed:</span>{" "}
                        {tenantDetails.currentStay?.bedId}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      No tenant info found.
                    </div>
                  )}
                </div>
              )}
              {modal.notification.type === "meal-attendance-reminder" && (
                <button
                  className="bg-green-600 text-white px-3 py-1 mr-1 rounded"
                  onClick={() => {
                    handleConfirmAttendance(
                      modal.notification.title,
                      modal.notification.message
                    );
                    setModal({ open: false, notification: null });
                  }}
                >
                  Confirm
                </button>
              )}
              {!modal.notification.isRead && (
                <button
                  className="bg-purple-600 text-white px-3 py-1 rounded"
                  onClick={() => {
                    handleMarkRead(modal.notification._id);
                    setModal({ open: false, notification: null });
                  }}
                  disabled={modal.notification.isRead}
                >
                  Mark as Read
                </button>
              )}              
              <button
                className="bg-red-600 text-white px-3 py-1 ml-1 rounded"
                onClick={() => {
                  handleDelete(modal.notification._id);
                  setModal({ open: false, notification: null });
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default NotificationSection;
