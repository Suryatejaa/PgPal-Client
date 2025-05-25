import React from "react";

const StayHistory = ({ history }: { history: any[] }) => (
  <div className="relative bg-purple-200 -mt-1 z-10 rounded-b -xl shadow-lg p-4 border border-purple-200">
    <div className="font-bold text-2xl mb-4 text-purple-800 flex items-center gap-2">
      <svg
        className="w-6 h-6 text-purple-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Stay History
    </div>
    {history.length === 0 ? (
      <div className="text-gray-500 text-center py-8">
        No stay history found.
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border border-purple-100">
          <thead>
            <tr className="bg-purple-100 text-purple-800">
              <th className="px-4 py-3 text-left rounded-tl-lg">PG ID</th>
              <th className="px-4 py-3 text-left">Room</th>
              <th className="px-4 py-3 text-left">Bed</th>
              <th className="px-4 py-3 text-left">From</th>
              <th className="px-4 py-3 text-left rounded-tr-lg">To</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, idx) => (
              <tr
                key={h._id}
                className={idx % 2 === 0 ? "bg-purple-50" : "bg-white"}
              >
                <td className="px-4 py-2 font-semibold">{h.propertyId}</td>
                <td className="px-4 py-2">{h.roomId}</td>
                <td className="px-4 py-2">{h.bedId}</td>
                <td className="px-4 py-2">
                  {h.from ? new Date(h.from).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-2">
                  {h.to ? new Date(h.to).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default StayHistory;
