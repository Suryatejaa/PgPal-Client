import React, { useState } from "react";
import PropertyOverview from "../../../dashboard/components/PropertyOverview";
import PropertyStats from "../../../dashboard/components/StatsComponent";
import AmenitiesSection from "../../../dashboard/components/AmenitiesSection";
import RulesSection from "../../../dashboard/components/RulesSection";
import ReviewsSection from "../../../dashboard/components/ReviewsSection";

const OVERVIEW_TABS = [
  { key: "stats", label: "Stats" },
  { key: "amenities", label: "Amenities" },
  { key: "rules", label: "Rules" },
  { key: "reviews", label: "Reviews" },
];

const KitchenSection = ({
  property,
  userId,
  userName,
  userRole,
  isOwner,
}: {
  property: any;
  userId: string;
  userName: string;
  userRole: string;
  isOwner: boolean;
}) => {
  const [selectedTab, setSelectedTab] = useState("stats");

  return (
    <div className="relative">
      {/* Sticky filter bar */}
      <div
        className="sticky z-20 flex overflow-x-auto text-sm -mt-1 pb-1 bg-purple-300 border-gray-200"
        style={{ top: 120 }} // Adjust as needed for your header height
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
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="pt-2">
        {selectedTab === "stats" && (
          <>
            <PropertyOverview pgpalId={property.pgpalId} />
            <PropertyStats pgpalId={property.pgpalId} />
            <div className="bg-white rounded-xl shadow p-4 text-gray-800">
              <div>
                <strong>Contact:</strong> {property.contact?.phone} |{" "}
                {property.contact?.email}
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
      </div>
    </div>
  );
};

export default KitchenSection;
