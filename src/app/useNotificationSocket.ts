import { useEffect } from "react";
import { getSocket } from "../services/socketInstace"; // Adjust the import path as necessary
import { useAppDispatch } from "./hooks";
// import { addNotification } from "../notificationsSlice"; // Create this action if needed

function useNotificationSocket(userId: string, role: string) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();
    if (userId && role) {
      socket.emit("register", { userId, role }); // Correct event and payload
    }
    interface NotificationData {
        id: string;
        message: string;
        type: string;
        [key: string]: any;
    }

    socket.on("notifications", (data: NotificationData) => {
        // dispatch(addNotification(data)); // Update your redux state here
        // console.log("Received notification:", data);
    });

    return () => {
      socket.off("notification");
    };
  }, [userId, role, dispatch]);
}

function useVacateRealtimeSync(fetchApprovals: () => void, userId: string, role: string) {
  useEffect(() => {
    const socket = getSocket();
    if (userId && role) {
      socket.emit("register", { userId, role });
    }
    socket.on("notifications", () => {
      fetchApprovals(); // Refresh state when event received
    });
    return () => {
      socket.off("notification");
    };
  }, [fetchApprovals, userId, role]);
}

export { useNotificationSocket, useVacateRealtimeSync };