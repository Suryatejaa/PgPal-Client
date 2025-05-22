import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../services/notificationApis";
import { CheckCircleIcon } from "@heroicons/react/24/outline"; // Add this import at the top
import { XMarkIcon } from "@heroicons/react/24/outline"; // Add this import at the top
import { markAllNotificationsAsRead } from "../../services/notificationApis";

const NotificationSection = ({
  open,
  setOpen,
  userId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    notification: any | null;
  }>({ open: false, notification: null });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications(userId);
      setNotifications(res.data || []);
    } catch {
      setNotifications([]);
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
    const res = await markAllNotificationsAsRead(userId);
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

  return open ? (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={() => setOpen(false)}
      />
      <div className="relative bg-white w-96 max-w-full h-full shadow-lg p-0 z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="font-bold text-lg">Notifications</span>
          <button
            className="text-xs text-purple-700 mt-1 bg-transparent hover:border-none"
            onClick={handleMarkAllRead}
            disabled={notifications.every((n) => n.isRead)}
          >
            <CheckCircleIcon className="h-5 w-5 mr-10" />
          </button>
          <button
            className="absolute top-1 right-2 bg-transparent text-gray-500 text-lg"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
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
                onClick={() => setModal({ open: true, notification: n })}
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
                    🗑
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
                className="bg-red-600 text-white px-3 py-1 rounded"
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
