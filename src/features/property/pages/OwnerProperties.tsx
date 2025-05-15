import React, { useEffect, useState } from "react";
import {
  getOwnProperties,
  addProperty,
  updateProperty,
  getPropertyById,
} from "../services/propertyService";
import PropertyForm from "../components/PropertyForm";
import { PlusIcon } from "@heroicons/react/24/solid";
import PropertyCard from "../components/PropertyCard";
import PropertyOverview from "../../dashboard/components/PropertyOverview"
import PropertyStats from "../../dashboard/components/StatsComponent";


const OwnerProperties: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

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
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-2">Add New Property</h3>
            <PropertyForm
              initial={null}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </div>
    );
  }

  // If properties exist, show cards and add card
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your PGs</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
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
          className="min-w-[220px] w-56 h-40 bg-white/80 rounded-xl shadow-lg border-2 border-dashed border-purple-400 flex flex-col items-center justify-center hover:bg-purple-50 transition"
        >
          <PlusIcon className="h-10 w-10 text-purple-600 mb-2" />
          <span className="text-lg font-semibold text-purple-700">
            Add Property
          </span>
        </button>
      </div>
      {showForm && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
          <h3 className="text-xl font-semibold mb-2">Add New Property</h3>
          <PropertyForm
            initial={null}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}
      {/* Property dashboard/metrics section */}
      {!showForm && selectedProperty && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">
            {selectedProperty.name} Dashboard
          </h3>
          <PropertyOverview pgpalId={selectedProperty.pgpalId} />
          <PropertyStats pgpalId={selectedProperty.pgpalId} />
          {/* Replace below with your actual metrics/components */}
          <div className="bg-white rounded-xl shadow p-4 text-gray-800">
            <div>
              <strong>Address:</strong> {selectedProperty.address?.street},{" "}
              {selectedProperty.address?.city},{" "}
              {selectedProperty.address?.state} -{" "}
              {selectedProperty.address?.zip}
            </div>
            <div>
              <strong>Contact:</strong> {selectedProperty.contact?.phone} |{" "}
              {selectedProperty.contact?.email}
            </div>
            <div>
              <strong>Total Rooms:</strong> {selectedProperty.totalRooms}
            </div>
            <div>
              <strong>Total Beds:</strong> {selectedProperty.totalBeds}
            </div>
            <div>
              <strong>Occupied Beds:</strong> {selectedProperty.occupiedBeds}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerProperties;
