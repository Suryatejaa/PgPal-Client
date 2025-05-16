import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import RoomCard from "../rooms/RoomCard";
import AddRoomForm from "../rooms/AddRoomForm";
import axiosInstance from "../../../../services/axiosInstance";

const RoomsSection = ({ property }: { property: any }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (property?._id) {
      axiosInstance
        .get(`/room-service/${property._id}/rooms`)
        .then((res) => setRooms(res.data.rooms || []));
    }
  }, [property?._id]);

  const handleAddRoom = async (roomData: any) => {
    await axiosInstance.post("/room-service/rooms", {
      propertyId: property._id,
      rooms: [roomData],
    });
    setShowForm(false);
    // Refresh rooms
      const res = await axiosInstance.get(`/room-service/${property._id}/rooms`);
      console.log(res.data)
    setRooms(res.data.rooms || []);
  };

  if (!rooms.length) {
    return (
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
        {showForm && (
          <Modal onClose={() => setShowForm(false)}>
            <AddRoomForm
              onSubmit={handleAddRoom}
              onCancel={() => setShowForm(false)}
            />
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowForm(true)}
        className="absolute right-0 top-0 bg-purple-600 text-white px-4 py-2 rounded font-semibold"
      >
        + Add Room
      </button>
      <div className="pt-12">
              {rooms.map((room) => (            
          <RoomCard key={room._id || room.roomNumber} room={room} />
        ))}
      </div>
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <AddRoomForm
            onSubmit={handleAddRoom}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default RoomsSection;
