import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../../services/axiosInstance";
import { defaultTenant, typeOptions } from "../../../types/roomTypes";
import type {
  Floor,
  ValidationErrors,
  QuickSetup,
  ValidationErrorKey,
} from "../../../types/roomTypes";
import {
  duplicateRoom,
  updateRoom,
  updateBed,
  removeRoom,
  validateFloors,
  generateRooms,
} from "../../../utils/bulkRoomUtils";
import { useRoomValidation } from "./useRoomValidation";
import GlobalAlert from "../../../../../components/GlobalAlert";
import QuickSetupForm from "./QuickSetupForm";
import FloorsList from "./FloorsList";

interface Props {
  onSubmit?: (data: any) => void;
  onSuccess?: () => void;
  propertyId: string;
  existingRooms?: { roomNumber: string; floor: string }[];
  onClose?: () => void;
}

const defaultQuickSetup: QuickSetup = {
  startRoom: "",
  endRoom: "",
  floorNumber: "1",
  type: "double",
  rentPerBed: "",
  defaultStatus: "vacant",
  defaultTenantTemplate: { ...defaultTenant },
};

const BulkRoomForm: React.FC<Props> = ({
  onSubmit,
  propertyId,
  onSuccess,
  existingRooms = [],
  onClose,
}) => {
  const [floors, setFloors] = useState<Floor[]>([
    { floorNumber: "1", rooms: [] },
  ]);
  const [expandedFloors, setExpandedFloors] = useState<{
    [key: string]: boolean;
  }>({ "1": true });
  const [showQuickSetup, setShowQuickSetup] = useState(true);
  const [quickSetup, setQuickSetup] = useState<QuickSetup>(defaultQuickSetup);
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const {
    validationErrors,
    setValidationErrors,
    validateQuickSetup,
    validateRequiredFields,
    clearFieldError,
  } = useRoomValidation(floors, existingRooms);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFieldErrors = validateRequiredFields(floors);
    if (Object.keys(requiredFieldErrors).length > 0) {
      setValidationErrors((prev) => ({ ...prev, ...requiredFieldErrors }));
      setAlert({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    const roomsData = floors.flatMap((floor) =>
      floor.rooms.map((room) => ({
        roomNumber: room.roomNumber,
        floor: floor.floorNumber,
        type: room.type,
        rentPerBed: Number(room.rentPerBed),
        beds: room.beds.map((bed) => ({
          status: bed.status,
          tenant:
            bed.status === "occupied" && bed.tenant
              ? {
                  name: bed.tenant.name,
                  phone: bed.tenant.phone,
                  aadhar: bed.tenant.aadhar,
                  deposit: Number(bed.tenant.deposit),
                  noticePeriodInDays: Number(bed.tenant.noticePeriodInDays),
                  rentPaid: Number(bed.tenant.rentPaid),
                  rentPaidMethod: bed.tenant.rentPaidMethod || "cash",
                }
              : undefined,
        })),
      }))
    );

    try {
      const res = await axiosInstance.post("/room-service/rooms/bulk-create", {
        propertyId,
        rooms: roomsData,
      });

      if (onSuccess) {
        onSuccess();
      } else if (onSubmit) {
        onSubmit(roomsData);
      }
      setAlert({ type: "success", message: "Rooms added successfully!" });
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.error || "Failed to add rooms";
      setAlert({ type: "error", message: errorMessage });
      setValidationErrors((prev) => ({ ...prev, submit: errorMessage }));
    }
  };

  const handleGenerateRooms = () => {
    const quickSetupErrors = validateQuickSetup(quickSetup);
    if (Object.keys(quickSetupErrors).length > 0) {
      setValidationErrors((prev) => ({ ...prev, ...quickSetupErrors }));
      return;
    }

    setValidationErrors({});

    const result = generateRooms(quickSetup, floors);
    if (result.error) {
      setValidationErrors((prev) => ({
        ...prev,
        submit: result.error ?? null,
      }));
      return;
    }

    setFloors(result.floors);
    setShowQuickSetup(false);
    setValidationErrors({});
  };

  const handleQuickSetupChange = (
    field: keyof QuickSetup,
    value: string | any
  ) => {
    setQuickSetup((prev) => ({ ...prev, [field]: value }));
    // Clear related validation errors
    if (field === "startRoom" || field === "endRoom") {
      setValidationErrors((prev) => {
        const { quickSetup, startRoom, endRoom, ...rest } = prev;
        return rest;
      });
    } else {
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleRoomUpdate = (
    floorIdx: number,
    roomIdx: number,
    field: string,
    value: string
  ) => {
    setFloors((prevFloors) => {
      const updatedFloors = updateRoom(
        prevFloors,
        floorIdx,
        roomIdx,
        field as any,
        value
      );
      return updatedFloors;
    });

    clearFieldError(floorIdx, roomIdx, field);
  };

  const handleBedUpdate = (
    floorIdx: number,
    roomIdx: number,
    bedIdx: number,
    field: string,
    value: string
  ) => {
    setFloors(updateBed(floors, floorIdx, roomIdx, bedIdx, field, value));

    // Clear the specific field error when user types
    if (field.startsWith("tenant.")) {
      const tenantField = field.replace("tenant.", "");
      const errorKey = `${floorIdx}-${roomIdx}-${bedIdx}-tenant${
        tenantField.charAt(0).toUpperCase() + tenantField.slice(1)
      }`;
      clearFieldError(floorIdx, roomIdx, field, bedIdx);
    } else {
      clearFieldError(floorIdx, roomIdx, field, bedIdx);
    }
  };

  const handleDuplicateRoom = (floorIdx: number, roomIdx: number) => {
    setFloors(duplicateRoom(floors, floorIdx, roomIdx));
  };

  const handleRemoveRoom = (floorIdx: number, roomIdx: number) => {
    setFloors(removeRoom(floors, floorIdx, roomIdx));
  };

  const handleAddRoom = (floorIdx: number) => {
    const newFloors = [...floors];
    newFloors[floorIdx].rooms.push({
      roomNumber: "",
      type: "double",
      rentPerBed: "",
      beds: [{ status: "vacant", tenant: undefined }],
    });
    setFloors(newFloors);
  };

  const toggleFloor = (floorNumber: string) => {
    setExpandedFloors((prev) => ({
      ...prev,
      [floorNumber]: !prev[floorNumber],
    }));
  };

  const hasErrors =
    Object.keys(validationErrors).length > 0 ||
    Object.keys(validateRequiredFields(floors)).length > 0;

  return (
    <div className="p-1">
      {alert && (
        <GlobalAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold">Add Bulk Rooms</h2>
        <button
          onClick={onClose}
          className="text-gray-500 bg-transparent hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {showQuickSetup ? (
        <QuickSetupForm
          quickSetup={quickSetup}
          validationErrors={validationErrors}
          onQuickSetupChange={handleQuickSetupChange}
          onGenerateRooms={handleGenerateRooms}
          onClose={onClose}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowQuickSetup(true)}
              className="text-blue-500 hover:text-blue-600 bg-transparent text-sm font-semibold"
            >
              ← Back
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 bg-transparent text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`bg-blue-700 border-2 border-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-semibold ${
                  hasErrors ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={hasErrors}
              >
                Save All Rooms
              </button>
            </div>
          </div>

          <FloorsList
            floors={floors}
            expandedFloors={expandedFloors}
            validationErrors={validationErrors}
            onToggleFloor={toggleFloor}
            onRoomUpdate={handleRoomUpdate}
            onBedUpdate={handleBedUpdate}
            onDuplicateRoom={handleDuplicateRoom}
            onRemoveRoom={handleRemoveRoom}
            onAddRoom={handleAddRoom}
          />
        </>
      )}
    </div>
  );
};

export default BulkRoomForm;
