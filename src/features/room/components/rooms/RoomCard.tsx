import React from "react";

const RoomCard = ({ room }: { room: any }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200">
    <div className="flex justify-between items-center">
      <div>
        <div className="font-bold text-lg text-purple-800">
          Room {room.roomNumber}
        </div>
        <div className="text-gray-700">Floor: {room.floor}</div>
        <div className="text-gray-700 capitalize">Type: {room.type}</div>
        <div className="text-gray-700">
          Rent/Bed:{" "}
          <span className="font-semibold text-green-700">
            ₹{room.rentPerBed}
          </span>
        </div>
      </div>
      <div>
        <span className="text-sm text-gray-500">
          Beds: {room.beds?.length || 0}
        </span>
      </div>
    </div>
    <div
      className={`mt-2 ${
        room.beds?.length > 2 ? "max-h-32 overflow-y-auto pr-1" : ""
      }`}
      style={{ minHeight: "2.5rem" }}
    >
      {room.beds?.map((bed: any, idx: number) => (
        <div
          key={idx}
          className={`border rounded p-2 mb-1 ${
            bed.status === "occupied"
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div>
            <span className="font-semibold text-purple-800">{bed.bedId}:</span>{" "}
            <span
              className={
                bed.status === "occupied" ? "text-red-700" : "text-green-700"
              }
            >
              {bed.status}
            </span>
          </div>
          {bed.status === "occupied" && (
            <div className="ml-2 text-xs text-gray-700">
              <div>Tenant Phone: {bed.tenantNo || "N/A"}</div>
              <div>Tenant PPT: {bed.tenantPpt || "N/A"}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default RoomCard;
