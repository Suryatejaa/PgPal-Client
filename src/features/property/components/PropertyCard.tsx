import React from "react";

interface PropertyCardProps {
  property: any;
  onClick: () => void;
  isSelected?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick,
  isSelected,
}) => (
  <button
    onClick={onClick}
    className={`min-w-[220px] w-56 h-40 bg-white/80 rounded-xl shadow-lg flex flex-col justify-center items-center transition
      ${
        isSelected
          ? "ring-4 ring-purple-500"
          : "hover:ring-2 hover:ring-purple-400"
      }`}
  >
    <div className="text-xl font-bold text-purple-700 mb-1">
      {property.name}
    </div>
    <div className="text-sm text-gray-700">
      {property.address?.city}, {property.address?.state}
    </div>
    <div className="mt-2 text-xs text-gray-500">
      {property.totalRooms} rooms, {property.totalBeds} beds
    </div>
  </button>
);

export default PropertyCard;
