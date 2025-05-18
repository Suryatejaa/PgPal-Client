import React from "react";

const InactiveTenantsList = ({
  vacates,
  propertyId,
}: {
  vacates: any[];
  propertyId: string;
}) => {
  const noticePeriodTenants = vacates
    .filter((v) => v.status === "noticeperiod" && v.propertyId === propertyId)
    .sort((a, b) =>
      (a.bedId || "").localeCompare(b.bedId || "", undefined, { numeric: true })
    );

  return (
    <div>
      <div className="font-bold text-lg mb-1 text-purple-700">
        Tenants in Notice Period
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {noticePeriodTenants.length === 0 ? (
          <div className="text-gray-500">No tenants in notice period.</div>
        ) : (
          noticePeriodTenants.map((v) => (
            <div
              key={v.tenantId}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <div className="font-bold text-lg text-purple-800">
                {v.tenantId}
              </div>
              <div className="text-gray-700">Room: {v.roomId}</div>
              <div className="text-gray-700">Bed: {v.bedId}</div>
              <div className="text-gray-700">
                Vacate Date:{" "}
                {v.vacateDate
                  ? new Date(v.vacateDate).toLocaleDateString()
                  : "-"}
              </div>
              <div className="text-gray-700">
                Notice Period:{" "}
                {v.noticePeriodStartDate
                  ? new Date(v.noticePeriodStartDate).toLocaleDateString()
                  : "-"}{" "}
                to{" "}
                {v.noticePeriodEndDate
                  ? new Date(v.noticePeriodEndDate).toLocaleDateString()
                  : "-"}
              </div>
              <div className="text-gray-700">
                Rent Paid: ₹{v.previousSnapshot?.rentPaid ?? "-"}
              </div>
              <div className="text-gray-700">
                Rent Status: {v.previousSnapshot?.rentPaidStatus ?? "-"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InactiveTenantsList;
