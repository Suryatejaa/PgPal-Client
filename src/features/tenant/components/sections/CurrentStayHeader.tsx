import React from "react";
import { MapIcon } from "@heroicons/react/24/outline";

const CurrentStayHeader = ({
  stay,
  hasCoords,
  lat,
  lng,
  isInNoticePeriod,
  noticePeriodStartDate,
  noticePeriodEndDate,
}: {
  stay: any;
  hasCoords: boolean;
  lat: number;
  lng: number;
  isInNoticePeriod?: boolean;
  noticePeriodStartDate?: string;
  noticePeriodEndDate?: string;
  }) => {
    
  // console.log(stay)
  const isValidCoords =
    Array.isArray(stay.location?.coordinates) &&
    stay.location.coordinates.length === 2 &&
    !(
      stay.location.coordinates[0] === 0 && stay.location.coordinates[1] === 0
    ) &&
    !isNaN(stay.location.coordinates[0]) &&
    !isNaN(stay.location.coordinates[1]);
  
  return (
    <>
      <div className="bg-purple-200 text-black -mt-1 p-3 mb-2">
        <div className="flex items-center mb-2">
          <h2 className="text-2xl font-semibold mr-4">Your Current Stay</h2>
          {isValidCoords && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-base"
              style={{ marginLeft: "auto" }}
            >
              <MapIcon className="w-4 h-4 mr-1" />
              Maps
            </a>
          )}
        </div>
        {isInNoticePeriod && (
          <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded">
            <b>You are in notice period.</b>
            {noticePeriodStartDate && noticePeriodEndDate && (
                <span>
                {" "}
                (
                {new Date(noticePeriodStartDate).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).replace(/ /g, "/")}
                {" to "}
                {new Date(noticePeriodEndDate).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).replace(/ /g, "/")}
                )
                </span>
            )}
          </div>
        )}
        <span className="text-sm text-gray-700">
          {!isValidCoords && <>Location not available to navigate</>}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <strong>PG:</strong> {stay.propertyName}
            <br />
            <strong>Room:</strong> {stay.roomPpid}
            <br />
            <strong>Bed:</strong> {stay.bedId}
            <br />
            <strong>Deposit:</strong> ₹{stay.deposit}
            <br />
            <strong>Rent:</strong> ₹{stay.rent}
            <br />
            <strong>Advance Payment</strong>: ₹{stay.advanceBalance || 0}
            <br />
            <strong>Rent Due:</strong> ₹{stay.rentDue}
            <br />
            <strong>Rent Paid:</strong> ₹{stay.rentPaid}
            <br />
            <strong>Rent Status:</strong> {stay.rentPaidStatus}
            <br />
            <strong>Next Due Date:</strong> {stay.nextRentDueDate?.slice(0, 10)}
          </div>
        </div>
      </div>
    </>
  );
};
export default CurrentStayHeader;
