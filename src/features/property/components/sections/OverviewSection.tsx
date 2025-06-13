import React, { use, useEffect, useState } from "react";
import PropertyOverview from "../../../dashboard/components/PropertyOverview";
import axiosInstance from "../../../../services/axiosInstance";
import PropertyStats from "./StatsComponent";
import AmenitiesSection from "./AmenitiesSection";
import RulesSection from "./RulesSection";
import ReviewsSection from "./ReviewsSection";
import ApprovalSection from "./ApprovalSection";
import GlobalAlert from "../../../../components/GlobalAlert";
import { useNavigate } from "react-router-dom";

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
  userPlan,
  isTrialClaimed
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
  isTrialClaimed?: boolean; // Optional, if needed for trial-specific features
  selectTab?: string;
  setSelectTab?: (tab: string) => void;
  onApprovalAction?: () => void;
  userPlan: string; // Optional, if needed for plan-specific features
}) => {
  const [localApprovals, setLocalApprovals] = useState(approvals);
  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);

  // console.log(count)
  const Navigate = useNavigate();

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
      const res = await axiosInstance.post(
        `/tenant-service/vacates/${approvalId}/${action}`
      );
      console.log(res);
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
            {userPlan === "free" || userPlan === "trial" ? (
              // Locked stats section for free/trial users
              <div className="relative">
                {/* Blurred content preview */}
                <div className="filter blur-md pointer-events-none">
                  <PropertyOverview
                    pgpalId={property.pgpalId}
                    id={property._id}
                  />
                  <PropertyStats pgpalId={property.pgpalId} />
                  <div className="flex flex-col items-center w-full">
                    <div className="bg-white rounded-xl shadow p-4 text-gray-800 w-full max-w-6xl mt-4">
                      <div className="text-center">
                        <strong>Contact:</strong> {property.contact?.phone} |{" "}
                        {property.contact?.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upgrade overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-start justify-center pt-8">
                  <div className="bg-white rounded-2xl p-8 mx-4 max-w-md text-center shadow-2xl">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        🚀 Unlock Detailed Analytics
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Get comprehensive insights into your property
                        performance, occupancy rates, revenue analytics, and
                        much more!
                      </p>
                    </div>

                    <div className="space-y-3 mb-6 text-left">
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Real-time occupancy tracking
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Revenue and payment analytics
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Tenant satisfaction metrics
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Export detailed reports
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        // Navigate to pricing/upgrade page
                        Navigate("/pricing", { state: { from: "overview", isTrialClaimed } });
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition duration-200 shadow-lg"
                    >
                      {userPlan === "trial" && isTrialClaimed
                        ? "Upgrade to Pro"
                        : "Start Free Trial"}
                    </button>

                    <p className="text-xs text-gray-500 mt-3">
                      {userPlan === "trial" && isTrialClaimed
                        ? "Your trial period is ending soon!"
                        : "Upgrade now and get 30% off your first month!"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Full stats access for paid users
              <>
                <PropertyOverview
                  pgpalId={property.pgpalId}
                  id={property._id}
                />
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
