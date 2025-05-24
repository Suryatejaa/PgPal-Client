import React, { useEffect, useState } from "react";
import { getOverview } from "../services/dashboardService";
import axiosInstance from "../../../services/axiosInstance";

const PropertyOverview: React.FC<{ pgpalId: string }> = ({ pgpalId }) => {
  const [overview, setOverview] = useState<any>(null);
  const [rentSummary, setRentSummary] = useState<any>(null);
  const [defaulters, setDefaulters] = useState<any>(null);

  useEffect(() => {
    if (pgpalId) {
      getOverview(pgpalId).then((res) => setOverview(res.data));
      axiosInstance
        .get(`/rent-service/${pgpalId}/summary`)
        .then((res) => setRentSummary(res.data));
      axiosInstance
        .get(`/rent-service/${pgpalId}/defaulters`)
        .then((res) => setDefaulters(res.data));
    }
  }, [pgpalId]);

  if (!overview || !rentSummary || !defaulters)
    return <div>Loading overview...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-4">
      <div className="bg-violet-200 rounded-xl p-4 shadow text-center">
        <div className="text-2xl font-bold text-purple-700">
          {overview.tenants.activeTenants}
        </div>
        <div className="text-gray-700">Active Tenants</div>
      </div>
      <div className="bg-indigo-100 rounded-xl p-4 shadow text-center">
        <div className="text-2xl font-bold text-indigo-700">
          {overview.rooms.count}
        </div>
        <div className="text-gray-700">Rooms</div>
      </div>
      <div className="bg-green-100 rounded-xl p-4 shadow text-center">
        <div className="text-2xl font-bold text-green-700">
          {overview.totalBeds}
        </div>
        <div className="text-gray-700">Total Beds</div>
      </div>
      <div className="bg-yellow-100 rounded-xl p-4 shadow text-center">
        <div className="text-2xl font-bold text-yellow-700">
          {overview.occupiedBeds}
        </div>
        <div className="text-gray-700">Occupied Beds</div>
      </div>
      <div className="bg-pink-100 rounded-xl p-4 shadow text-center">
        <div className="text-2xl font-bold text-pink-700">
          {overview.occupancy}
        </div>
        <div className="text-gray-700">Occupancy</div>
      </div>
      <div className="bg-red-100 rounded-xl p-4 shadow text-center">
        <div className="text-2xl font-bold text-green-800">
          {
            rentSummary.tenants.filter((t: any) => t.rentStatus === "paid")
              .length
          }
        </div>
        <div className="text-gray-700">Paid Tenants</div>
      </div>
      <div className="bg-orange-100 rounded-xl p-4 shadow text-center">
        <div className="text-2xl font-bold text-orange-700">
          {
            rentSummary.tenants.filter((t: any) => t.rentStatus === "unpaid")
              .length
          }
        </div>
        <div className="text-gray-700">Unpaid Tenants</div>
      </div>
      <div className="bg-blue-100 rounded-xl p-4 shadow text-center">
        <div className="text-2xl font-bold text-blue-700">
          ₹
          {rentSummary.tenants.reduce(
            (sum: number, t: any) => sum + (t.rentDue || 0),
            0
          )}
        </div>
        <div className="text-gray-700">Total Rent Due</div>
      </div>
    </div>
  );
};

export default PropertyOverview;
