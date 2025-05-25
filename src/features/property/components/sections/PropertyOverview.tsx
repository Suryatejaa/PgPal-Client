import React, { useState, useRef, useEffect } from "react";
import TodayMenuSection from "../../../kitchen/components/sections/TodayMenuSection";
import AddComplaintForm from "../../../complaints/components/AddComplaintForm";
import { raiseComplaint } from "../../../complaints/services/complaintsApi";
import ComplaintsSection from "../../../complaints/components/sections/ComplaintsSection";
import VacateSection from "./VacateSection";

const SUB_SECTION_LIST = [
  { key: "overview", label: "Overview" },
  { key: "menu", label: "Today Menu" },
  { key: "complaint", label: "Raise Complaint" },
  { key: "vacate", label: "Raise Vacate" },
];

const PropertyOverview = ({
  overview,
  userId,
  rules,
  onVacateChange,
}: {
  overview: any;
  userId?: string;
  rules?: any;
  onVacateChange?: () => void;
}) => {
  const [selectedSubSection, setSelectedSubSection] = useState(
    () => sessionStorage.getItem("tenantSubSelectedSection") || "overview"
  );
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [complaintsRefreshKey, setComplaintsRefreshKey] = useState(0);
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  // console.log('id from overview', overview, userId);

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

  // console.log(overview)

  const handleRaiseComplaint = async (data: any) => {
    try {
      await raiseComplaint(data);
      alert("Complaint raised!");
      setShowComplaintForm(false);
      setComplaintsRefreshKey((prev) => prev + 1); // Trigger refresh for complaints section
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to raise complaint");
    }
  };

  useEffect(() => {
    sessionStorage.setItem("tenantSubSelectedSection", selectedSubSection);
  }, [selectedSubSection]);

  return (
    <div>
      {/* Sticky Sub Section Bar */}
      <div
        className={`sticky z-10 w-full transition-colors duration-500 bg-purple-50  ${
          isSticky
            ? "from-purple-600 to-indigo-600 rounded-t-none border-none"
            : ""
        }`}
        style={{ top: "90px" }}
        ref={stickyRef}
      >
        <div className="flex space-x-2 overflow-x-auto bg-purple-200 rounded-none">
          {SUB_SECTION_LIST.map((section) => (
            <button
              key={section.key}
              onClick={() => {
                setSelectedSubSection(section.key);
                if (section.key === "complaint") setShowComplaintForm(false);
              }}
              className={`px-4 py-4 whitespace-nowrap font-semibold transition focus:outline-none bg-transparent border-none
                ${
                  selectedSubSection === section.key
                    ? "bg-purple-100 text-black rounded-t-md rounded-t-none "
                    : "bg-purple-300 text-purple-900 hover:text-purple-700 rounded-t-md"
                }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
      {/* Sub Section Content */}
      <div className="mt-1">
        {selectedSubSection === "overview" && (
          <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8 border border-purple-200">
            <div className="flex-1">
              <div className="text-2xl font-bold text-purple-800 mb-2 flex items-center gap-2">
                <span>{overview.name}</span>
                <span className="inline-block px-2 py-1 text-xs bg-purple-200 text-purple-800 rounded">
                  {overview.pgGenderType?.toUpperCase()}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-purple-700">Address:</span>
                <span className="ml-2 text-gray-700">
                  {[
                    overview.address?.plotNumber,
                    overview.address?.line1,
                    overview.address?.line2,
                    overview.address?.street,
                    overview.address?.city,
                    overview.address?.state,
                    overview.address?.country,
                    overview.address?.zipCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-purple-700">Contact:</span>
                <span className="ml-2 text-gray-700">
                  {overview.contact?.phone} | {overview.contact?.email}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-purple-700">
                  Amenities:
                </span>
                <span className="ml-2 text-gray-700">
                  {overview.amenities && overview.amenities.length > 0
                    ? overview.amenities.join(", ")
                    : "N/A"}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-purple-700">Rules:</span>
                <span className="ml-2 text-gray-700">
                  {rules && rules.length > 0
                    ? rules.map((rule: any) => (
                        <div key={rule.id} className="mb-1">
                          <span className="text-gray-700">{rule.rule}</span>
                        </div>
                      ))
                    : "N/A"}
                </span>
              </div>
            </div>
            {/* Optionally, show images if available */}
            {overview.images && overview.images.length > 0 && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <img
                  src={overview.images[0]}
                  alt="PG"
                  className="rounded-lg shadow-lg max-h-60 object-cover"
                />
                {overview.images.length > 1 && (
                  <div className="mt-2 text-xs text-gray-500">
                    +{overview.images.length - 1} more photos
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {selectedSubSection === "menu" && (
          <div className="bg-white/80 rounded-xl shadow-lg p-6 border border-purple-200">
            <TodayMenuSection pgpalId={overview.pgpalId} />
          </div>
        )}
        {selectedSubSection === "complaint" && (
          <div className="bg-white/80 mt-1 rounded-xl shadow-lg border-none border-purple-200">
            <div className="sticky top-[162px] z-20 -mr-4 border-none border-purple-100 px-4 py-2 flex justify-end">
              {!showComplaintForm && (
                <button
                  className="mb-0 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
                  onClick={() => setShowComplaintForm(true)}
                >
                  + Raise Complaint
                </button>
              )}
            </div>
            {showComplaintForm ? (
              <AddComplaintForm
                propertyId={overview.pgpalId}
                onSubmit={handleRaiseComplaint}
                onCancel={() => setShowComplaintForm(false)}
              />
            ) : (
              <div className="relative mt-0">
                <ComplaintsSection
                  property={overview}
                  propertyId={overview.pgpalId}
                  userId={userId}
                  userPpid={userId}
                  isOwner={false}
                  refreshKey={complaintsRefreshKey}
                />
              </div>
            )}
          </div>
        )}
        {selectedSubSection === "vacate" && (
          <div>
            <VacateSection
              propertyId={overview.pgpalId}
              userId={userId}
              onVacateChange={onVacateChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyOverview;
