import React, { useState } from "react";

const defaultBed = { status: "vacant", tenant: null };

const AddRoomForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const [room, setRoom] = useState({
    roomNumber: "",
    floor: "",
    type: "double",
    rentPerBed: "",
    beds: [{ ...defaultBed }],
  });

  const handleBedChange = (idx: number, field: string, value: any) => {
    const beds = [...room.beds];
    if (field === "status") {
      beds[idx].status = value;
      if (value === "occupied") {
        beds[idx].tenant = {
          name: "",
          phone: "",
          propertyId: "",
          roomNumber: "",
          bedId: "",
          aadhar: "",
          deposit: "",
          noticePeriodInMonths: "",
          rentPaid: "",
          rentPaidMethod: "",
        };
      } else {
        beds[idx].tenant = null;
      }
    } else if (field.startsWith("tenant.")) {
      if (!beds[idx].tenant) return;
      beds[idx].tenant = { ...beds[idx].tenant, [field.split(".")[1]]: value };
    }
    setRoom({ ...room, beds });
  };

  const handleAddBed = () => {
    setRoom({ ...room, beds: [...room.beds, { ...defaultBed }] });
  };

  const handleRemoveBed = (idx: number) => {
    const beds = room.beds.filter((_, i) => i !== idx);
    setRoom({ ...room, beds });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...room,
      floor: Number(room.floor),
      rentPerBed: Number(room.rentPerBed),
      beds: room.beds.map((bed, idx) => ({
        ...bed,
        tenant:
          bed.status === "occupied"
            ? {
                ...bed.tenant,
                phone: bed.tenant.phone,
                aadhar: bed.tenant.aadhar,
                deposit: Number(bed.tenant.deposit),
                noticePeriodInMonths: Number(bed.tenant.noticePeriodInMonths),
                rentPaid: Number(bed.tenant.rentPaid),
              }
            : undefined,
      })),
    });
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input
        name="roomNumber"
        value={room.roomNumber}
        onChange={handleChange}
        placeholder="Room Number"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="floor"
        value={room.floor}
        onChange={handleChange}
        placeholder="Floor"
        type="number"
        className="w-full p-2 border rounded"
        required
      />
      <select
        name="type"
        value={room.type}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="single">Single</option>
        <option value="double">Double</option>
        <option value="tripple">Tripple</option>
        <option value="quad">Quad</option>
      </select>
      <input
        name="rentPerBed"
        value={room.rentPerBed}
        onChange={handleChange}
        placeholder="Rent Per Bed"
        type="number"
        className="w-full p-2 border rounded"
        required
      />

      <div>
        <div className="font-semibold mb-1">Beds</div>
        {room.beds.map((bed, idx) => (
          <div key={idx} className="border p-2 mb-2 rounded bg-gray-50">
            <div className="flex items-center space-x-2">
              <select
                value={bed.status}
                onChange={(e) => handleBedChange(idx, "status", e.target.value)}
                className="p-1 border rounded"
              >
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveBed(idx)}
                className="text-red-500 text-xs"
              >
                Remove
              </button>
            </div>
            {bed.status === "occupied" && bed.tenant && (
              <div className="mt-2 space-y-1">
                <input
                  value={bed.tenant.name}
                  onChange={(e) =>
                    handleBedChange(idx, "tenant.name", e.target.value)
                  }
                  placeholder="Tenant Name"
                  className="w-full p-1 border rounded"
                  required
                />
                <input
                  value={bed.tenant.phone}
                  onChange={(e) =>
                    handleBedChange(idx, "tenant.phone", e.target.value)
                  }
                  placeholder="Tenant Phone"
                  className="w-full p-1 border rounded"
                  required
                />
                <input
                  value={bed.tenant.aadhar}
                  onChange={(e) =>
                    handleBedChange(idx, "tenant.aadhar", e.target.value)
                  }
                  placeholder="Aadhar"
                  className="w-full p-1 border rounded"
                  required
                />
                <input
                  value={bed.tenant.deposit}
                  onChange={(e) =>
                    handleBedChange(idx, "tenant.deposit", e.target.value)
                  }
                  placeholder="Deposit"
                  type="number"
                  className="w-full p-1 border rounded"
                  required
                />
                <input
                  value={bed.tenant.noticePeriodInMonths}
                  onChange={(e) =>
                    handleBedChange(
                      idx,
                      "tenant.noticePeriodInMonths",
                      e.target.value
                    )
                  }
                  placeholder="Notice Period (months)"
                  type="number"
                  className="w-full p-1 border rounded"
                  required
                />
                <input
                  value={bed.tenant.rentPaid}
                  onChange={(e) =>
                    handleBedChange(idx, "tenant.rentPaid", e.target.value)
                  }
                  placeholder="Rent Paid"
                  type="number"
                  className="w-full p-1 border rounded"
                  required
                />
                <input
                  value={bed.tenant.rentPaidMethod || ""}
                  onChange={(e) =>
                    handleBedChange(
                      idx,
                      "tenant.rentPaidMethod",
                      e.target.value
                    )
                  }
                  placeholder="Rent Paid Method"
                  className="w-full p-1 border rounded"
                />
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddBed}
          className="text-blue-600 text-xs mt-1"
        >
          + Add Bed
        </button>
      </div>
      <div className="flex justify-end space-x-2 pt-2">
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
    </form>
  );
};

export default AddRoomForm;
