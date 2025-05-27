import React, { useState } from "react";

const UpdateRentForm = ({ tenant, onSubmit, onCancel }: any) => {
  const [rentPaid, setRentPaid] = useState("");
  const [rentPaidDate, setRentPaidDate] = useState("");
  const [rentPaidMethod, setRentPaidMethod] = useState("cash");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          await onSubmit({
            tenantId: tenant.pgpalId,
            rentPaid: Number(rentPaid),
            rentPaidDate,
            rentPaidMethod,
            transactionId,
          });
        } finally {
          setLoading(false);
        }
      }}
      className="flex flex-col gap-3"
    >
      <div>
        <label className="block text-sm font-medium">Amount Paid</label>
        <input
          type="number"
          value={rentPaid}
          onChange={(e) => setRentPaid(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Paid Date</label>
        <input
          type="date"
          value={rentPaidDate}
          onChange={(e) => setRentPaidDate(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Payment Method</label>
        <select
          value={rentPaidMethod}
          onChange={(e) => setRentPaidMethod(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="bank">Bank</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">
          Transaction ID (optional)
        </label>
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update Rent"}
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-700 px-4 py-1 rounded"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UpdateRentForm;
