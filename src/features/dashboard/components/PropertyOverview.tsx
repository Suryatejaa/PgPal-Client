import React, { useEffect, useState } from "react";
import { getOverview } from "../services/dashboardService";
import axiosInstance from "../../../services/axiosInstance";
import {
  SparklesIcon,
  UserGroupIcon,
  HomeModernIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const cardStyles =
  "rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 bg-white hover:scale-105 transition-transform duration-200 border-2 border-transparent hover:border-purple-300";
const labelStyles =
  "text-xs uppercase tracking-wider font-bold mt-2 mb-1 text-gray-500";
const valueStyles = "text-3xl font-extrabold mb-1";
const iconStyles = "w-8 h-8 mb-2";

const COLORS = ["#a78bfa", "#f472b6", "#facc15", "#f87171", "#34d399"];

const PropertyOverview: React.FC<{ pgpalId: string; id: string }> = ({
  pgpalId,
  id,
}) => {
  const [overview, setOverview] = useState<any>(null);
  const [rentSummary, setRentSummary] = useState<any>(null);
  const [defaulters, setDefaulters] = useState<any>(null);
  const [occupancyData, setOccupancyData] = useState<
    { month: string; occupancy: number }[]
  >([]);

  const occupancyPercent = Number(overview?.occupancy.replace("%", "")) || 0;

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

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/property-service/${id}/occupancy-trend`)
        .then((res) => {
          // Transform "Dec 2024" => "Dec-24"
          const formatted = (res.data || []).map((item: any) => {
            const [month, year] = item.month.split(" ");
            return {
              ...item,
              month: `${month}-${year.slice(-2)}`,
            };
          });
          setOccupancyData(formatted);
        })
        .catch(() => setOccupancyData([]));
    }
  }, [id]);

  if (!overview || !rentSummary || !defaulters)
    return (
      <div className="flex items-center justify-center h-40 text-purple-600 font-bold animate-pulse">
        Loading analytics...
      </div>
    );

  // Analytics values
  const paidCount = rentSummary.tenants.filter(
    (t: any) => t.rentStatus === "paid"
  ).length;
  const unpaidCount = rentSummary.tenants.filter(
    (t: any) => t.rentStatus === "unpaid"
  ).length;
  const totalDue = rentSummary.tenants.reduce(
    (sum: number, t: any) => sum + (t.rentDue || 0),
    0
  );

  // Pie chart data for rent status
  const rentStatusData = [
    { name: "Paid", value: paidCount },
    { name: "Unpaid", value: unpaidCount },
  ];

  // Bar chart data for occupancy over months (dummy data, replace with real if available)

  return (
    <div className="w-full max-w-6xl mx-auto my-8">
      <div className="mb-6 flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-purple-500 animate-bounce" />
        <h2 className="text-3xl mb-1 md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 text-transparent bg-clip-text tracking-tight">
          PG Analytics Overview
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
        {/* Rent Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-purple-100">
          <h3 className="text-lg font-bold mb-4 text-purple-700 flex items-center gap-2">
            <CheckCircleIcon className="w-6 h-6 text-green-400" />
            Rent Status
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={rentStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {rentStatusData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-purple-400"></span>{" "}
              Paid
            </span>
            <span className="flex items-center gap-1 text-red-500 text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-pink-400"></span>{" "}
              Unpaid
            </span>
          </div>
        </div>
        {/* Occupancy Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-purple-100">
          <h3 className="text-lg font-bold mb-4 text-blue-700 flex items-center gap-2">
            <UserGroupIcon className="w-6 h-6 text-blue-400" />
            Occupancy Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupancy" fill="#a78bfa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 mt-4 md:grid-cols-4 gap-4">
        <div
          className={
            cardStyles + " bg-gradient-to-br from-violet-200 to-purple-100"
          }
        >
          <UserGroupIcon className={iconStyles + " text-purple-500"} />
          <div className={valueStyles + " text-purple-700"}>
            {overview.tenants.activeTenants}
          </div>
          <div className={labelStyles}>Active Tenants</div>
        </div>
        <div
          className={
            cardStyles + " bg-gradient-to-br from-indigo-100 to-blue-50"
          }
        >
          <HomeModernIcon className={iconStyles + " text-indigo-500"} />
          <div className={valueStyles + " text-indigo-700"}>
            {overview.rooms.count}
          </div>
          <div className={labelStyles}>Rooms</div>
        </div>
        <div
          className={
            cardStyles + " bg-gradient-to-br from-green-100 to-teal-50"
          }
        >
          <HomeModernIcon className={iconStyles + " text-green-500"} />
          <div className={valueStyles + " text-green-700"}>
            {overview.totalBeds}
          </div>
          <div className={labelStyles}>Total Beds</div>
        </div>
        <div
          className={
            cardStyles + " bg-gradient-to-br from-yellow-100 to-orange-50"
          }
        >
          <HomeModernIcon className={iconStyles + " text-yellow-500"} />
          <div className={valueStyles + " text-yellow-700"}>
            {overview.occupiedBeds}
          </div>
          <div className={labelStyles}>Occupied Beds</div>
        </div>
        <div
          className={
            cardStyles + " bg-gradient-to-br from-pink-100 to-fuchsia-50"
          }
        >
          <SparklesIcon className={iconStyles + " text-pink-500"} />
          <div className={valueStyles + " text-pink-700"}>
            {overview.occupancy}
          </div>
          <div className={labelStyles}>Occupancy</div>
        </div>
        <div
          className={
            cardStyles + " bg-gradient-to-br from-green-100 to-lime-50"
          }
        >
          <CheckCircleIcon className={iconStyles + " text-green-600"} />
          <div className={valueStyles + " text-green-700"}>{paidCount}</div>
          <div className={labelStyles}>Paid Tenants</div>
        </div>
        <div
          className={cardStyles + " bg-gradient-to-br from-red-100 to-pink-50"}
        >
          <XCircleIcon className={iconStyles + " text-red-500"} />
          <div className={valueStyles + " text-red-700"}>{unpaidCount}</div>
          <div className={labelStyles}>Unpaid Tenants</div>
        </div>
        <div
          className={cardStyles + " bg-gradient-to-br from-blue-100 to-cyan-50"}
        >
          <CurrencyRupeeIcon className={iconStyles + " text-blue-500"} />
          <div className={valueStyles + " text-blue-700"}>
            ₹{totalDue.toLocaleString()}
          </div>
          <div className={labelStyles}>Total Rent Due</div>
        </div>
      </div>

      {/* Charts Section */}

      {/* Fun progress bar for occupancy */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-purple-700">
            Occupancy
          </span>
          <span className="text-xs text-gray-500">{overview.occupancy}</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 via-pink-400 to-blue-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${occupancyPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PropertyOverview;
