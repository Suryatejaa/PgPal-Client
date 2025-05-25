import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import GlobalAlert from "../../../../components/GlobalAlert";

const validAmenities = [
  "Wifi",
  "Parking",
  "Pool",
  "Gym",
  "Air Conditioning",
  "Hotwater",
  "Kitchen",
  "Laundry",
  "Tv",
  "Pet Friendly",
  "Breakfast",
  "Smoke Free",
  "Family Friendly",
  "Room Service",
  "Airport Shuttle",
  "Concierge Service",
  "24-Hour Front Desk",
  "Meeting Rooms",
  "Event Space",
  "Outdoor Space",
  "Garden",
  "Balcony",
  "Terrace",
  "Lift",
  "Lunch",
  "Dinner",
  "Pharmacy",
];

const AmenitiesSection = ({ propertyId }: { propertyId: string }) => {
  const [amenities, setAmenities] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);

  const fetchAmenities = async () => {
    try {
      const res = await axiosInstance.get(
        `/property-service/${propertyId}/amenities`
      );
      setAmenities(res.data);
      setSelected([]); // clear selection after fetch
    } catch {
      setAlert({ message: "Failed to fetch amenities", type: "error" });
    }
  };

  useEffect(() => {
    fetchAmenities();
    // eslint-disable-next-line
  }, [propertyId]);

  // Only show amenities that are not already added
  const normalize = (s: string) => s.trim().toLowerCase();
  const normalizedAmenities = amenities.map(normalize);

  const availableAmenities = validAmenities.filter(
    (a) => !normalizedAmenities.includes(normalize(a))
  );

  const handleSelect = (amenity: string) => {
    setSelected((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected.length) return;
    try {
      const res = await axiosInstance.post(
        `/property-service/${propertyId}/amenities`,
        {
          amenities: selected,
        }
      );
      console.log(res);
      setAlert({ message: "Amenities added!", type: "success" });
      fetchAmenities();
    } catch (err: any) {
      console.log(err.response.data.error);
      setAlert({ message: "Failed to add amenities", type: "error" });
    }
  };

  const handleDelete = async (amenity: string) => {
    try {
      await axiosInstance.delete(`/property-service/${propertyId}/amenities`, {
        data: { amenities: [amenity] },
      });
      setAlert({ message: "Amenity deleted!", type: "success" });
      fetchAmenities();
    } catch {
      setAlert({ message: "Failed to delete amenity", type: "error" });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-4 text-black">
      {alert && <GlobalAlert {...alert} onClose={() => setAlert(null)} />}
      <div className="font-bold text-purple-700 mb-2">Amenities</div>
      <div className="flex flex-wrap gap-2">
        {amenities.map((a) => (
          <span
            key={a}
            className="bg-purple-100 text-purple-800 px-1  rounded flex items-center"
          >
            {a}
            <button
              className=" bg-transparent text-s py-1 px-1 text-red-600 hover:text-red-800"
              onClick={() => handleDelete(a)}
              title="Delete"
              type="button"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="text-sm text-gray-500 mt-2 border-b-4 mb-2 border-purple-800"></div>
      <form onSubmit={handleAdd} className="mb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {availableAmenities.length === 0 && (
            <span className="text-gray-400 text-sm">All amenities added.</span>
          )}
          {availableAmenities.map((a) => (
            <label
              key={a}
              className={`flex items-center text-s bg-gray-100 px-2 py-1 rounded cursor-pointer ${
                selected.includes(a)
                  ? "bg-purple-200 border border-purple-400"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(a)}
                onChange={() => handleSelect(a)}
                className="mr-1"
              />
              {a}
            </label>
          ))}
        </div>
        <button
          className="bg-purple-600 text-white px-3 py-1 rounded"
          type="submit"
          disabled={selected.length === 0}
        >
          Add Selected
        </button>
      </form>
    </div>
  );
};

export default AmenitiesSection;
