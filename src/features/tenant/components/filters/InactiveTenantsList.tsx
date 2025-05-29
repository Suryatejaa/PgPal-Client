import { CameraIcon } from "@heroicons/react/24/outline";
import React from "react";

const InactiveTenantsList = ({
  vacates,
  propertyId,
  onRetain,
  occupiedBeds,
}: {
  vacates: any[];
  propertyId: string;
  onRetain?: (vacateId: string) => void;
  occupiedBeds: { bedId: string; tenantId: string }[];
}) => {
  const noticePeriodTenants = vacates.filter(
    (v) => v.status === "noticeperiod"
  );

  // console.log('noticeperiod ',vacates);
  function canRetainTenant(vacate: any) {
    // Find if the bed is occupied
    const bed = occupiedBeds.find((b: any) => b.bedId === vacate.bedId);
    // Allow retain if:
    // - bed is not occupied (bed is vacant)
    // - OR bed is occupied by the same tenant as in the vacate request
    return !bed || (bed.tenantId === vacate.tenantId && vacate.removedByOwner);
  }

  return (
    <div>
      <div className="font-bold text-lg mb-1 text-purple-700">
        Tenants in Notice Period
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {noticePeriodTenants.length === 0 ? (
          <div className="text-gray-500">No tenants in notice period.</div>
        ) : (
          noticePeriodTenants.map((v) => {
            const canRetain = canRetainTenant(v);
            return (
              <div
                key={v._id}
                className="bg-white rounded-lg shadow p-4 border border-gray-200"
              >
                <div className="font-bold text-lg text-purple-800">
                  {v.name}
                </div>
                <div className="font-bold text-xs text-purple-800">
                  {v.tenantId}
                </div>
                <div className="text-gray-700">
                  <b>Stay:</b> {v.bedId}
                </div>
                <div className="text-gray-700">
                  <b>Phone:</b> {v.phone}
                </div>
                <div className="text-gray-700">
                  <b>Vacate Date:</b>{" "}
                  {v.noticePeriodEndDate
                    ? new Date(v.noticePeriodEndDate).toLocaleDateString()
                    : "-"}
                </div>
                <div className="text-gray-700">
                  <b>Notice Period:</b>{" "}
                  {v.noticePeriodStartDate
                    ? new Date(v.noticePeriodStartDate).toLocaleDateString()
                    : "-"}{" "}
                  to{" "}
                  {v.noticePeriodEndDate
                    ? new Date(v.noticePeriodEndDate).toLocaleDateString()
                    : "-"}
                </div>
                <div className="text-gray-700 bg-yellow-100 p-2 rounded-md">
                  <b>Notes:</b> {v.ownerDepositInfo ?? "-"}
                </div>
                {canRetain && (
                  <div className="text-red-600 text-sm mt-2">
                    <button
                      className="bg-red-100 text-red-600 px-2 py-1 rounded"
                      onClick={() => {
                        if (onRetain) {
                          onRetain(v._id);
                        }
                      }}
                    >
                      Retain Tenant
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InactiveTenantsList;
