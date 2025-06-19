import React, { useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import ConfirmDialog from "../../../components/ConfirmDialog";

interface PropertyFormProps {
  initial?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  onDelete?: (data: any) => void;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
  pgGenderType: "",
  rentRange: { min: "", max: "" },
  depositRange: { min: "", max: "" },
  location: { lat: "", lng: "" },
};

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position.lat && position.lng ? (
    <Marker position={[position.lat, position.lng]} icon={customMarkerIcon} />
  ) : null;
}

function MapController({ position }: { position: any }) {
  const map = useMap();
  React.useEffect(() => {
    if (position && map) {
      map.setView([position.lat, position.lng], 15);
    }
  }, [position?.lat, position?.lng, map]);
  return null;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  initial,
  onSubmit,
  onCancel,
  onDelete,
  mode,
}) => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user's current location on mount
  React.useEffect(() => {
    if (!userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          () => {
            setUserLocation({ lat: 17.385, lng: 78.4867 }); // fallback to Hyderabad
          }
        );
      } else {
        setUserLocation({ lat: 17.385, lng: 78.4867 }); // fallback
      }
    }
  }, [userLocation]);

  // Add these states for search
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmCheckboxChecked, setConfirmCheckboxChecked] = useState(false);

  const [form, setForm] = useState(() => {
    const base = initial || defaultForm;

    // Handle location properly for edit mode
    let location = { lat: "", lng: "" };
    if (base.location) {
      // If location has coordinates array (from MongoDB Point format)
      if (
        base.location.coordinates &&
        Array.isArray(base.location.coordinates)
      ) {
        location = {
          lng: base.location.coordinates[0],
          lat: base.location.coordinates[1],
        };
      }
      // If location already has lat/lng properties
      else if (base.location.lat && base.location.lng) {
        location = {
          lat: base.location.lat,
          lng: base.location.lng,
        };
      }
    }

    return {
      ...defaultForm,
      ...base,
      rentRange: { ...defaultForm.rentRange, ...(base.rentRange || {}) },
      depositRange: {
        ...defaultForm.depositRange,
        ...(base.depositRange || {}),
      },
      contact: { ...defaultForm.contact, ...(base.contact || {}) },
      address: { ...defaultForm.address, ...(base.address || {}) },
      location,
    };
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showMap, setShowMap] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); // Fixed: renamed and proper logic
  const user = useAppSelector((state) => state.auth.user);

  const validate = (fieldValues = form) => {
    const temp: { [key: string]: string } = {};

    if (!fieldValues.name) temp.name = "Name is required";
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
    if (!fieldValues.pgGenderType)
      temp.pgGenderType = "PG Gender Type is required";
    if (!fieldValues.rentRange?.min) temp.rentRangeMin = "Min rent is required";
    if (!fieldValues.rentRange?.max) temp.rentRangeMax = "Max rent is required";
    if (!fieldValues.depositRange?.min)
      temp.depositRangeMin = "Min deposit is required";
    if (!fieldValues.depositRange?.max)
      temp.depositRangeMax = "Max deposit is required";

    // Only require location if it's not already set (for edit mode)
    if (
      (!fieldValues.location?.lat || !fieldValues.location?.lng) &&
      !(initial?.location?.coordinates || initial?.location?.lat)
    ) {
      temp.location = "Location is required";
    }

    setErrors(temp);
    const isValid = Object.keys(temp).length === 0;
    //console.log("Validation errors:", temp);
    //console.log("Form is valid:", isValid);
    //console.log("Current location:", fieldValues.location);
    //console.log("Initial location:", initial?.location);
    setIsFormValid(isValid);
    return isValid;
  };

  const handleDeleteProperty = () => {
    setConfirmDialogOpen(true);
  };

  const handleSearch = async () => {
    if (!search) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setForm((prev: any) => ({
          ...prev,
          location: { lat: Number(lat), lng: Number(lon) },
        }));
      } else {
        alert("Location not found.");
      }
    } catch {
      alert("Error searching location.");
    }
    setSearching(false);
  };

  // Run validation whenever form changes
  React.useEffect(() => {
    validate(form);
  }, [form]);

  // Initial validation on mount
  React.useEffect(() => {
    validate(form);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    } else if (name.startsWith("rentRange.")) {
      updatedForm = {
        ...form,
        rentRange: { ...form.rentRange, [name.split(".")[1]]: value },
      };
    } else if (name.startsWith("depositRange.")) {
      updatedForm = {
        ...form,
        depositRange: { ...form.depositRange, [name.split(".")[1]]: value },
      };
    } else {
      updatedForm = { ...form, [name]: value };
    }
    setForm(updatedForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const {
        name,
        contact,
        address,
        pgGenderType,
        rentRange,
        depositRange,
        location,
      } = form;

      if (
        typeof form.location.lat === "number" &&
        typeof form.location.lng === "number" &&
        !isNaN(form.location.lat) &&
        !isNaN(form.location.lng)
      ) {
        const payload = {
          name,
          contact,
          address,
          pgGenderType,
          rentRange: {
            min: Number(rentRange.min),
            max: Number(rentRange.max),
          },
          depositRange: {
            min: Number(depositRange.min),
            max: Number(depositRange.max),
          },
          location: {
            type: "Point",
            coordinates: [Number(form.location.lng), Number(form.location.lat)],
          },
        };
        onSubmit(payload);
      }
    }
  };

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
        type="tel"
        maxLength={15}
      />
      <input
        name="contact.email"
        value={form.contact.email}
        onChange={handleChange}
        placeholder="Contact Email"
        className="w-full p-2 rounded border"
        type="email"
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

      <select
        name="pgGenderType"
        value={form.pgGenderType}
        onChange={handleChange}
        className="w-full p-2 rounded border"
        required
      >
        <option value="">Select PG Gender Type</option>
        <option value="gents">Gents</option>
        <option value="ladies">Ladies</option>
        <option value="colive">Colive</option>
      </select>
      {errors.pgGenderType && (
        <div className="text-red-500 text-xs">{errors.pgGenderType}</div>
      )}

      <div className="flex gap-2">
        <input
          name="rentRange.min"
          value={form.rentRange.min}
          onChange={handleChange}
          placeholder="Min Rent"
          type="number"
          className="w-1/2 p-2 rounded border"
          min={0}
        />
        <input
          name="rentRange.max"
          value={form.rentRange.max}
          onChange={handleChange}
          placeholder="Max Rent"
          type="number"
          className="w-1/2 p-2 rounded border"
          min={0}
        />
      </div>
      {(errors.rentRangeMin || errors.rentRangeMax) && (
        <div className="text-red-500 text-xs">
          {errors.rentRangeMin || errors.rentRangeMax}
        </div>
      )}

      <div className="flex gap-2">
        <input
          name="depositRange.min"
          value={form.depositRange.min}
          onChange={handleChange}
          placeholder="Min Deposit"
          type="number"
          className="w-1/2 p-2 rounded border"
          min={0}
        />
        <input
          name="depositRange.max"
          value={form.depositRange.max}
          onChange={handleChange}
          placeholder="Max Deposit"
          type="number"
          className="w-1/2 p-2 rounded border"
          min={0}
        />
      </div>
      {(errors.depositRangeMin || errors.depositRangeMax) && (
        <div className="text-red-500 text-xs">
          {errors.depositRangeMin || errors.depositRangeMax}
        </div>
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
        maxLength={6}
        min={0}
      />
      {errors.zipCode && (
        <div className="text-red-500 text-xs">{errors.zipCode}</div>
      )}

      {/* Map Picker */}
      <div>
        <button
          type="button"
          className="bg-blue-600 text-white px-3 py-1 rounded mb-2"
          onClick={() => setShowMap((v) => !v)}
        >
          {form.location.lat && form.location.lng
            ? "Update Location"
            : "Set Location"}
        </button>
        {showMap && (
          <div className="mb-2 relative">
            {/* Search bar */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                placeholder="Search location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={handleSearch}
                disabled={searching}
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>
            <MapContainer
              center={[
                form.location.lat || userLocation?.lat || 17.385,
                form.location.lng || userLocation?.lng || 78.4867,
              ]}
              zoom={13}
              style={{ height: 300, width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker
                position={
                  form.location && form.location.lat && form.location.lng
                    ? form.location
                    : userLocation
                }
                setPosition={(pos: any) =>
                  setForm((prev: any) => ({
                    ...prev,
                    location: { lat: Number(pos.lat), lng: Number(pos.lng) },
                  }))
                }
              />
              <MapController
                position={
                  form.location.lat && form.location.lng
                    ? form.location
                    : userLocation
                }
              />
            </MapContainer>
            {/* Use my location button */}
            {userLocation && (
              <button
                type="button"
                className="absolute bottom-4 right-4 z-[1000] bg-white rounded-full shadow-lg p-2 border border-purple-300 hover:bg-purple-100 transition"
                title="Use my current location"
                onClick={() =>
                  setForm((prev: any) => ({
                    ...prev,
                    location: userLocation,
                  }))
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="4" fill="#3b82f6" />
                  <path
                    stroke="#3b82f6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.42 1.42M6.34 17.66l-1.42 1.42m12.02 0l-1.42-1.42M6.34 6.34L4.92 4.92"
                  />
                </svg>
              </button>
            )}
            {form.location.lat && form.location.lng && (
              <div className="text-xs mt-1">
                Lat: {form.location.lat}, Lng: {form.location.lng}
              </div>
            )}
            {errors.location && (
              <div className="text-red-500 text-xs">{errors.location}</div>
            )}
          </div>
        )}
      </div>

      <div className="flex space-x-2 justify-end pt-2">
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!isFormValid} // Fixed: now properly enables when form is valid
          // onClick={() =>
          //   console.log("Button clicked, isFormValid:", isFormValid)
          // }
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
        {mode === "edit" && onDelete && (
          <button
            type="button"
            onClick={handleDeleteProperty}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        )}
        <ConfirmDialog
          open={confirmDialogOpen}
          title="Delete Property"
          message={
            <>
              <p className="text-red-600 font-bold">
                Warning: Deleting this property is irreversible and will remove
                all associated data.
              </p>
              <p className="text-gray-700">
                Please confirm that you understand the consequences by checking
                the box below.
              </p>
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={confirmCheckboxChecked}
                    onChange={(e) =>
                      setConfirmCheckboxChecked(e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    I understand the consequences of deleting this property.
                  </span>
                </label>
              </div>
            </>
          }
          onConfirm={() => {
            if (!confirmCheckboxChecked) {
              alert("Please check the confirmation box before proceeding.");
              return; // Prevent further execution
            }

            if (onDelete && initial?._id) {
              onDelete(initial._id); // Execute deletion only if checkbox is checked
            }
            setConfirmDialogOpen(false); // Close the dialog
          }}
          onCancel={() => setConfirmDialogOpen(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </form>
  );
};

export default PropertyForm;
