import React, { useState } from "react";
import {
  FaStar,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWifi,
  FaUtensils,
  FaTshirt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const badgeColors: Record<string, string> = {
  "Girls only": "bg-pink-200 text-pink-700",
  Colive: "bg-blue-200 text-blue-700",
  Available: "bg-green-200 text-green-700",
  Full: "bg-gray-200 text-gray-700",
};

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <FaWifi className="inline mr-1" />,
  laundry: <FaTshirt className="inline mr-1" />,
  food: <FaUtensils className="inline mr-1" />,
};

const PGDetailsModal: React.FC<{
  property: any;
  rules?: any;
  averageRating?: number | null;
  onCallOwner: () => void;
  onNavigate: () => void;
}> = ({ property, averageRating, rules = [], onCallOwner, onNavigate }) => {
  if (!property) return null;

  const {
    name,
    address,
    amenities = [],
    contact,
    pgGenderType,
    availableBeds,
  } = property;

  const minRent = property.rentRange?.min / 1000 || 0;
  const maxRent = property.rentRange?.max / 1000 || 0;
  const minDeposit = property.depositRange?.min / 1000 || 0;
  const maxDeposit = property.depositRange?.max / 1000 || 0;

  // Badges
  const badges = [
    pgGenderType === "ladies"
      ? "Girls only"
      : pgGenderType === "colive"
      ? "Colive"
      : null,
    availableBeds
      ? availableBeds > 0
        ? {
            label: `Available - ${availableBeds}`,
            color: "bg-green-200 text-green-700",
          }
        : { label: "Full", color: "bg-gray-200 text-gray-700" }
      : { label: "Full", color: "bg-gray-200 text-gray-700" },
  ].filter(Boolean);

  const foodTypes = ["Breakfast", "Lunch", "Dinner"];
  const foundFoodTypes = amenities.filter((a: string) => foodTypes.includes(a));
  const otherAmenities = amenities.filter(
    (a: string) => !foodTypes.includes(a)
  );

  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        <span className="text-2xl font-bold text-purple-700">{name}</span>
        <span className="flex items-center text-yellow-500 text-lg font-semibold">
          <FaStar className="mr-1" />{" "}
          {averageRating ? averageRating.toFixed(1) : "N/A"}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {badges.map((badge, idx) =>
          typeof badge === "string" ? (
            <span
              key={badge}
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                badgeColors[badge as string] || "bg-gray-200 text-gray-700"
              }`}
            >
              {badge}
            </span>
          ) : (
            <span
              key={badge?.label}
              className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}
            >
              {badge?.label}
            </span>
          )
        )}
      </div>
      <div className="mb-2 text-gray-700 flex items-center gap-2">
        <FaMapMarkerAlt className="text-purple-400" />
        <span>
          {address?.city}, {address?.state}
        </span>
      </div>
      <div className="mb-2 flex gap-4">
        <div>
          <span className="font-semibold text-gray-600">Rent:</span>{" "}
          <span className="text-gray-700">
            ₹{minRent}k - ₹{maxRent}k/mo
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Deposit:</span>{" "}
          <span className="text-gray-700">
            ₹{minDeposit}k - ₹{maxDeposit}k
          </span>
        </div>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-gray-600">Food:</span>{" "}
        {foundFoodTypes.length > 0 ? (
          <span className="capitalize">{foundFoodTypes.join(", ")}</span>
        ) : (
          <span className="text-gray-400">No</span>
        )}
      </div>
      <div className="mb-2">
        <span className="font-semibold text-gray-600">Amenities:</span>
        <br className="mb-1" />
        {otherAmenities.length > 0 ? (
          otherAmenities.map((a: string) => (
            <span
              key={a}
              className="inline-flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs mt-1 mr-2 mb-1"
            >
              {amenityIcons[a.toLowerCase()] || (
                <FaCheckCircle className="inline mr-1" />
              )}
              {a}
            </span>
          ))
        ) : (
          <span className="text-gray-500">None</span>
        )}
      </div>
      <div className="mb-2">
        <span className="font-semibold text-gray-600">Rules:</span>{" "}
        {rules.length > 0 ? (
          <ul className="list-disc ml-6">
            {rules.map((r: any) => (
              <li key={r._id} className="text-gray-700 text-sm">
                {r.rule}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-400">No rules specified</span>
        )}
      </div>
      <div className="mb-3">
        <span className="font-semibold text-gray-600">Owner:</span>{" "}
        <span className="text-gray-700">
          {contact?.name || contact?.email || "N/A"}
        </span>
        {contact?.phone && (
          <button
            className=" inline-flex items-center mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold hover:bg-green-200 transition"
            onClick={onCallOwner}
          >
            <FaPhoneAlt className="mr-1 " /> Call Owner
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={onNavigate}
        >
          <FaMapMarkerAlt /> Navigate to PG
        </button>
      </div>
    </div>
  );
};

export default PGDetailsModal;
