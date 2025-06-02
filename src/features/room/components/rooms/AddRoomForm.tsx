import React, { useState } from "react";
import { useError } from "../../../../context/ErrorContext";

const typeOptions = [
  { value: "single", label: "Single", beds: 1 },
  { value: "double", label: "Double", beds: 2 },
  { value: "tripple", label: "Triple", beds: 3 },
  { value: "four", label: "Four", beds: 4 },
  { value: "five", label: "Five", beds: 5 },
  { value: "six", label: "Six", beds: 6 },
  { value: "seven", label: "Seven", beds: 7 },
  { value: "eight", label: "Eight", beds: 8 },
];

type Tenant = {
  name: string;
  phone: string;
  propertyId: string;
  roomNumber: string;
  bedId: string;
  aadhar: string;
  deposit: string;
  noticePeriodInMonths: string;
  rentPaid: string;
  rentPaidMethod: string;
};

type Bed = {
  status: "vacant" | "occupied";
  tenant: Tenant | undefined;
};

type Room = {
  roomNumber: string;
  floor: string;
  type: string;
  rentPerBed: string;
  beds: Bed[];
};

const defaultTenant: Tenant = {
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

const defaultBed: Bed = { status: "vacant", tenant: undefined };

const AddRoomForm = ({
  onSubmit,
  onCancel,
  existingRooms = [],
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  existingRooms?: { roomNumber: string; floor: string | number }[];
}) => {
  const { setError } = useError();
  const [room, setRoom] = useState<Room>({
    roomNumber: "",
    floor: "",
    type: "double",
    rentPerBed: "",
    beds: [{ ...defaultBed }, { ...defaultBed }],
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Get max beds for selected type
  const maxBeds = typeOptions.find((t) => t.value === room.type)?.beds || 2;

  // Validation logic
  const isDuplicateRoom =
    !!room.roomNumber &&
    !!room.floor &&
    existingRooms.some(
      (r) =>
        String(r.roomNumber) === String(room.roomNumber) &&
        String(r.floor) === String(room.floor)
    );

  const isBedCountInvalid = room.beds.length !== maxBeds;

  React.useEffect(() => {
    if (isBedCountInvalid) {
      setFormError(`Beds must be exactly ${maxBeds} for type "${room.type}".`);
    } else if (isDuplicateRoom) {
      setFormError(
        `Room number ${room.roomNumber} already exists on floor ${room.floor}.`
      );
    } else {
      setFormError(null);
    }
  }, [
    isBedCountInvalid,
    isDuplicateRoom,
    maxBeds,
    room.type,
    room.roomNumber,
    room.floor,
  ]);

  const isInvalid =
    !room.roomNumber ||
    !room.floor ||
    !room.rentPerBed ||
    isDuplicateRoom ||
    isBedCountInvalid;

  // Prevent adding more beds than allowed by type
  const handleAddBed = () => {
    if (room.beds.length >= maxBeds) return;
    setRoom({ ...room, beds: [...room.beds, { ...defaultBed }] });
  };

  const handleRemoveBed = (idx: number) => {
    const beds = room.beds.filter((_, i) => i !== idx);
    setRoom({ ...room, beds });
    setFormError(null);
  };

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
        beds[idx].tenant = undefined;
      }
    } else if (field.startsWith("tenant.")) {
      if (!beds[idx].tenant) return;
      beds[idx].tenant = { ...beds[idx].tenant, [field.split(".")[1]]: value };
    }
    setRoom({ ...room, beds });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;
    if (name === "type") {
      const bedsCount = typeOptions.find((t) => t.value === value)?.beds || 2;
      setRoom({
        ...room,
        type: value,
        beds: Array.from({ length: bedsCount }, () => ({ ...defaultBed })),
      });
    } else {
      setRoom({ ...room, [name]: value });
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for duplicate room number on same floor just before submit
    const duplicate = existingRooms.some(
      (r) =>
        String(r.roomNumber) === String(room.roomNumber) &&
        String(r.floor) === String(room.floor)
    );
    if (duplicate) {
      setFormError(
        `Room number ${room.roomNumber} already exists on floor ${room.floor}.`
      );
      return;
    }

    // Check for bed count again
    if (room.beds.length !== maxBeds) {
      setFormError(`Beds must be exactly ${maxBeds} for type "${room.type}".`);
      return;
    }
    onSubmit({
      ...room,
      floor: Number(room.floor),
      rentPerBed: Number(room.rentPerBed),
      beds: room.beds.map((bed) => ({
        ...bed,
        tenant:
          bed.status === "occupied"
            ? {
                ...bed.tenant,
                phone: bed.tenant?.phone ?? "",
                aadhar: bed.tenant?.aadhar ?? "",
                deposit: Number(bed.tenant?.deposit ?? 0),
                noticePeriodInMonths: Number(
                  bed.tenant?.noticePeriodInMonths ?? 0
                ),
                rentPaid: Number(bed.tenant?.rentPaid ?? 0),
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
        className={`w-full p-2 border rounded ${
          isDuplicateRoom ? "border-red-500" : ""
        }`}
        required
      />
      {isDuplicateRoom && (
        <div className="text-red-600 text-xs mt-1">
          Room number {room.roomNumber} already exists on floor {room.floor}.
        </div>
      )}
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
        {typeOptions.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
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
        <div className="font-semibold mb-1">
          Beds ({room.beds.length}/{maxBeds})
        </div>
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
                disabled={room.beds.length <= 1}
              >
                Remove
              </button>
            </div>
            {bed.status === "occupied" && bed.tenant && (
              <div className="mt-2 space-y-1">
                {/* ...tenant fields as before... */}
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
          disabled={room.beds.length >= maxBeds}
        >
          + Add Bed
        </button>
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="submit"
          className={`bg-purple-600 text-white px-4 py-2 rounded transition 
            ${isInvalid || !!formError ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isInvalid || !!formError}
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
