import React from "react";

interface PropertyCardProps {
  property: any;
  onClick: () => void;
  isSelected?: boolean;
  fromTenantLandingPage?: boolean;
  children?: React.ReactNode;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick,
  isSelected,
  fromTenantLandingPage,
  children,
}) => (
  <button
    onClick={onClick}
    className={`
      ${
        fromTenantLandingPage
          ? "w-full min-w-10 mb-2 rounded-none items-start"
          : "items-center ms-2 ps-1 rounded-xl min-w-[220px] w-56 mb-2"
      }
      h-40 bg-white/80  mt-1 shadow-lg flex flex-col justify-center transition
      ${
        isSelected
          ? "ring-4 ring-purple-500 focus:outline-none focus:border-none"
          : "hover:ring-2 focus:outline-none focus:border-none hover:ring-purple-400"
      }`}
    style={{ position: "relative", textAlign: "left" }}
  >
    <div className="text-xl font-bold text-purple-700 mb-1 text-left w-full">
      {property.name}
    </div>
    <div className="text-sm text-gray-700 text-left w-full">
      {property.address?.city}, {property.address?.state}
    </div>
    <div className="mt-2 text-xs text-gray-500 text-left w-full">
      {property.totalRooms} rooms, {property.totalBeds} beds
    </div>
    {fromTenantLandingPage && (
      <div className="mt-2 text-xs text-purple-600 text-left w-full">
        <h4>Tap to know more</h4>
      </div>
    )}
    {children && <div className="mt-2">{children}</div>}
  </button>
);

export default PropertyCard;
