import React, { useState } from "react";

const STATUS_OPTIONS = [
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Closed", label: "Closed" },
];

const ComplaintActionForm = ({
  complaint,
  onSubmit,
  onCancel,
  loading,
  userId,
  allowClose,
}: {
  complaint: any;
  onSubmit: (data: { status: string; notes?: any }) => void;
  onCancel: () => void;
  loading?: boolean;
  userId: string;
  allowClose?: boolean;
}) => {
  const [status, setStatus] = useState("In Progress");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const handleSave = () => {
    if (!status) {
      setError("Please select a status.");
      return;
    }
    if (status === "Resolved" && !notes.trim()) {
      setError("Notes are required when resolving a complaint.");
      return;
    }
    setError(null);
    onSubmit({ status, notes: { message: notes.trim(), by: userId } });
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Take Action on Complaint</h3>
      <div className="flex flex-col gap-2">
        <label>
          Status:
          <select
            className="border rounded px-2 py-1 ml-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
          >
            {STATUS_OPTIONS
              .filter((opt) => allowClose ? opt.value !== "Rejected" : opt.value !== "Closed")
              .map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Notes:
          <textarea
            className="border rounded px-2 py-1 w-full"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add notes (required for Resolved)"
            disabled={loading}
          />
        </label>
        {error && <div className="text-xs text-red-600">{error}</div>}
        <div className="flex gap-2 mt-2">
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded"
            onClick={handleSave}
            type="button"
            disabled={loading}
          >
            Submit
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
            onClick={onCancel}
            type="button"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintActionForm;
