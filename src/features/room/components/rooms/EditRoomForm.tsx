import React, { useState } from "react";
import { useError } from "../../../../context/ErrorContext";
import ConfirmDialog from "../../../../components/ConfirmDialog";

const EditRoomForm = ({
  room,
  onSubmit,
  onCancel,
  onDelete,
}: {
  room: any;
  onSubmit: (data: any, params: string) => void;
  onCancel: () => void;
  onDelete: () => void;
}) => {
  const { setError } = useError();
  const [form, setForm] = useState({
    roomNumber: room.roomNumber,
    floor: room.floor,
    rentPerBed: room.rentPerBed,
    add: "",
    remove: [] as string[],
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleRemoveChange = (bedId: string) => {
    setForm((prev) => ({
      ...prev,
      remove: prev.remove.includes(bedId)
        ? prev.remove.filter((id) => id !== bedId)
        : [...prev.remove, bedId],
    }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addNum = Number(form.add) || 0;
    const existingBeds = room.beds?.length || 0;
    if (addNum + existingBeds > 8) {
      setError(
        `Cannot have more than 8 beds in a room. You have ${existingBeds}, trying to add ${addNum}.`
      );
      return;
    }
    let params = "";
    if (form.add) params += `add=${form.add}`;
    if (form.remove.length)
      params +=
        (params ? "&" : "") + form.remove.map((id) => `remove=${id}`).join("&");

    onSubmit(
      {
        roomNumber: form.roomNumber,
        floor: Number(form.floor),
        rentPerBed: Number(form.rentPerBed),
      },
      params
    );
  };

  const removableBeds = (room.beds || []).filter(
    (bed: any) => bed.status !== "occupied"
  );
  const allBedsVacant = (room.beds || []).every(
    (bed: any) => bed.status === "vacant"
  );

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input
        name="roomNumber"
        value={form.roomNumber}
        onChange={handleChange}
        placeholder="Room Number"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="floor"
        value={form.floor}
        onChange={handleChange}
        placeholder="Floor"
        type="number"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="rentPerBed"
        value={form.rentPerBed}
        onChange={handleChange}
        placeholder="Rent Per Bed"
        type="number"
        className="w-full p-2 border rounded"
        required
      />

      {/* Add beds */}
      <div>
        <label className="block font-medium">Add Beds (optional)</label>
        <input
          name="add"
          value={form.add === undefined || form.add === null ? "" : form.add}
          onChange={handleChange}
          placeholder="Number to add"
          type="number"
          min={0}
          max={8 - (room.beds?.length || 0)}
          className="w-full p-2 border rounded"
        />
        <span className="text-xs text-gray-500">
          Max beds allowed: 8. Current: {room.beds?.length || 0}
        </span>
      </div>

      {/* Remove beds */}
      <div>
        <label className="block font-medium mb-1">Remove Beds (optional)</label>
        <div className="flex flex-wrap gap-2">
          {removableBeds.length === 0 && (
            <span className="text-xs text-gray-400">
              No vacant beds to remove
            </span>
          )}
          {removableBeds.map((bed: any) => (
            <label
              key={bed.bedId}
              className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded"
            >
              <input
                type="checkbox"
                checked={form.remove.includes(bed.bedId)}
                onChange={() => handleRemoveChange(bed.bedId)}
                className="mr-1"
              />
              {bed.bedId}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <div>
          <button
            type="button"
            className={`bg-red-600 text-white px-4 py-2 rounded ${
              !allBedsVacant ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setShowConfirm(true)}
            disabled={!allBedsVacant}
          >
            Delete
          </button>
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        onConfirm={() => {
          setShowConfirm(false);
          onDelete();
        }}
        onCancel={() => setShowConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </form>
  );
};

export default EditRoomForm;
