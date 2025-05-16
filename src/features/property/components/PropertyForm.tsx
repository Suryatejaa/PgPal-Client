import React, { useState } from "react";
import { useAppSelector } from "../../../app/hooks";

interface PropertyFormProps {
  initial?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const defaultForm = {
  name: "",
  contact: { phone: "", email: "", website: "" },
  address: {
    plotNumber: "",
    line1: "",
    line2: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  },
  totalBeds: "",
  totalRooms: "",
  occupiedBeds: "",
};

const PropertyForm: React.FC<PropertyFormProps> = ({
  initial,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState(initial || defaultForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?._id;

  const validate = (fieldValues = form) => {
    const temp: { [key: string]: string } = {};

    if (!fieldValues.name) temp.name = "Name is required";
    // At least one contact method
    if (
      !fieldValues.contact.phone &&
      !fieldValues.contact.email &&
      !fieldValues.contact.website
    )
      temp.contact = "At least one contact method is required";
    if (!fieldValues.address.plotNumber)
      temp.plotNumber = "Plot Number is required";
    if (!fieldValues.address.street) temp.street = "Street is required";
    if (!fieldValues.address.city) temp.city = "City is required";
    if (!fieldValues.address.state) temp.state = "State is required";
    if (!fieldValues.address.country) temp.country = "Country is required";
    if (!fieldValues.address.zipCode) temp.zipCode = "Zip Code is required";
    if (!fieldValues.totalRooms) temp.totalRooms = "Total Rooms is required";
    if (!fieldValues.totalBeds) temp.totalBeds = "Total Beds is required";
    if (!fieldValues.occupiedBeds)
      temp.occupiedBeds = "Occupied Beds is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedForm = { ...form };

    if (name.startsWith("contact.")) {
      updatedForm = {
        ...form,
        contact: { ...form.contact, [name.split(".")[1]]: value },
      };
    } else if (name.startsWith("address.")) {
      updatedForm = {
        ...form,
        address: { ...form.address, [name.split(".")[1]]: value },
      };
    } else {
      updatedForm = { ...form, [name]: value };
    }
    setForm(updatedForm);
    validate(updatedForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
     
      const {
        name,
        contact,
        address,
        totalRooms,
        totalBeds,
        occupiedBeds,
        // Add other fields if you want
      } = form;
  
      // Calculate availableBeds if not present
      const available = form.availableBeds !== ""
        ? Number(form.availableBeds)
        : Number(totalBeds) - Number(occupiedBeds);
  
      const payload = {        
        name,
        contact,
        address,
        totalRooms: Number(totalRooms),
        totalBeds: Number(totalBeds),
        occupiedBeds: Number(occupiedBeds),        
      };
      onSubmit(payload);
    }
  };

  React.useEffect(() => {
    validate(form);
    // eslint-disable-next-line
  }, []);

  return (
    <form
      className="space-y-2 w-full max-w-sm mx-auto bg-gray-50 text-gray-800 rounded-lg p-4"
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="PG Name"
        className="w-full p-2 rounded border"
      />
      {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}

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
        name="contact.website"
        value={form.contact.website}
        onChange={handleChange}
        placeholder="Contact Website"
        className="w-full p-2 rounded border"
      />
      {errors.contact && (
        <div className="text-red-500 text-xs">{errors.contact}</div>
      )}

      <input
        name="address.plotNumber"
        value={form.address.plotNumber}
        onChange={handleChange}
        placeholder="Plot Number"
        className="w-full p-2 rounded border"
      />
      {errors.plotNumber && (
        <div className="text-red-500 text-xs">{errors.plotNumber}</div>
      )}

      <input
        name="address.line1"
        value={form.address.line1}
        onChange={handleChange}
        placeholder="Address Line 1"
        className="w-full p-2 rounded border"
      />
      <input
        name="address.line2"
        value={form.address.line2}
        onChange={handleChange}
        placeholder="Address Line 2"
        className="w-full p-2 rounded border"
      />

      <input
        name="address.street"
        value={form.address.street}
        onChange={handleChange}
        placeholder="Street"
        className="w-full p-2 rounded border"
      />
      {errors.street && (
        <div className="text-red-500 text-xs">{errors.street}</div>
      )}

      <input
        name="address.city"
        value={form.address.city}
        onChange={handleChange}
        placeholder="City"
        className="w-full p-2 rounded border"
      />
      {errors.city && <div className="text-red-500 text-xs">{errors.city}</div>}

      <input
        name="address.state"
        value={form.address.state}
        onChange={handleChange}
        placeholder="State"
        className="w-full p-2 rounded border"
      />
      {errors.state && (
        <div className="text-red-500 text-xs">{errors.state}</div>
      )}

      <input
        name="address.country"
        value={form.address.country}
        onChange={handleChange}
        placeholder="Country"
        className="w-full p-2 rounded border"
      />
      {errors.country && (
        <div className="text-red-500 text-xs">{errors.country}</div>
      )}

      <input
        name="address.zipCode"
        value={form.address.zipCode}
        onChange={handleChange}
        placeholder="Zip Code"
        className="w-full p-2 rounded border"
      />
      {errors.zipCode && (
        <div className="text-red-500 text-xs">{errors.zipCode}</div>
      )}

      <input
        name="totalBeds"
        value={form.totalBeds}
        onChange={handleChange}
        placeholder="Total Beds"
        type="number"
        className="w-full p-2 rounded border"
      />
      {errors.totalBeds && (
        <div className="text-red-500 text-xs">{errors.totalBeds}</div>
      )}

      <input
        name="totalRooms"
        value={form.totalRooms}
        onChange={handleChange}
        placeholder="Total Rooms"
        type="number"
        className="w-full p-2 rounded border"
      />
      {errors.totalRooms && (
        <div className="text-red-500 text-xs">{errors.totalRooms}</div>
      )}

      <input
        name="occupiedBeds"
        value={form.occupiedBeds}
        onChange={handleChange}
        placeholder="Occupied Beds"
        type="number"
        className="w-full p-2 rounded border"
      />
      {errors.occupiedBeds && (
        <div className="text-red-500 text-xs">{errors.occupiedBeds}</div>
      )}

      <div className="flex space-x-2 justify-end pt-2">
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={Object.keys(errors).length > 0}
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
