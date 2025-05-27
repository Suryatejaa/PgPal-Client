import React, { use, useEffect, useRef, useState } from "react";
import {
  getCurrentStay,
  getNearbyPGs,
} from "../services/tenantDashboardServices";
import NotificationSection from "../../notifications/components/sections/NotificationSection";
import GlobalAlert from "../../../components/GlobalAlert";
import OwnerDashboardTopBar from "../components/OwnerDashboardTopBar";
import useOwnerProfile from "../components/useOwnerProfile";
import useOwnerNotifications from "../components/useOwnerNotifications";
import OwnerProfileSidebar from "../components/OwnerProfileSidebar";
import CurrentStayHeader from "../../tenant/components/sections/CurrentStayHeader";
import StickySectionBar from "../components/sections/StickySectionBar";
import PropertyOverview from "../../property/components/sections/PropertyOverview";
import StayHistory from "../../tenant/components/sections/StayHistory";
import NearbyPGsSection from "../../property/components/sections/NearBySection";
import axiosInstance from "../../../services/axiosInstance";
import TenantLandingPage from "../../tenant/components/sections/TenantLandingPage";

const SECTION_LIST = [
  { key: "overview", label: "Property" },
  { key: "history", label: "Stay History" },
];

type TenantDashboardProps = {
  userId: string;
  userName: string;
  userRole: string;
  userPpid: string;
};

const TenantDashboard: React.FC<TenantDashboardProps> = ({
  userId,
  userName,
  userRole,
  userPpid,
}) => {
  const [currentStay, setCurrentStay] = useState<any>(null);
  const [nearbyPGs, setNearbyPGs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Section state for current stay
  const [selectedSection, setSelectedSection] = useState(
    () => sessionStorage.getItem("tenantSelectedSection") || "overview"
  );
  const [overview, setOverview] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  // Profile and notification hooks (reuse owner logic)
  const profileProps = useOwnerProfile();
  const notificationProps = useOwnerNotifications(userId, userPpid, userRole); // Pass tenant id if available
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rules, setRules] = useState<any>(null);
  const [refreshStayKey, setRefreshStayKey] = useState(0);

  // Fetch current stay and nearby PGs

  const currentStayAndNearByPGs = () => {
    getCurrentStay().then((res) => {
      const stay = res.data?.currentStay;
      setCurrentStay(stay);
      setLoading(false);

      if (!stay) {
        // Get device location for nearby PGs
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              const pgRes = await getNearbyPGs(latitude, longitude);
              setNearbyPGs(pgRes.data || []);
            },
            () => {
              // fallback: Hyderabad
              getNearbyPGs(17.385, 78.4867).then((pgRes) =>
                setNearbyPGs(pgRes.data || [])
              );
            }
          );
        } else {
          getNearbyPGs(17.385, 78.4867).then((pgRes) =>
            setNearbyPGs(pgRes.data || [])
          );
        }
      }
    });
  };

  useEffect(() => {
    sessionStorage.setItem("tenantSelectedSection", selectedSection);
  }, [selectedSection]);

  useEffect(() => {
    currentStayAndNearByPGs();
  }, []);

  useEffect(() => {
    currentStayAndNearByPGs();
  }, [refreshStayKey]);
  // Fetch profile
  useEffect(() => {
    profileProps.fetchProfile();
  }, []);

  // Sticky section bar effect
  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch overview/history when section changes
  useEffect(() => {
    const fetchOverviewOrHistory = async () => {
      if (
        currentStay &&
        selectedSection === "overview" &&
        (currentStay.propertyPpid || currentStay.propertyId)
      ) {
        try {
          const propId = currentStay.propertyId
            ? currentStay.propertyId
            : currentStay.propertyPpid;

          const res = await axiosInstance.get(
            `/property-service/property-ppid/${propId}`
          );
          setOverview(res.data);
        } catch (err) {
          console.log(err);
          setOverview(null);
        }
      }
      if (
        currentStay &&
        selectedSection === "history" &&
        profileProps.profile?.pgpalId
      ) {
        import("../../../services/axiosInstance").then(
          ({ default: axiosInstance }) => {
            axiosInstance
              .get(
                `/tenant-service/tenant-history?ppid=${profileProps.profile.pgpalId}`
              )
              .then((res) => setHistory(res.data))
              .catch(() => setHistory([]));
          }
        );
      }
    };

    fetchOverviewOrHistory();
  }, [selectedSection, currentStay, profileProps.profile?.pgpalId]);

  // console.log(selectedSection, currentStay, profileProps.profile?.pgpalId)

  useEffect(() => {
    if (
      currentStay &&
      selectedSection === "overview" &&
      currentStay.propertyPpid
    ) {
      import("../../../services/axiosInstance").then(
        ({ default: axiosInstance }) => {
          axiosInstance
            .get(`/property-service/${overview._id}/rules`)
            .then((res) => setRules(res.data))
            .catch(() => setRules(null));
        }
      );
    }
  }, [overview, currentStay, selectedSection]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  return (
    <div className="min-h-screen text-purple-900 bg-purple-100 pt-6">
      {/* Top Bar */}
      <OwnerDashboardTopBar
        unreadCount={notificationProps.unreadCount}
        setNotificationOpen={notificationProps.setNotificationOpen}
        profile={profileProps.profile}
        userName={profileProps.profile?.username}
        setSidebarOpen={setSidebarOpen}
        isActive={currentStay?.propertyId || currentStay?.propertyPpid ? true : false}
      />
      {/* Notifications */}
      <NotificationSection
        open={notificationProps.notificationOpen}
        setOpen={notificationProps.setNotificationOpen}
        userId={userPpid}
        setUnreadCount={notificationProps.setUnreadCount}
        isTenant={userRole === "tenant"}
      />
      {/* Profile Sidebar */}
      <OwnerProfileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        {...profileProps}
      />
      {/* Alert */}
      {notificationProps.alert && (
        <GlobalAlert
          {...notificationProps.alert}
          onClose={() => notificationProps.setAlert(null)}
        />
      )}
      {/* Main Content */}
      <div className="pt-10">
        {currentStay && (currentStay.propertyId || currentStay.propertyPpid) ? (
          <>
            <CurrentStayHeader
              stay={currentStay}
              hasCoords={
                currentStay.location?.coordinates?.[1] !== undefined &&
                currentStay.location?.coordinates?.[0] !== undefined &&
                !isNaN(currentStay.location?.coordinates?.[1]) &&
                !isNaN(currentStay.location?.coordinates?.[0])
              }
              lat={currentStay.location?.coordinates?.[1]}
              lng={currentStay.location?.coordinates?.[0]}
              isInNoticePeriod={currentStay.isInNoticePeriod}
              noticePeriodStartDate={currentStay.noticePeriodStartDate}
              noticePeriodEndDate={currentStay.noticePeriodEndDate}
            />

            <StickySectionBar
              sectionList={SECTION_LIST}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              isSticky={isSticky}
            />
            <div className="mt-1">
              {selectedSection === "overview" && overview && (
                <PropertyOverview
                  overview={overview}
                  rules={rules}
                  userId={userId}
                  userPgPalId={profileProps.profile?.pgpalId}
                  onVacateChange={() => setRefreshStayKey((k) => k + 1)}
                />
              )}
              {selectedSection === "history" && (
                <StayHistory history={history} />
              )}
            </div>
          </>
        ) : (
          <TenantLandingPage />
          // <NearbyPGsSection pgs={nearbyPGs} />
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
