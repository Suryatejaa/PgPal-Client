import React, { useEffect, useState } from "react";
import {
  getCheckins,
  getVacates,
} from "../../../dashboard/services/dashboardService";

const periods = ["day", "week", "month"];

const PropertyStats: React.FC<{ pgpalId: string }> = ({ pgpalId }) => {
  const [period, setPeriod] = useState("day");
  const [checkins, setCheckins] = useState<number | null>(null);
  const [vacates, setVacates] = useState<number | null>(null);

  useEffect(() => {
    if (pgpalId) {
      getCheckins(pgpalId, period).then((res) =>
        setCheckins(res.data.checkins)
      );
      getVacates(pgpalId, period).then((res) => setVacates(res.data.vacates));
    }
  }, [pgpalId, period]);

  return (
    <div className="my-6">
      <div className="flex items-center space-x-4 mb-2">
        <span className="font-semibold">Period:</span>
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded ${
              period === p
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-100 rounded-xl p-4 shadow text-center">
          <div className="text-xl font-bold text-blue-700">
            {checkins ?? "..."}
          </div>
          <div className="text-gray-700">Check-ins ({period})</div>
        </div>
        <div className="bg-red-100 rounded-xl p-4 shadow text-center">
          <div className="text-xl font-bold text-red-700">
            {vacates ?? "..."}
          </div>
          <div className="text-gray-700">Vacates ({period})</div>
        </div>
      </div>
    </div>
  );
};

export default PropertyStats;
