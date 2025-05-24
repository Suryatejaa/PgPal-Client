import React from "react";

const StayHistory = ({ history }: { history: any[] }) => (
  <div>
    <div className="font-bold text-lg mb-2">Stay History</div>
    {history.length === 0 ? (
      <div>No stay history found.</div>
    ) : (
      <table className="min-w-full bg-white rounded shadow mt-2">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left">PG ID</th>
            <th className="px-3 py-2 text-left">Room</th>
            <th className="px-3 py-2 text-left">Bed</th>
            <th className="px-3 py-2 text-left">From</th>
            <th className="px-3 py-2 text-left">To</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h._id}>
              <td className="px-3 py-1">{h.propertyId}</td>
              <td className="px-3 py-1">{h.roomId}</td>
              <td className="px-3 py-1">{h.bedId}</td>
              <td className="px-3 py-1">{h.from?.slice(0, 10)}</td>
              <td className="px-3 py-1">{h.to?.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default StayHistory;
