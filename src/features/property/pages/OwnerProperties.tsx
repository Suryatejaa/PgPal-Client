import React, { useEffect, useState, useRef } from "react";
import {
  getOwnProperties,
  addProperty,
  updateProperty,
} from "../services/propertyService";
import PropertyForm from "../components/PropertyForm";
import Modal from "../components/Modal";
import { PlusIcon } from "@heroicons/react/24/solid";
import PropertyCard from "../components/PropertyCard";
import OverviewSection from "../components/sections/OverviewSection";
import AddressSection from "../components/sections/AddressSection";
import RoomsSection from "../../room/components/sections/RoomSection";
import TenantsSection from "../../tenant/components/sections/TenantSection";
import KitchenSection from "../../kitchen/components/sections/KitchenSection";
import ComplaintsSection from "../../complaints/components/sections/ComplaintsSection";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import GlobalAlert from "../../../components/GlobalAlert"; // adjust path as needed
import axiosInstance from "../../../services/axiosInstance";
import { useVacateRealtimeSync } from "../../../app/useNotificationSocket";
import useSubscriptionLimits from "../../../app/useSubscriptionLimits";

const SECTION_LIST = [
  { key: "overview", label: "Overview" },
  { key: "rooms", label: "Rooms" },
  { key: "tenants", label: "Tenants" },
  { key: "kitchen", label: "Kitchen" },
  { key: "complaints", label: "Complaints" },
  { key: "address", label: "Address" },
];

const OwnerProperties: React.FC<{
  userId: string;
  userName: string;
  userRole: string;
  userPpid: string;
  userPlan?: string;
  isTrialClaimed?: boolean; // Optional, if needed for trial-specific features
}> = ({ userId, userName, userRole, userPpid, isTrialClaimed }) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(() => {
    const stored = sessionStorage.getItem("selectedProperty");
    return stored ? JSON.parse(stored) : null;
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedSection, setSelectedSection] = useState(
    () => sessionStorage.getItem("selectedSection") || "overview"
  );
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);
  const [requestedUsers, setRequestedUsers] = useState<string[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectTab, setSelectTab] = useState(
    () => sessionStorage.getItem("selectTab") || "stats"
  );
  const { canAddProperty, getLimitMessage, currentPlan, isUnlimited, limits } =
    useSubscriptionLimits();

  const handleApprovalAction = () => {
    fetchApprovals(); // re-fetch approvals after an action
  };

  // //console.log("limits:", limits.maxProperties === -1);

  useEffect(() => {
    sessionStorage.setItem("selectTab", selectTab);
  }, [selectTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/tenant-service/vacateHistory/${selectedProperty?.pgpalId}` || ""
      );
      //console.log(selectedProperty?.pgpalId);
      const reqsForApprovals = res.data.vacateHistory.filter(
        (req: any) => req.status === "pending_owner_approval"
      );
      //console.log(reqsForApprovals[0]?.previousSnapshot);
      const requestedUserIds = reqsForApprovals.map((req: any) => req.tenantId);
      //console.log(requestedUserIds.length);
      setRequestedUsers(requestedUserIds || []);
      //console.log("Updated requestedUsers", requestedUserIds);
      setCount(reqsForApprovals.length || 0);
      setApprovals(reqsForApprovals || []);
    } catch (err: any) {
      //console.log(err);
      if (err?.response?.data?.error === "No vacate history found") {
        setCount(0);
      }
      const msg = err?.response?.data?.error;
      if (msg === "No vacate history found") {
        // Don't show alert, just set approvals/requestedUsers to empty
        setApprovals([]);
        setRequestedUsers([]);
        // Optionally: return here so you don't show an alert
        return;
      }
      // For other errors, show alert
      setAlert({
        message: msg || err?.message || "Failed to fetch vacate history.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [selectedProperty]);

  useVacateRealtimeSync(fetchApprovals, userId, userRole);

  const handleDeleteProperty = async (propertyId: string) => {
    //console.log(propertyId);
    try {
      const res = await axiosInstance.delete(`/property-service/${propertyId}`);
      setAlert({
        message: res.data.message || "Property deleted successfully!",
        type: "success",
      });
      // Re-fetch properties after deletion
      await fetchProperties();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message;
      setAlert({
        message: msg || "Failed to delete property.",
        type: "error",
      });
    }
  };

  const fetchProperties = async () => {
    const res = await getOwnProperties();
    setProperties(res.data);
    // Try to restore selected property from session storage
    const stored = sessionStorage.getItem("selectedProperty");
    if (stored) {
      const storedObj = JSON.parse(stored);
      const match = res.data.find((p: any) => p._id === storedObj._id);
      setSelectedProperty(match || res.data[0] || null);
    } else if (res.data.length > 0) {
      setSelectedProperty(res.data[0]);
    } else {
      setSelectedProperty(null);
    }
  };

  const handleCardClick = (property: any) => {
    //console.log(property.ownerId);
    //console.log(userId);
    setSelectedProperty(property);
    sessionStorage.setItem("selectedProperty", JSON.stringify(property));
    setShowForm(false);
  };
  // Handle property card click (just select, don't open form)
  const handleAddCardClick = () => {
    if (!canAddProperty(properties.length)) {
      setAlert({
        message: getLimitMessage("property"),
        type: "error",
      });
      return;
    }
    setShowForm(true);
    setSelectedProperty(null);
  };

  useEffect(() => {
    // Save selected section to session storage
    sessionStorage.setItem("selectedSection", selectedSection);
  }, [selectedSection]);

  // Handle form submit
  const handleFormSubmit = async (data: any) => {
    //console.log(data);
    await addProperty(data);
    setShowForm(false);
    await fetchProperties();
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
  };

  // If no properties, show only the add card or the form
  if (!properties || properties.length === 0) {
    return (
      <div>
        <div className="flex items-center space-x-4 mt-2 ">
          {!showForm ? (
            <button
              onClick={handleAddCardClick}
              className="flex flex-col items-center justify-center w-56 h-40 bg-white/80 rounded-xl shadow-lg border-2 border-dashed border-purple-400 hover:bg-purple-50 transition"
            >
              <PlusIcon className="h-10 w-10 text-purple-600 mb-2" />
              <span className="text-lg font-semibold text-purple-700">
                Add Property
              </span>
            </button>
          ) : null}

          {showForm && (
            <Modal onClose={handleFormCancel}>
              <div className="sticky top-0 z-10 bg-white flex items-center justify-between">
                <h3 className="text-2xl text-purple-700 font-bold">
                  Add New Property
                </h3>
                <button
                  onClick={handleFormCancel}
                  className="text-gray-500 hover:text-gray-700 text-2xl bg-transparent border-none cursor-pointer"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <PropertyForm
                initial={null}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </Modal>
          )}
        </div>
        <div className="flex items-center justify-center w-full h-40 text-purple-600 font-bold animate-pulse">
          <span className="text-lg">No Properties Found</span>
        </div>
      </div>
    );
  }

  // If properties exist, show cards and add card
  return (
    <div>
      {alert && (
        <GlobalAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <h2 className="text-2xl font-bold mb-2 ms-2 mt-2">Your PGs:</h2>
      <div className="flex space-x-4 rounded-xl overflow-x-auto">
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onClick={() => handleCardClick(property)}
            isSelected={selectedProperty?._id === property._id}
          />
        ))}
        <button
          onClick={handleAddCardClick}
          disabled={!canAddProperty(properties.length)}
          className={`min-w-[220px] w-56 h-40 rounded-xl mt-1 -ml-1 shadow-lg border-2 border-dashed flex flex-col items-center justify-center transition ${
            canAddProperty(properties.length)
              ? "bg-white/80 border-purple-400 hover:bg-purple-50"
              : "bg-gray-100 border-gray-300 cursor-not-allowed opacity-50"
          }`}
        >
          <PlusIcon
            className={`h-10 w-10 mb-2 ${
              canAddProperty(properties.length)
                ? "text-purple-600"
                : "text-gray-400"
            }`}
          />
          <span
            className={`text-lg font-semibold ${
              canAddProperty(properties.length)
                ? "text-purple-700"
                : "text-gray-500"
            }`}
          >
            Add Property
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {properties.length}/
            {limits.maxProperties === -1 ? "∞" : limits.maxProperties}
          </span>
        </button>
      </div>
      {showForm && (
        <Modal onClose={handleFormCancel}>
          <div className="sticky top-0 z-10 bg-white flex items-center justify-between">
            <h3 className="text-2xl text-purple-700 font-bold">
              Add New Property
            </h3>
            <button
              onClick={handleFormCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl bg-transparent border-none cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <PropertyForm
            initial={null}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </Modal>
      )}
      {editMode && (
        <Modal onClose={() => setEditMode(false)}>
          <div className="sticky top-0 z-10 bg-white flex items-center justify-between">
            <h3 className="text-2xl text-purple-700 font-bold">
              Edit Property
            </h3>
            <button
              onClick={() => setEditMode(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl bg-transparent border-none cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <PropertyForm
            initial={selectedProperty}
            onSubmit={async (data: any) => {
              await updateProperty(selectedProperty._id, data);
              setEditMode(false);
              setAlert({
                message: "Property updated successfully!",
                type: "success",
              });
              await fetchProperties();
            }}
            onCancel={() => setEditMode(false)}
            mode="edit"
            onDelete={async () => {
              await handleDeleteProperty(selectedProperty._id);
              setEditMode(false);
              fetchProperties();
            }}
          />
        </Modal>
      )}
      {/* Property dashboard/metrics section */}
      {!showForm && selectedProperty && (
        <div className="mt-1 rounded-t-md w-full">
          {/* Section bar */}
          <div
            style={{ height: 1, margin: 0, padding: 0 }}
            ref={stickyRef}
          ></div>
          <div
            className={`sticky z-10 w-full transition-colors duration-500 bg-purple-100 border-t-2 border-purple-700 ${
              isSticky
                ? "from-purple-600 to-indigo-600 rounded-t-none border-none"
                : ""
            }`}
            style={{ top: "60px" }}
          >
            <h3 className="text-xl font-semibold text-purple-900 mb-2 ms-2 flex items-center gap-2">
              {selectedProperty.name} Dashboard
              <button
                className="ml-1 p-1 mt-1 rounded hover:bg-purple-200"
                onClick={() => setEditMode(true)}
                title="Edit Property"
              >
                <PencilSquareIcon className="w-5 h-4 text-purple-700" />
              </button>
            </h3>
            <div className="flex space-x-2 overflow-x-auto">
              {SECTION_LIST.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setSelectedSection(section.key)}
                  className={`px-4 py-2 whitespace-nowrap mt-1 ms-2 font-semibold transition focus:outline-none bg-transparent border-none focus:outline-none focus:border-none 
                    ${
                      selectedSection === section.key
                        ? "!bg-purple-300 text-black rounded-t-md rounded-b-none border-b-2 border-purple-700 focus:outline-none focus:border-none "
                        : "text-purple-900 hover:text-purple-700 rounded-t-md"
                    }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
          {/* Section content */}
          {selectedSection === "overview" && (
            <OverviewSection
              property={selectedProperty}
              userId={userId}
              userName={userName}
              userRole={userRole}
              isOwner={selectedProperty?.ownerId === userId}
              requestedUsers={requestedUsers}
              approvals={approvals}
              count={count}
              loading={loading}
              selectTab={selectTab}
              setSelectTab={setSelectTab}
              onApprovalAction={handleApprovalAction}
              userPlan={currentPlan}
              isTrialClaimed={isTrialClaimed}
            />
          )}
          {selectedSection === "rooms" && (
            <RoomsSection
              property={selectedProperty}
              requestedUsers={requestedUsers}
              goToApprovals={() => {
                setSelectedSection("overview");
                setSelectTab("approvals");
              }}
              fetchProperties={fetchProperties}
            />
          )}
          {selectedSection === "tenants" && (
            <TenantsSection
              property={selectedProperty}
              userId={userId}
              requestedUsers={requestedUsers}
              goToApprovals={() => {
                setSelectedSection("overview");
                setSelectTab("approvals");
              }}
            />
          )}
          {selectedSection === "kitchen" && (
            <KitchenSection property={selectedProperty} />
          )}
          {selectedSection === "complaints" && (
            <ComplaintsSection
              property={selectedProperty}
              isOwner={selectedProperty?.ownerId === userId}
              userPpid={userPpid}
            />
          )}
          {selectedSection === "address" && (
            <AddressSection
              property={selectedProperty}
              isOwner={selectedProperty?.ownerId === userId}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerProperties;
