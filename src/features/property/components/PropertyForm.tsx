import React, { useState } from "react";

interface PropertyFormProps {
  initial?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const defaultForm = {
  name: "",
  contact: { phone: "", email: "" },
  address: { street: "", city: "", state: "", zip: "" },
  totalBeds: 0,
  totalRooms: 0,
  occupiedBeds: 0,
};

const PropertyForm: React.FC<PropertyFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(initial || defaultForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      setForm({
        ...form,
        contact: { ...form.contact, [name.split(".")[1]]: value },
      });
    } else if (name.startsWith("address.")) {
      setForm({
        ...form,
        address: { ...form.address, [name.split(".")[1]]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="PG Name"
        className="w-full p-2 rounded border"
      />
      <input
        name="contact.phone"
        value={form.contact.phone}
        onChange={handleChange}
        placeholder="Contact Phone"
        className="w-full p-2 rounded border"
      />
      <input
        name="contact.email"
        value={form.contact.email}
        onChange={handleChange}
        placeholder="Contact Email"
        className="w-full p-2 rounded border"
      />
      <input
        name="address.street"
        value={form.address.street}
        onChange={handleChange}
        placeholder="Street"
        className="w-full p-2 rounded border"
      />
      <input
        name="address.city"
        value={form.address.city}
        onChange={handleChange}
        placeholder="City"
        className="w-full p-2 rounded border"
      />
      <input
        name="address.state"
        value={form.address.state}
        onChange={handleChange}
        placeholder="State"
        className="w-full p-2 rounded border"
      />
      <input
        name="address.zip"
        value={form.address.zip}
        onChange={handleChange}
        placeholder="Zip"
        className="w-full p-2 rounded border"
      />
      <input
        name="totalBeds"
        value={form.totalBeds}
        onChange={handleChange}
        placeholder="Total Beds"
        type="number"
        className="w-full p-2 rounded border"
      />
      <input
        name="totalRooms"
        value={form.totalRooms}
        onChange={handleChange}
        placeholder="Total Rooms"
        type="number"
        className="w-full p-2 rounded border"
      />
      <input
        name="occupiedBeds"
        value={form.occupiedBeds}
        onChange={handleChange}
        placeholder="Occupied Beds"
        type="number"
        className="w-full p-2 rounded border"
      />
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PropertyForm;
