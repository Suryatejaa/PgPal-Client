import { useState, useEffect } from "react";
import { getNotifications } from "../../notifications/services/notificationApis";

export default function useOwnerNotifications(userId: string, userPpid: string,userRole: string) {
  const isTenant = userRole === "tenant";
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotificationIds, setLastNotificationIds] = useState<string[]>([]);
  const [alert, setAlert] = useState<{ message: string; type?: "info" | "success" | "error" } | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const fetchUnread = async () => {
      try {
        const res = await getNotifications(
          isTenant
            ? { tenantId: userPpid, audience: "tenant" }
            : { ownerId: userPpid, audience: "owner" }
        );
        // console.log(res.data)
        const notifications = res.data || [];
        const unread = notifications.filter((n: any) => !n.isRead).length;
        setUnreadCount(unread);
        const currentIds = notifications.map((n: any) => n._id);
        if (lastNotificationIds.length > 0 && currentIds[0] && currentIds[0] !== lastNotificationIds[0]) {
          setAlert({ message: "You have a new notification!", type: "info" });
        }
        setLastNotificationIds(currentIds);
      } catch {
        setUnreadCount(0);
      }
    };
    fetchUnread();
    interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [userPpid, lastNotificationIds, userId]);

  return {
    notificationOpen,
    setNotificationOpen,
    unreadCount,
    setUnreadCount,
    alert,
    setAlert,
  };
}