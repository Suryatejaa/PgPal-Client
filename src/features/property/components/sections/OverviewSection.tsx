import React, { use, useEffect, useState } from "react";
import PropertyOverview from "../../../dashboard/components/PropertyOverview";
import axiosInstance from "../../../../services/axiosInstance";
import PropertyStats from "./StatsComponent";
import AmenitiesSection from "./AmenitiesSection";
import RulesSection from "./RulesSection";
import ReviewsSection from "./ReviewsSection";
import ApprovalSection from "./ApprovalSection";
import GlobalAlert from "../../../../components/GlobalAlert";

const OVERVIEW_TABS = [
  { key: "stats", label: "Stats" },
  { key: "amenities", label: "Amenities" },
  { key: "rules", label: "Rules" },
  { key: "reviews", label: "Reviews" },
  { key: "approvals", label: "Approvals" },
];

const OverviewSection = ({
  property,
  userId,
  userName,
  userRole,
  isOwner,
  requestedUsers,
  loading = false,
  approvals,
  count,
  selectTab,
  setSelectTab,
  onApprovalAction,
}: {
  property: any;
  userId: string;
  userName: string;
  userRole: string;
  isOwner: boolean;
  requestedUsers: any[];
  loading?: boolean;
  approvals: any[];
  count: number;
  selectTab?: string;
  setSelectTab?: (tab: string) => void;
  onApprovalAction?: () => void;
}) => {
  const [localApprovals, setLocalApprovals] = useState(approvals);
  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);

  useEffect(() => {
    setLocalApprovals(approvals);
  }, [approvals]);

  const [localCount, setLocalCount] = useState(count);
  useEffect(() => {
    setLocalCount(count);
  }, [count]);

  const handleAction = async (
    approvalId: string,
    action: "approve" | "reject"
  ) => {
    try {
      await axiosInstance.post(
        `/tenant-service/vacates/${approvalId}/${action}`
      );
      setLocalApprovals((prev) => prev.filter((a) => a._id !== approvalId));
      setLocalCount((prev) => prev - 1);
      if (onApprovalAction) {
        onApprovalAction();
      }
      setAlert({
        message: `Request ${
          action === "approve" ? "approved" : "rejected"
        } successfully.`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        message: "Error handling approval action.",
        type: "error",
      });
      console.error("Error handling approval action:", error);
    }
  };

  return (
    <div className="relative">
      {/* Sticky filter bar */}
      {alert && (
        <GlobalAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div
        className="sticky z-20 flex overflow-x-auto text-sm -mt-1 pb-1 bg-purple-300 border-gray-200"
        style={{ top: 140 }} // Adjust as needed for your header height
      >
        {OVERVIEW_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectTab && setSelectTab(tab.key)}
            className={`px-3 py-2 whitespace-nowrap font-semibold transition focus:outline-none
              ${
                selectTab === tab.key
                  ? "bg-transparent text-black rounded-t-md rounded-b-none border-none"
                  : "bg-transparent text-indigo-700 hover:text-purple-700 border-none"
              }`}
          >
            {tab.label}
            {tab.key === "approvals" && localCount > 0 && (
              <span className="ml-1 text-xs text-red-600">({localCount})</span>
            )}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="pt-2">
        {selectTab === "stats" && (
          <>
            <PropertyOverview pgpalId={property.pgpalId} id={property._id} />
            <PropertyStats pgpalId={property.pgpalId} />
            <div className="flex flex-col items-center w-full">
              <div className="bg-white rounded-xl shadow p-4 text-gray-800 w-full max-w-6xl mt-4">
                <div className="text-center">
                  <strong>Contact:</strong> {property.contact?.phone} |{" "}
                  {property.contact?.email}
                </div>
              </div>
            </div>
          </>
        )}
        {selectTab === "amenities" && (
          <AmenitiesSection propertyId={property._id} />
        )}
        {selectTab === "rules" && (
          <RulesSection
            propertyId={property._id}
            isOwner={isOwner}
            userId={userId}
          />
        )}
        {selectTab === "reviews" && (
          <ReviewsSection
            propertyId={property._id}
            userId={userId}
            userName={userName}
            userRole={userRole}
            isOwner={isOwner}
          />
        )}
        {selectTab === "approvals" && (
          <ApprovalSection
            propertyId={property.pgpalId}
            userId={userId}
            userName={userName}
            userRole={userRole}
            isOwner={isOwner}
            handleAction={handleAction}
            requestedUsers={requestedUsers}
            approvals={localApprovals}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default OverviewSection;
