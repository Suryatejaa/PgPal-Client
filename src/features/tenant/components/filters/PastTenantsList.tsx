import React from "react";

const PastTenantsList = ({
  vacates,
  userId,
}: {
  vacates: any[];
  userId: string;
}) => (
  <div className="grid gap-4 md:grid-cols-2">
    {vacates.length === 0 ? (
      <div className="text-gray-500">No past tenants found.</div>
    ) : (
      vacates.map((v) => {
        // const isBedOccupied = occupiedBeds.includes(v.bedId);
        // console.log(v)
        // Retain allowed if in notice period or (immediate vacate and within 7 days)
        // const now = new Date();
        const vacateDate = new Date(v.vacateDate);
        // const daysSinceVacate =
        //   (now.getTime() - vacateDate.getTime()) / (1000 * 60 * 60 * 24);

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
            <div className="text-gray-700">
              Status:{" "}
              {v.status === "noticeperiod" ? "Notice Period" : "Immediate"}
            </div>
            {v.status === "noticeperiod" && (
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
            )}
            {v.status === "noticeperiod" && (
              <div className="text-gray-700 bg-yellow-100 p-2 rounded-md">
                Notes: {v.ownerDepositInfo}
              </div>
            )}
            <div className="text-gray-700">Reason: {v.reason || "N/A"}</div>
          </div>
        );
      })
    )}
  </div>
);

export default PastTenantsList;
