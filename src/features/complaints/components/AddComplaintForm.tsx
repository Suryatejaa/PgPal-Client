import React, { useState } from "react";

const COMPLAINT_TYPES = [
  "Electrical",
  "Plumbing",
  "Maintenance",
  "Internet",
  "Furniture",
  "Food",
  "Other",
];

const complaintsMap: Record<
  string,
  { name: string; responseTime: string; priority: string }
> = {
  Electrical: {
    name: "Electrical",
    responseTime: "24 hours",
    priority: "High",
  },
  Plumbing: { name: "Plumbing", responseTime: "24 hours", priority: "High" },
  Maintenance: {
    name: "Maintenance",
    responseTime: "48 hours",
    priority: "Medium",
  },
  Internet: { name: "Internet", responseTime: "24 hours", priority: "High" },
  Furniture: {
    name: "Furniture",
    responseTime: "48 hours",
    priority: "Medium",
  },
  Food: { name: "Food", responseTime: "24 hours", priority: "Medium" },
  Other: { name: "Other", responseTime: "N/A", priority: "Low" },
};

const COMPLAINT_ON = ["Bathroom", "Locker", "Room", "Kitchen", "Other"];

const AddComplaintForm = ({
  propertyId,
  onSubmit,
  onCancel,
}: {
  propertyId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const [complaintOn, setComplaintOn] = useState(COMPLAINT_ON[0]);
  const [complaintType, setComplaintType] = useState(COMPLAINT_TYPES[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const metadata = complaintsMap[complaintType];

  const handleSave = () => {
    if (!complaintOn || !complaintType || !description.trim()) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    onSubmit({
      propertyId,
      complaintOn,
      complaintType,
      complaintMetadata: metadata,
      description,
    });
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Raise Complaint</h3>
      <div className="flex flex-col gap-2">
        <label>
          Complaint On:
          <select
            className="border rounded px-2 py-1 ml-2"
            value={complaintOn}
            onChange={(e) => setComplaintOn(e.target.value)}
          >
            {COMPLAINT_ON.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label>
          Complaint Type:
          <select
            className="border rounded px-2 py-1 ml-2"
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
          >
            {COMPLAINT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <div className="text-xs text-gray-600 ml-1">
          <span>
            Priority: <b>{metadata.priority}</b>
          </span>
          <span className="ml-4">
            Response: <b>{metadata.responseTime}</b>
          </span>
        </div>
        <label>
          Description:
          <textarea
            className="border rounded px-2 py-1 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>
        {error && <div className="text-xs text-red-600">{error}</div>}
        <div className="flex gap-2 mt-2">
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded"
            onClick={handleSave}
            type="button"
          >
            Submit
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddComplaintForm;
