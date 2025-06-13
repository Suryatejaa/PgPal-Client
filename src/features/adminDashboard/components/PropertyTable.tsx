import React, { useState } from "react";
import { type Property } from "../services/propertyService";

interface PropertyTableProps {
  properties: Property[];
  loading: boolean;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  loading,
  onToggleStatus,
  onDelete,
  onViewDetails,
}) => {
  const [sortField, setSortField] = useState<keyof Property>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof Property) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedProperties = [...properties].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    // Handle nested properties
    if (sortField === "name") {
      aValue = a.name;
      bValue = b.name;
    } else if (sortField === "createdAt") {
      aValue = a.createdAt;
      bValue = b.createdAt;
    } else if (sortField === "totalRooms") {
      aValue = a.totalRooms;
      bValue = b.totalRooms;
    } else if (sortField === "availableBeds") {
      aValue = a.availableBeds;
      bValue = b.availableBeds;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const getStatusBadge = (availableBeds: number) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

    if (availableBeds > 0) {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Properties
        </h3>
      </div>
      {/* Mobile Card Layout */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-200">
          {sortedProperties.map((property) => (
            <div key={property._id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {property.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {property.pgGenderType} • PG ID: {property.pgpalId}
                  </p>
                </div>
                <span className={getStatusBadge(property.availableBeds)}>
                  {property.availableBeds > 0
                    ? `${property.availableBeds} available`
                    : "Full"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Location:</span>
                  <p className="font-medium truncate">
                    {property.address.city}, {property.address.state}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Rent Range:</span>
                  <p className="font-medium">
                    ₹{property.rentRange.min.toLocaleString()} - ₹
                    {property.rentRange.max.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Rooms/Beds:</span>
                  <p className="font-medium">
                    {property.totalRooms} rooms, {property.totalBeds} beds
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium">
                    {formatDate(property.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => onViewDetails(property._id)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50"
                  title="View Details"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onToggleStatus(property._id)}
                  className={`p-2 rounded-md ${
                    property.availableBeds > 0
                      ? "text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50"
                      : "text-green-600 hover:text-green-900 hover:bg-green-50"
                  }`}
                  title={
                    property.availableBeds > 0
                      ? "Mark as Full"
                      : "Mark Available"
                  }
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(property._id)}
                  className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50"
                  title="Delete"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {sortField === "name" && (
                    <svg
                      className={`w-4 h-4 ml-1 ${
                        sortDirection === "asc" ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rent Range
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("totalRooms")}
              >
                Rooms/Beds
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("availableBeds")}
              >
                Availability
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("createdAt")}
              >
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProperties.map((property) => (
              <tr key={property._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {property.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {property.pgGenderType} • PG ID: {property.pgpalId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    {property.address.city}, {property.address.state}
                  </div>
                  <div className="text-xs text-gray-500">
                    {property.address.zipCode}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{property.rentRange.min.toLocaleString()} - ₹
                  {property.rentRange.max.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{property.totalRooms} rooms</div>
                  <div className="text-xs text-gray-500">
                    {property.totalBeds} total beds
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(property.availableBeds)}>
                    {property.availableBeds > 0
                      ? `${property.availableBeds} available`
                      : "Full"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(property.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onViewDetails(property._id)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="View Details"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onToggleStatus(property._id)}
                      className={`p-1 rounded ${
                        property.availableBeds > 0
                          ? "text-yellow-600 hover:text-yellow-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                      title={
                        property.availableBeds > 0
                          ? "Mark as Full"
                          : "Mark Available"
                      }
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(property._id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Delete"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>{" "}
      {properties.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No properties
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new property.
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyTable;
