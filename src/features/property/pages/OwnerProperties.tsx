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
}> = ({ userId, userName, userRole, userPpid }) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSection, setSelectedSection] = useState("overview");
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);

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

  const fetchProperties = async () => {
    const res = await getOwnProperties();
    setProperties(res.data);
    // Select the first property by default if available
    if (res.data.length > 0) setSelectedProperty(res.data[0]);
    else setSelectedProperty(null);
  };

  // Handle property card click (just select, don't open form)
  const handleCardClick = (property: any) => {
    console.log(property.ownerId);
    console.log(userId);
    setSelectedProperty(property);
    setShowForm(false);
  };

  // Handle add card click (open form)
  const handleAddCardClick = () => {
    setShowForm(true);
    setSelectedProperty(null);
  };

  // Handle form submit
  const handleFormSubmit = async (data: any) => {
    console.log(data);
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
      <div className="flex items-center space-x-4">
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
          className="min-w-[220px] w-56 h-40 bg-white/80 rounded-xl mt-1 -ml-1 shadow-lg border-2 border-dashed border-purple-400 flex flex-col items-center justify-center hover:bg-purple-50 transition"
        >
          <PlusIcon className="h-10 w-10 text-purple-600 mb-2" />
          <span className="text-lg font-semibold text-purple-700">
            Add Property
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
            />
          )}
          {selectedSection === "rooms" && (
            <RoomsSection property={selectedProperty} />
          )}
          {selectedSection === "tenants" && (
            <TenantsSection property={selectedProperty} userId={userId} />
          )}
          {selectedSection === "kitchen" && (
            <KitchenSection property={selectedProperty} />
          )}
          {selectedSection === "complaints" && (
            <ComplaintsSection
              property={selectedProperty}
              userId={userId}
              isOwner={selectedProperty?.ownerId === userId}
              userPpid={userPpid}
            />
          )}
          {selectedSection === "address" && (
            <AddressSection property={selectedProperty} isOwner={selectedProperty?.ownerId === userId} />
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerProperties;
