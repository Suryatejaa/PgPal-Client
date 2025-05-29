import React from "react";

const BedCard = ({
  bed,
  onVacantClick,
  onOccupiedClick,
}: {
  bed: any;
  onVacantClick?: (ppid: string) => void;
  onOccupiedClick?: (ppid: string) => void;
}) => (
  <div
    className={`border rounded p-2 mb-1 cursor-pointer transition hover:shadow-md ${
      bed.status === "occupied" || bed.status === "noticeperiod"
        ? "bg-red-50 border-red-200"
        : "bg-green-50 border-green-200"
    }`}
    onClick={() => {  
      bed.status === "occupied" || bed.status === "noticeperiod"
        ? onOccupiedClick && onOccupiedClick(bed)
        : onVacantClick && onVacantClick(bed)
    }}
    title={
      bed.status === "occupied" || bed.status === "noticeperiod" && bed.tenantPpt 
        ? "Click to view tenant details"
        : undefined
    }
  >
    <div>
      <span className="font-semibold text-purple-800">{bed.bedId}:</span>{" "}
      <span
        className={
          bed.status === "occupied" || bed.status === "noticeperiod"
            ? "text-red-700"
            : "text-green-700"
        }
      >
        {bed.status}
      </span>
    </div>
    {(bed.status === "occupied" || bed.status === "noticeperiod") && (
      <div className="ml-2 text-xs text-gray-700">
        <div>Tenant Phone: {bed.tenantNo || "N/A"}</div>
        <div>Tenant PPT: {bed.tenantPpt || "N/A"}</div>
      </div>
    )}
  </div>
);

export default BedCard;
