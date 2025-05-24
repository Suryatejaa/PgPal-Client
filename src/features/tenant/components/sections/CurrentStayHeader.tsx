import React from "react";
import { MapIcon } from "@heroicons/react/24/outline";

const CurrentStayHeader = ({
  stay,
  hasCoords,
  lat,
  lng,
}: {
  stay: any;
  hasCoords: boolean;
  lat: number;
  lng: number;
}) => (
  <>
    <div className="bg-purple-200 text-black -mt-1 p-3 mb-2">
      <div className="flex items-center mb-2">
        <h2 className="text-2xl font-semibold mr-4">Your Current Stay</h2>
        {hasCoords && (
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
      <span className="text-sm text-gray-700">
        {!hasCoords && <>Location not available to navigate</>}
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
          <strong>Advance Payment</strong>: ₹{stay.advanceBalance}
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

export default CurrentStayHeader;
