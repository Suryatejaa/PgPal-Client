import React from "react";

const PastTenantsList = ({
  vacates,
  onRetain,
  userId,
}: {
  vacates: any[];
  onRetain?: (vacate: any) => void;
  userId: string;
}) => (
  <div className="grid gap-4 md:grid-cols-2">
    {vacates.length === 0 ? (
      <div className="text-gray-500">No past tenants found.</div>
    ) : (
      vacates.map((v) => (
        <div
          key={v._id}
          className="bg-white rounded-lg shadow p-4 border border-gray-200"
        >
          <div className="font-bold text-lg text-purple-800">{v.tenantId}</div>
          <div className="font-bold text-lg text-purple-800">{v.name}</div>
          <div className="text-gray-700">Room: {v.roomId}</div>
          <div className="text-gray-700">Bed: {v.bedId}</div>
          <div className="text-gray-700">
            Vacated: {new Date(v.vacateDate).toLocaleDateString()}
          </div>
          <div className="text-gray-700">Reason: {v.reason || "N/A"}</div>
          {onRetain && v.createdBy === userId && (
            <button
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => onRetain(v)}
            >
              Retain
            </button>
          )}
        </div>
      ))
    )}
  </div>
);

export default PastTenantsList;
