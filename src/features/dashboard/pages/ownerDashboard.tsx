import React from "react";
import OwnerProperties from "../../property/pages/OwnerProperties";
import OwnerProfileSidebar from "../components/OwnerProfileSidebar";
import NotificationSection from "../../notifications/components/sections/NotificationSection";
import GlobalAlert from "../../../components/GlobalAlert";
import OwnerDashboardTopBar from "../components/OwnerDashboardTopBar";
import useOwnerProfile from "../components/useOwnerProfile";
import useOwnerNotifications from "../components/useOwnerNotifications";

type OwnerDashboardProps = {
  userId: string;
  userName: string;
  userRole: string;
  userPpid: string;
};

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ userId, userName, userRole, userPpid }) => {
  const profileProps = useOwnerProfile();
  const notificationProps = useOwnerNotifications(userId, userPpid, userRole);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    profileProps.fetchProfile();
  }, []);

  // console.log(userId, userName, userRole, userPpid);
  // console.log(userRole === "owner");
  return (
    <div className="min-h-screen bg-purple-100 text-purple-800">
      {notificationProps.alert && (
        <GlobalAlert
          {...notificationProps.alert}
          onClose={() => notificationProps.setAlert(null)}
        />
      )}
      <OwnerDashboardTopBar
        unreadCount={notificationProps.unreadCount}
        setNotificationOpen={notificationProps.setNotificationOpen}
        profile={profileProps.profile}
        userName={userName}
        setSidebarOpen={setSidebarOpen}
      />
      <NotificationSection
        open={notificationProps.notificationOpen}
        setOpen={notificationProps.setNotificationOpen}
        userId={userPpid}
        setUnreadCount={notificationProps.setUnreadCount}
        isTenant={userRole === "tenant"}
      />
      <OwnerProfileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        {...profileProps}
      />
      <div className="pt-12 w-full">
        <div className="text-gradient-to-br from-purple-600 to-indigo-700 bg-white-100 shadow-lg p-2">
          <OwnerProperties
            userId={userId}
            userName={userName}
            userRole={userRole}
            userPpid={userPpid}
          />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
