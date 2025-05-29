import React, { use, useEffect, useState } from "react";
import PropertyOverview from "../../../dashboard/components/PropertyOverview";
import axiosInstance from "../../../../services/axiosInstance";
import PropertyStats from "./StatsComponent";
import AmenitiesSection from "./AmenitiesSection";
import RulesSection from "./RulesSection";
import ReviewsSection from "./ReviewsSection";
import ApprovalSection from "./ApprovalSection";

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
  setRequestedUsers
}: {
  property: any;
  userId: string;
  userName: string;
  userRole: string;
  isOwner: boolean;
  setRequestedUsers: (users: any[]) => void;
}) => {
  const [selectedTab, setSelectedTab] = useState(
    () => sessionStorage.getItem("selectedTab") || "stats"
  );
  const [approvalCount, setApprovalCount] = useState(0);
  // console.log(property)
  useEffect(() => {
    // Save selected tab to session storage
    sessionStorage.setItem("selectedTab", selectedTab);
  }, [selectedTab]);

  const handleAction = (approvalId: string, action: "approve" | "reject") => {
    // Handle the approval or rejection action
    try {
      axiosInstance.post(`/tenant-service/vacates/${approvalId}/${action}`);
    } catch (error) {
      console.error("Error handling approval action:", error);
    }
    console.log(`Approval ID: ${approvalId}, Action: ${action}`);
  };

  return (
    <div className="relative">
      {/* Sticky filter bar */}
      <div
        className="sticky z-20 flex overflow-x-auto text-sm -mt-1 pb-1 bg-purple-300 border-gray-200"
        style={{ top: 140 }} // Adjust as needed for your header height
      >
        {OVERVIEW_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`px-3 py-2 whitespace-nowrap font-semibold transition focus:outline-none
              ${
                selectedTab === tab.key
                  ? "bg-transparent text-black rounded-t-md rounded-b-none border-none"
                  : "bg-transparent text-indigo-700 hover:text-purple-700 border-none"
              }`}
          >
            {tab.label}
            {tab.key === "approvals" && approvalCount > 0 && (
              <span className="ml-1 text-xs text-red-600">
                ({approvalCount})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="pt-2">
        {selectedTab === "stats" && (
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
        {selectedTab === "amenities" && (
          <AmenitiesSection propertyId={property._id} />
        )}
        {selectedTab === "rules" && (
          <RulesSection
            propertyId={property._id}
            isOwner={isOwner}
            userId={userId}
          />
        )}
        {selectedTab === "reviews" && (
          <ReviewsSection
            propertyId={property._id}
            userId={userId}
            userName={userName}
            userRole={userRole}
            isOwner={isOwner}
          />
        )}
        {selectedTab === "approvals" && (
          <ApprovalSection
            propertyId={property.pgpalId}
            userId={userId}
            userName={userName}
            userRole={userRole}
            isOwner={isOwner}
            handleAction={handleAction}
            setCount={(c: number) => {
              setApprovalCount(c);
            }}
            setRequestedUsers={setRequestedUsers}
          />
        )}
      </div>
    </div>
  );
};

export default OverviewSection;
