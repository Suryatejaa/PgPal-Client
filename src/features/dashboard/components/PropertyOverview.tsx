import React, { useEffect, useState } from "react";
import { getOverview } from "../services/dashboardService";

const PropertyOverview: React.FC<{ pgpalId: string }> = ({ pgpalId }) => {
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    if (pgpalId) {
      getOverview(pgpalId).then((res) => setOverview(res.data));
    }
  }, [pgpalId]);

  if (!overview) return <div>Loading overview...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-4">
      <div className="bg-purple-100 rounded-xl p-4 shadow text-center">
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
    </div>
  );
};

export default PropertyOverview;
