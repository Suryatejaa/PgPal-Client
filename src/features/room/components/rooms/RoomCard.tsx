import React, { useState } from "react";
import Modal from "../Modal";
import { useError } from "../../../../context/ErrorContext";
import axiosInstance from "../../../../services/axiosInstance";
import EditRoomForm from "./EditRoomForm";
import BedCard from "./BedCard";
import TenantDetailsModal from "./TenantDetailsModal";
import AddTenant from "../../../tenant/components/AddTenant";
import RemoveTenantForm from "../../../tenant/components/RemoveTenant";
import UpdateRentForm from "../UpdateRentForm";

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
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showRemoveTenant, setShowRemoveTenant] = useState(false);
  const [removeTenantBed, setRemoveTenantBed] = useState<any>(null);

  const [bedModal, setBedModal] = useState<{
    open: boolean;
    loading: boolean;
    data: any | null;
    error: string | null;
    bed?: any;
  }>({ open: false, loading: false, data: null, error: null, bed: null });

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

  const handleVacantBedClick = (bed: any) => {
    setBedModal({ open: true, loading: true, data: null, error: null, bed });
  };

  const handleOccupiedBedClick = async (bed: any) => {
    setBedModal({
      open: true,
      loading: true,
      data: null,
      error: null,
      bed: null,
    });
    try {
      const res = await axiosInstance.get(
        `/tenant-service/tenants?ppid=${bed.tenantPpt}`
      );
      console.log(res.data[0]);
      setBedModal({
        open: true,
        loading: false,
        data: res.data[0],
        error: null,
        bed,
      });
    } catch (err: any) {
      setBedModal({
        open: true,
        loading: false,
        data: null,
        error:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to fetch tenant details.",
        bed,
      });
    }
  };

  // Add this function to handle tenant removal
  const handleRemoveTenant = async (tenantId: string, data: any) => {
    try {
      const res = await axiosInstance.post(
        `/tenant-service/remove-tenant/${tenantId}`,
        data
      );
      console.log(res.data);
      setShowRemoveTenant(false);
      if (onRoomUpdated) onRoomUpdated();
      if (setAlert)
        setAlert({ message: "Tenant removed successfully!", type: "success" });
    } catch (err: any) {
      console.log(err);
      setError(
        err?.response?.data?.error || err?.error || "Failed to remove tenant."
      );
      if (setAlert)
        setAlert({
          message: err?.response?.data?.error || "Failed to remove tenant.",
          type: "error",
        });
    }
  };

  // Add this function to handle adding a tenant
  const handleAddTenant = async (data: any) => {
    try {
      const res = await axiosInstance.post("/tenant-service", data);
      console.log(res.data);
      setShowAddTenant(false);
      if (onRoomUpdated) onRoomUpdated();
      if (setAlert)
        setAlert({ message: "Tenant added successfully!", type: "success" });
    } catch (err: any) {
      console.log(err);
      setError(
        err?.response?.data?.error || err?.error || "Failed to add tenant."
      );
      if (setAlert)
        setAlert({
          message: err?.response?.data?.error || "Failed to add tenant.",
          type: "error",
        });
    }
  };

  // Add this state at the top of your component
  const [showUpdateRent, setShowUpdateRent] = useState(false);

  // Add this function to handle rent update
  const handleUpdateRent = async (data: any) => {
    try {
      const res = await axiosInstance.post("/rent-service/update", data);
      console.log(res);
      setShowUpdateRent(false);
      if (onRoomUpdated) onRoomUpdated();
      if (setAlert)
        setAlert({ message: "Rent updated successfully!", type: "success" });
    } catch (err: any) {
      console.log(err)
      if (setAlert) {
        setAlert({
          message: err?.response?.data?.error || "Failed to update rent.",
          type: "error",
        });
      }
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
          <BedCard
            key={idx}
            bed={bed}
            onVacantClick={handleVacantBedClick}
            onOccupiedClick={handleOccupiedBedClick}
          />
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

      {bedModal.open && bedModal.bed && bedModal.bed.status === "occupied" && (
        <Modal
          onClose={() =>
            setBedModal({
              open: false,
              bed: null,
              loading: true,
              data: null,
              error: null,
            })
          }
          readonly
        >
          <div>
            <div className="font-bold mb-2">Bed: {bedModal.bed.bedId}</div>
            <div>
              <span className="font-semibold">Name:</span> {bedModal.data.name}
            </div>
            <div>
              <span className="font-semibold">Phone:</span>{" "}
              {bedModal.data.phone}
            </div>
            <div>
              <span className="font-semibold">Aadhar:</span>{" "}
              {bedModal.data.aadhar}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              {bedModal.bed.tenantPpt}
            </div>
            <div>
              <span className="font-semibold">In Notice Period:</span>{" "}
              {bedModal.data.In_Notice_Period ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-semibold">Assigned At:</span>{" "}
              {bedModal.data.currentStay?.assignedAt
                ? new Date(
                    bedModal.data.currentStay.assignedAt
                  ).toLocaleString()
                : "N/A"}
            </div>
            {/* Add more tenant details as needed */}
            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setRemoveTenantBed(bedModal.bed); // <-- store the bed to remove
                setShowRemoveTenant(true);
                setBedModal({
                  open: false,
                  bed: null,
                  loading: true,
                  data: null,
                  error: null,
                });
              }}
            >
              Remove Tenant
            </button>
            <button
              className="mt-4 ml-2 bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowUpdateRent(true)}
            >
              Update Rent
            </button>
          </div>
        </Modal>
      )}
      {showRemoveTenant && (
        <Modal onClose={() => setShowRemoveTenant(false)}>
          <RemoveTenantForm
            onSubmit={(data: any) =>
              handleRemoveTenant(removeTenantBed.tenantPpt, data)
            }
            onCancel={() => setShowRemoveTenant(false)}
          />
        </Modal>
      )}
      {bedModal.open && bedModal.bed && bedModal.bed.status === "vacant" && (
        <Modal
          onClose={() =>
            setBedModal({
              open: false,
              bed: null,
              loading: true,
              data: null,
              error: null,
            })
          }
          readonly
        >
          <div>
            <div className="font-bold mb-2">Bed: {bedModal.bed.bedId}</div>
            <div>Status: Vacant</div>
            <button
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setShowAddTenant(true);
                setBedModal({
                  open: false,
                  bed: null,
                  loading: true,
                  data: null,
                  error: null,
                });
              }}
            >
              Assign Tenant
            </button>
          </div>
        </Modal>
      )}
      {showAddTenant && (
        <Modal onClose={() => setShowAddTenant(false)}>
          <AddTenant
            propertyId={room.propertyId}
            rooms={[room]} // Pass only this room for selection
            onSubmit={handleAddTenant}
            onCancel={() => setShowAddTenant(false)}
            defaultBedId={bedModal.bed?.bedId}
          />
        </Modal>
      )}
      {showUpdateRent && (
        <Modal onClose={() => setShowUpdateRent(false)}>
          <UpdateRentForm
            tenant={bedModal.data}
            onSubmit={handleUpdateRent}
            onCancel={() => setShowUpdateRent(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default RoomCard;
