import React, { useState, useEffect } from "react";

const defaultTenant = {
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

const AddTenant = ({
  propertyId,
  rooms = [],
  onSubmit,
  onCancel,
  defaultBedId,
}: {
  propertyId: string;
  rooms: {
    roomNumber: string | number;
    beds: { bedId: string; status: string }[];
  }[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  defaultBedId?: string;
}) => {
  const [tenant, setTenant] = useState({ ...defaultTenant, propertyId });
  const [formError, setFormError] = useState<string | null>(null);

  // Room and bed selection helpers
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [availableBeds, setAvailableBeds] = useState<
    { bedId: string; status: string }[]
  >([]);

  useEffect(() => {
    // If only one room is passed, auto-select it
    if (rooms.length === 1) {
      setSelectedRoom(String(rooms[0].roomNumber));
    }
  }, [rooms]);

  useEffect(() => {
    if (selectedRoom) {
      const room = rooms.find(
        (r) => String(r.roomNumber) === String(selectedRoom)
      );
      setAvailableBeds(
        room ? room.beds.filter((b) => b.status === "vacant") : []
      );
      setTenant((prev) => ({
        ...prev,
        roomNumber: selectedRoom,
        bedId: defaultBedId && prev.bedId === "" ? defaultBedId : prev.bedId,
      }));
    } else {
      setAvailableBeds([]);
      setTenant((prev) => ({
        ...prev,
        roomNumber: "",
        bedId: "",
      }));
    }
    // eslint-disable-next-line
  }, [selectedRoom, rooms, defaultBedId]);

  // Validation
  useEffect(() => {
    if (!tenant.name) setFormError("Name is required.");
    else if (!tenant.phone) setFormError("Phone is required.");
    else if (!tenant.propertyId) setFormError("Property ID is required.");
    else if (!tenant.roomNumber) setFormError("Room Number is required.");
    else if (!tenant.bedId) setFormError("Bed is required.");
    else if (!tenant.aadhar) setFormError("Aadhar is required.");
    else if (tenant.deposit === "" || tenant.deposit === null)
      setFormError("Deposit is required.");
    else if (
      tenant.noticePeriodInMonths === "" ||
      tenant.noticePeriodInMonths === null
    )
      setFormError("Notice period is required.");
    else if (
      tenant.rentPaid !== "" &&
      tenant.rentPaid !== "0" &&
      !tenant.rentPaidMethod
    )
      setFormError("Rent paid method is required if rent is paid.");
    else setFormError(null);
  }, [tenant]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTenant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formError) return;
    onSubmit({
      ...tenant,
      deposit: Number(tenant.deposit),
      noticePeriodInMonths: Number(tenant.noticePeriodInMonths),
      rentPaid: Number(tenant.rentPaid),
      phone: String(tenant.phone),
      aadhar: String(tenant.aadhar),
    });
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input
        name="name"
        value={tenant.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="phone"
        type="text"
        maxLength={10}
        pattern="\d*"
        value={tenant.phone}
        onChange={handleChange}
        onInput={(e) => {
          const input = e.target as HTMLInputElement;
          input.value = input.value.replace(/\D/g, "");
        }}
        placeholder="Phone"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="aadhar"
        type="text"
        maxLength={12}
        pattern="\d*"
        value={tenant.aadhar}
        onChange={handleChange}
        onInput={(e) => {
          const input = e.target as HTMLInputElement;
          input.value = input.value.replace(/\D/g, "");
        }}
        placeholder="Aadhar"
        className="w-full p-2 border rounded"
        required
      />
      <select
        name="roomNumber"
        value={selectedRoom}
        onChange={(e) => setSelectedRoom(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Room</option>
        {rooms.map((room) => (
          <option key={room.roomNumber} value={room.roomNumber}>
            {room.roomNumber}
          </option>
        ))}
      </select>
      <select
        name="bedId"
        value={tenant.bedId}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
        disabled={!selectedRoom && !defaultBedId}
      >
        <option value="">Select Bed</option>
        {availableBeds.map((bed) => (
          <option key={bed.bedId} value={bed.bedId}>
            {bed.bedId}
          </option>
        ))}
      </select>
      <input
        name="deposit"
        value={tenant.deposit}
        onChange={handleChange}
        placeholder="Deposit"
        type="number"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="noticePeriodInMonths"
        value={tenant.noticePeriodInMonths}
        onChange={handleChange}
        placeholder="Notice Period (months)"
        type="number"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="rentPaid"
        value={tenant.rentPaid}
        onChange={handleChange}
        placeholder="Rent Paid"
        type="number"
        className="w-full p-2 border rounded"
      />
      {tenant.rentPaid !== "" && tenant.rentPaid !== "0" && (
        <select
          name="rentPaidMethod"
          value={tenant.rentPaidMethod}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Rent Paid Method</option>
          <option value="upi">UPI</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
        </select>
      )}
      {formError && (
        <div className="text-red-600 text-xs mt-1">{formError}</div>
      )}
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="submit"
          className={`bg-purple-600 text-white px-4 py-2 rounded transition 
            ${formError ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!!formError}
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

export default AddTenant;
