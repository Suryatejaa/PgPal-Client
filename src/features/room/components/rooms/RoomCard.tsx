import React, { useState } from "react";
import Modal from "../Modal";
import { useError } from "../../../../context/ErrorContext";
import axiosInstance from "../../../../services/axiosInstance";
import EditRoomForm from "./EditRoomForm";
import BedCard from "./BedCard";
import TenantDetailsModal from "./TenantDetailsModal";


const RoomCard = ({
  room,
  onRoomUpdated,
  setAlert,
}: {
  room: any;
  onRoomUpdated?: () => void;
  setAlert?: (alert: {
    message: string;
    type?: "info" | "success" | "error";
  }) => void;
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const { setError } = useError();
  const [showConfirm, setShowConfirm] = useState(false);


  const [tenantModal, setTenantModal] = useState<{
    open: boolean;
    loading: boolean;
    data: any | null;
    error: string | null;
  }>({ open: false, loading: false, data: null, error: null });

  const handleEdit = async (data: any, params: string) => {
    let url = `/room-service/rooms/${room._id}`;
    if (params) url += `?${params}`;
    try {
      const res = await axiosInstance.put(url, data, { withCredentials: true });
      if (res.data?.error) {
        setError(res.data.error || "Failed to update room.");
        if (setAlert) setAlert({ message: res.data.error, type: "error" });
      } else {
        setShowEdit(false);
        if (onRoomUpdated) onRoomUpdated();
        if (setAlert)
          setAlert({ message: "Room updated successfully!", type: "success" }); // <-- ADD THIS
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to update room."
      );
      if (setAlert)
        setAlert({
          message: err?.response?.data?.error || "Failed to update room.",
          type: "error",
        });
    }
  };

  const handleDeleteRoom = async () => {
    setShowConfirm(false);
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axiosInstance.delete(`/room-service/rooms/${room._id}`);
      setShowEdit(false);
      if (onRoomUpdated) onRoomUpdated();
      if (setAlert)
        setAlert({ message: "Room deleted successfully!", type: "success" }); // <-- ADD THIS
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to delete room."
      );
      if (setAlert)
        setAlert({
          message: err?.response?.data?.error || "Failed to delete room.",
          type: "error",
        });
    }
  };

  const handleTenantClick = async (ppid: string) => {
    setTenantModal({ open: true, loading: true, data: null, error: null });
    try {
      const res = await axiosInstance.get(
        `/tenant-service/tenants?ppid=${ppid}`
      );
      setTenantModal({
        open: true,
        loading: false,
        data: res.data,
        error: null,
      });
    } catch (err: any) {
      setTenantModal({
        open: true,
        loading: false,
        data: null,
        error:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to fetch tenant details.",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-lg text-purple-800">
            Room {room.roomNumber}
          </div>
          <div className="text-gray-700">Floor: {room.floor}</div>
          <div className="text-gray-700">
            Rent/Bed:{" "}
            <span className="font-semibold text-green-700">
              ₹{room.rentPerBed}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">
            Beds: {room.beds?.length || 0}
          </span>
          <button
            className="mt-2 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200"
            onClick={() => setShowEdit(true)}
          >
            Edit
          </button>
        </div>
      </div>
      <div
        className={`mt-2 ${
          room.beds?.length > 2 ? "max-h-32 overflow-y-auto pr-1" : ""
        }`}
        style={{ minHeight: "2.5rem" }}
      >
        {room.beds?.map((bed: any, idx: number) => (
          <BedCard key={idx} bed={bed} onTenantClick={handleTenantClick} />
        ))}
      </div>
      {showEdit && (
        <Modal onClose={() => setShowEdit(false)}>
          <EditRoomForm
            room={room}
            onSubmit={handleEdit}
            onCancel={() => setShowEdit(false)}
            onDelete={handleDeleteRoom}
          />
        </Modal>
      )}
      {tenantModal.open && (
        <TenantDetailsModal
          tenantModal={tenantModal}
          onClose={() =>
            setTenantModal({
              open: false,
              loading: false,
              data: null,
              error: null,
            })
          }
        />
      )}
    </div>
  );
};

export default RoomCard;
