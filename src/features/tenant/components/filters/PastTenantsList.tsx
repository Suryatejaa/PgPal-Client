import React from "react";

const PastTenantsList = ({
  vacates,
  onRetain,
  userId,
  occupiedBeds = [],
}: {
  vacates: any[];
  onRetain?: (vacate: any) => void;
  userId: string;
  occupiedBeds?: string[];
}) => (
  <div className="grid gap-4 md:grid-cols-2">
    {vacates.length === 0 ? (
      <div className="text-gray-500">No past tenants found.</div>
    ) : (
      vacates.map((v) => {
        const isBedOccupied = occupiedBeds.includes(v.bedId);

        // Retain allowed if in notice period or (immediate vacate and within 7 days)
        const now = new Date();
        const vacateDate = new Date(v.vacateDate);
        const daysSinceVacate =
          (now.getTime() - vacateDate.getTime()) / (1000 * 60 * 60 * 24);

        const canRetain =
          !isBedOccupied &&
          v.createdBy === userId &&
          (v.status === "noticeperiod" ||
            v.isInNoticePeriod ||
            (v.isImmediateVacate && daysSinceVacate <= 7));

        return (
          <div
            key={v._id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="font-bold text-lg text-purple-800">
              {v.tenantId}
            </div>
            <div className="font-bold text-lg text-purple-800">{v.name}</div>
            <div className="text-gray-700">Room: {v.roomId}</div>
            <div className="text-gray-700">Bed: {v.bedId}</div>
            <div className="text-gray-700">
              Vacated: {vacateDate.toLocaleDateString()}
            </div>
            <div className="text-gray-700">Reason: {v.reason || "N/A"}</div>
            {onRetain && v.createdBy === userId ? (
              isBedOccupied ? (
                <div className="mt-2 text-xs text-red-600">
                  Can't retain tenant, bed occupied. Add as new tenant.
                </div>
              ) : canRetain ? (
                <button
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => onRetain(v)}
                >
                  Retain
                </button>
              ) : (
                <div className="mt-2 text-xs text-red-600">
                  Retention period expired. Add as new tenant.
                </div>
              )
            ) : null}
          </div>
        );
      })
    )}
  </div>
);

export default PastTenantsList;
