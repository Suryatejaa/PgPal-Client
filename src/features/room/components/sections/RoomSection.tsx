import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import RoomCard from "../rooms/RoomCard";
import AddRoomForm from "../rooms/AddRoomForm";
import axiosInstance from "../../../../services/axiosInstance";
import { useError } from "../../../../context/ErrorContext";
import GlobalAlert from "../../../../components/GlobalAlert"; // adjust path as needed
import ConfirmDilog from "../../../../components/ConfirmDialog"; // adjust path as needed


const RoomsSection = ({ property }: { property: any }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { setError } = useError();
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);
  const [search, setSearch] = useState(""); // <-- Add search state

  const typeBedCount: Record<string, number> = {
    single: 1,
    double: 2,
    triple: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
  };

  const typeOptions = React.useMemo(() => {
    const types = Array.from(new Set(rooms.map((room) => room.type)))
      .filter(Boolean)
      .sort((a, b) => (typeBedCount[a] ?? 99) - (typeBedCount[b] ?? 99)); // Sort by bed count
    return types.map((type) => ({
      key: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }, [rooms]);

  // Static filter options
  const staticFilterOptions = [
    { key: "all", label: "All" },
    { key: "occupied", label: "Fully Occupied" },
    { key: "vacant", label: "Fully Vacant" },
    { key: "partial", label: "Partially Occupied" },
  ];

  const filterOptions = [...staticFilterOptions, ...typeOptions];

  const filteredRooms = React.useMemo(() => {
    let filtered = rooms;
    if (filter === "occupied") {
      filtered = rooms.filter(
        (room) =>
          room.beds?.length > 0 &&
          room.beds.every((bed: any) => bed.status === "occupied")
      );
    } else if (filter === "vacant") {
      filtered = rooms.filter(
        (room) =>
          room.beds?.length > 0 &&
          room.beds.every((bed: any) => bed.status === "vacant")
      );
    } else if (filter === "partial") {
      filtered = rooms.filter(
        (room) =>
          room.beds?.length > 0 &&
          room.beds.some((bed: any) => bed.status === "occupied") &&
          room.beds.some((bed: any) => bed.status === "vacant")
      );
    } else if (filter !== "all") {
      filtered = rooms.filter((room) => room.type === filter);
    }
    // If filter matches a type
    const q = search.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter(
      (room) =>
        (room.roomNumber && String(room.roomNumber).toLowerCase().includes(q)) ||
        (room.pgpalId && room.pgpalId.toLowerCase().includes(q)) ||
        (room.beds &&
          room.beds.some(
            (bed: any) =>
              (bed.bedId && bed.bedId.toLowerCase().includes(q)) ||
              (bed.pgpalId && bed.pgpalId.toLowerCase().includes(q))
          ))
    );
  }, [rooms, filter, search]);
 
  
  // Fetch rooms function
  const fetchRooms = async () => {
    setError(null);
    if (property?._id) {
      try {
        const res = await axiosInstance.get(
          `/room-service/${property._id}/rooms`
        );
        setRooms(res.data.rooms || []);
      } catch (err: any) {
        const expected = "No rooms found";
        console.log(err?.response?.data?.error !== expected);
        if (err?.response?.data?.error !== expected) {
          setError(
            err?.response?.data?.error ||
              err?.message ||
              "Failed to fetch rooms."
          );
        }
        setRooms([]);
      }
    } else {
      setRooms([]);
    }
  };

  useEffect(() => {
    setRooms([]);
    fetchRooms();
    // eslint-disable-next-line
  }, [property?._id]);

  const handleAddRoom = async (roomData: any) => {
    setError(null);
    try {
      const res = await axiosInstance.post("/room-service/rooms", {
        propertyId: property._id,
        rooms: [roomData],
      });
      console.log(res);
      setShowForm(false);
      setAlert({ message: "Room added successfully!", type: "success" });
      await fetchRooms();
    } catch (err: any) {
      console.log(err.response.data.error);
      setError(
        err?.response?.data?.error || err?.message || "Failed to add room."
      );
    }
  };

  
  const groupedRooms = React.useMemo(() => {
    const groups: { [floor: string]: any[] } = {};
    filteredRooms.forEach((room) => {
      const floor = String(room.floor);
      if (!groups[floor]) groups[floor] = [];
      groups[floor].push(room);
    });
    Object.keys(groups).forEach((floor) => {
      groups[floor].sort((a, b) => Number(a.roomNumber) - Number(b.roomNumber));
    });
    return groups;
  }, [filteredRooms]);

  const getFilterCount = (key: string) => {
    if (key === "all") return rooms.length;
    if (key === "occupied") {
      return rooms.filter(
        (room) =>
          room.beds?.length > 0 &&
          room.beds.every((bed: any) => bed.status === "occupied")
      ).length;
    }
    if (key === "vacant") {
      return rooms.filter(
        (room) =>
          room.beds?.length > 0 &&
          room.beds.every((bed: any) => bed.status === "vacant")
      ).length;
    }
    if (key === "partial") {
      return rooms.filter(
        (room) =>
          room.beds?.length > 0 &&
          room.beds.some((bed: any) => bed.status === "occupied") &&
          room.beds.some((bed: any) => bed.status === "vacant")
      ).length;
    }
    // For type filters
    return rooms.filter((room) => room.type === key).length;
  };

  return (
    <div className="relative">
      {alert && (
        <GlobalAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      {rooms.length > 0 && (
        <button
          onClick={() => setShowForm(true)}
          className="absolute right-0 top-8 mt-12 bg-purple-600 text-white px-4 py-1 rounded font-semibold"
        >
          + Add Room
        </button>
      )}
      <div
        className="sticky z-20 flex overflow-x-auto text-sm -mt-1 pb-1 bg-purple-300 border-gray-200"
        style={{ top: 120 }} // Adjust this value to match the height of your section header bar
      >
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`px-3 py-2 whitespace-nowrap font-semibold transition focus:outline-none
              ${
                filter === opt.key
                  ? "bg-transparent text-black rounded-t-md rounded-b-none border-none"
                  : "bg-transparent text-indigo-700 hover:text-purple-700 border-none"
              }`}
          >
            {opt.label} ({getFilterCount(opt.key)})
          </button>
        ))}
      </div>
      <div
        className="sticky z-10 bg-white"
        style={{ top: 168 }} // adjust if needed to stick below filter bar
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by room number, bed ID, or room ID"
          className="w-full px-3 py-2 border  focus:outline-none"
        />
      </div>
      <div className="pt-1">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold mb-4"
              >
                + Add Room
              </button>
            )}
            <div className="text-gray-500">No rooms found. Add rooms.</div>
          </div>
        ) : (
          Object.keys(groupedRooms)
            .sort((a, b) => Number(a) - Number(b))
            .map((floor) => (
              <div key={floor}>
                <div className="font-bold text-lg mb-1 text-white-700">
                  Floor: {floor}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {groupedRooms[floor].map((room) => (
                    <RoomCard
                      key={room._id || room.roomNumber}
                      room={room}
                      onRoomUpdated={fetchRooms}
                      setAlert={setAlert}
                    />
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <AddRoomForm
            onSubmit={handleAddRoom}
            onCancel={() => setShowForm(false)}
            existingRooms={rooms}
          />
        </Modal>
      )}
    </div>
  );
};

export default RoomsSection;
