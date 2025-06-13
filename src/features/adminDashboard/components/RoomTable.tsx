import React, { useState } from "react";
import { type Room } from "../services/roomService";

interface RoomTableProps {
  rooms: Room[];
  loading: boolean;
  onBulkUpdate: (roomIds: string[], updates: Partial<Room>) => void;
  onViewRoom: (room: Room) => void;
}

const RoomTable: React.FC<RoomTableProps> = ({
  rooms,
  loading,
  onBulkUpdate,
  onViewRoom,
}) => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortField, setSortField] = useState<keyof Room>("roomNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Room) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };
  const handleSelectAll = () => {
    if (selectedRooms.length === rooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(rooms.map((room) => room._id));
    }
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

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

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

    switch (status) {
      case "available":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "occupied":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "maintenance":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleBulkStatusChange = (status: string) => {
    onBulkUpdate(selectedRooms, { status: status as Room["status"] });
    setSelectedRooms([]);
    setShowBulkActions(false);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Rooms
          </h3>
          {selectedRooms.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-600">
                {selectedRooms.length} selected
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700"
                >
                  Bulk Actions
                </button>
                {showBulkActions && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => handleBulkStatusChange("available")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mark as Available
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange("maintenance")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mark as Maintenance
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Card Layout */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-200">
          {sortedRooms.map((room) => (
            <div key={room._id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room._id)}
                    onChange={() => handleSelectRoom(room._id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900">
                      Room {room.roomNumber}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {room.type} • {room.totalBeds}{" "}
                      {room.totalBeds === 1 ? "bed" : "beds"}
                    </p>
                  </div>
                </div>
                <span className={getStatusBadge(room.status)}>
                  {room.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Rent per bed:</span>
                  <p className="font-medium">
                    {formatCurrency(room.rentPerBed)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Total beds:</span>
                  <p className="font-medium">
                    {room.totalBeds} {room.totalBeds === 1 ? "bed" : "beds"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500">Bed Details:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {room.beds.slice(0, 3).map((bed, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded ${
                        bed.status === "occupied"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {bed.bedId}: {bed.status}
                    </span>
                  ))}
                  {room.beds.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{room.beds.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-gray-100">
                <button
                  onClick={() => onViewRoom(room)}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={
                    selectedRooms.length === rooms.length && rooms.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("roomNumber")}
              >
                <div className="flex items-center">
                  Room Number
                  {sortField === "roomNumber" && (
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
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("type")}
              >
                Type
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("totalBeds")}
              >
                Total Beds
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("rentPerBed")}
              >
                Rent Per Bed
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bed Details
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRooms.map((room) => (
              <tr key={room._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room._id)}
                    onChange={() => handleSelectRoom(room._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {room.roomNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.totalBeds} {room.totalBeds === 1 ? "bed" : "beds"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(room.rentPerBed)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(room.status)}>
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {room.beds.slice(0, 2).map((bed, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded ${
                          bed.status === "occupied"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {bed.bedId}: {bed.status}
                      </span>
                    ))}
                    {room.beds.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{room.beds.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewRoom(room)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>{" "}
      {rooms.length === 0 && (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms</h3>
          <p className="mt-1 text-sm text-gray-500">
            No rooms found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomTable;
