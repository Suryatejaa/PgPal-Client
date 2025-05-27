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
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row sm:flex-row items-center justify-start gap-2 mb-4 w-full max-w-6xl">
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
      <div className="flex flex-row sm:flex-row justify-center items-center gap-6 w-full max-w-6xl">
        <div className="flex-1 bg-blue-100 rounded-xl p-4 shadow text-center min-w-[180px]">
          <div className="text-xl font-bold text-blue-700">
            {checkins ?? "..."}
          </div>
          <div className="text-gray-700">Check-ins ({period})</div>
        </div>
        <div className="flex-1 bg-red-100 rounded-xl p-4 shadow text-center min-w-[180px]">
          <div className="text-2xl font-bold text-red-700">
            {vacates ?? "..."}
          </div>
          <div className="text-gray-700">Vacates ({period})</div>
        </div>
      </div>
    </div>
  );
};

export default PropertyStats;
