import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import { defaultTenant, typeOptions } from "../../types/roomTypes";
import type {
  Floor,
  ValidationErrors,
  QuickSetup,
  ValidationErrorKey,
} from "../../types/roomTypes";
import {
  duplicateRoom,
  updateRoom,
  updateBed,
  removeRoom,
  validateFloors,
  generateRooms,
} from "../../utils/bulkRoomUtils";
import GlobalAlert from "../../../../components/GlobalAlert";

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
  defaultTenantTemplate: {
    ...defaultTenant,
  },
};

const BulkRoomForm: React.FC<Props> = ({
  onSubmit,
  propertyId,
  onSuccess,
  existingRooms = [],
  onClose,
}) => {
  const [floors, setFloors] = useState<Floor[]>([
    {
      floorNumber: "1",
      rooms: [],
    },
  ]);
  const [expandedFloors, setExpandedFloors] = useState<{
    [key: string]: boolean;
  }>({
    "1": true,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [showQuickSetup, setShowQuickSetup] = useState(true);
  const [quickSetup, setQuickSetup] = useState<QuickSetup>(defaultQuickSetup);
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  // Ensure required fields are validated and shown to the user
  const validateRequiredFields = (floors: Floor[]): ValidationErrors => {
    const errors: ValidationErrors = {};

    floors.forEach((floor, floorIdx) => {
      floor.rooms.forEach((room, roomIdx) => {
        if (!room.roomNumber) {
          errors[`${floorIdx}-${roomIdx}-roomNumber`] =
            "Room number is required.";
        }
        if (!room.rentPerBed) {
          errors[`${floorIdx}-${roomIdx}-rentPerBed`] =
            "Rent per bed is required.";
        }
      });
    });

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFieldErrors = validateRequiredFields(floors);
    if (Object.keys(requiredFieldErrors).length > 0) {
      setValidationErrors(requiredFieldErrors);
      return;
    }

    const validation = validateFloors(floors, existingRooms);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
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
                  deposit: Number(bed.tenant.deposit || "0"),
                  noticePeriodInMonths: Number(
                    bed.tenant.noticePeriodInMonths || "1"
                  ),
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

      console.log(res.data);
      console.log(propertyId, roomsData);

      if (onSuccess) {
        onSuccess();
      } else if (onSubmit) {
        onSubmit(roomsData);
      }
      setAlert({
        type: "success",
        message: "Rooms added successfully!",
      });
    } catch (err: any) {
      console.error(err);
      setAlert({
        type: "error",
        message: err?.response?.data?.error || "Failed to add rooms",
      });
      setValidationErrors({
        ...validationErrors,
        submit: err?.response?.data?.error || "Failed to add rooms",
      });
    }
  };
  const handleGenerateRooms = () => {
    const result = generateRooms(quickSetup, floors);
    if (result.error) {
      setValidationErrors({
        ...validationErrors,
        submit: result.error,
      });
      return;
    }
    setFloors(result.floors);
    setShowQuickSetup(false);
  };

  // Add validation logic for duplicate room numbers on the same floor
  const getDuplicateRoomError = (
    floors: Floor[],
    floorIdx: number,
    roomIdx: number
  ): string | null => {
    const currentFloor = floors[floorIdx];
    const currentRoom = currentFloor.rooms[roomIdx];

    const isDuplicate = currentFloor.rooms.some(
      (room, idx) =>
        idx !== roomIdx && room.roomNumber === currentRoom.roomNumber
    );

    return isDuplicate
      ? `Room number ${currentRoom.roomNumber} is duplicated on floor ${currentFloor.floorNumber}.`
      : null;
  };

  // Refactor duplicate room validation to avoid infinite re-renders
  // Remove setValidationErrors from hasDuplicateRooms
  const hasDuplicateRooms = floors.some((floor, floorIdx) => {
    return floor.rooms.some((_, roomIdx) => {
      const error = getDuplicateRoomError(floors, floorIdx, roomIdx);
      return !!error;
    });
  });

  // Use useEffect to update validation errors
  useEffect(() => {
    const errors: ValidationErrors = {};

    floors.forEach((floor, floorIdx) => {
      floor.rooms.forEach((_, roomIdx) => {
        const error = getDuplicateRoomError(floors, floorIdx, roomIdx);
        if (error) {
          errors[`${floorIdx}-${roomIdx}`] = error;
        }
      });
    });

    setValidationErrors(errors);
  }, [floors]);

  const isInvalid =
    hasDuplicateRooms ||
    Object.keys(validationErrors).length > 0 ||
    Object.keys(validateRequiredFields(floors)).length > 0;

  // Ensure validation errors are cleared when resolved
  const clearValidationError = (floorIdx: number, roomIdx: number) => {
    setValidationErrors((prevErrors) => {
      const { [`${floorIdx}-${roomIdx}`]: _, ...rest } = prevErrors;
      return rest;
    });
  };

  // Update handleRoomUpdate to clear errors when resolved
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

      // Validate duplicate room numbers
      const error = getDuplicateRoomError(updatedFloors, floorIdx, roomIdx);
      if (error) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [`${floorIdx}-${roomIdx}`]: error,
        }));
      } else {
        clearValidationError(floorIdx, roomIdx);
      }

      return updatedFloors;
    });
  };

  const handleBedUpdate = (
    floorIdx: number,
    roomIdx: number,
    bedIdx: number,
    field: string,
    value: string
  ) => {
    setFloors(updateBed(floors, floorIdx, roomIdx, bedIdx, field, value));
  };

  const handleDuplicateRoom = (floorIdx: number, roomIdx: number) => {
    setFloors(duplicateRoom(floors, floorIdx, roomIdx));
  };

  const handleRemoveRoom = (floorIdx: number, roomIdx: number) => {
    setFloors(removeRoom(floors, floorIdx, roomIdx));
  };

  return (
    <div className="-p-3">
      {alert && (
        <GlobalAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="flex justify-between -p-3 items-center mb-1">
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
        // Quick setup form content
        <>
          <h3 className="text-md font-medium mb-1">Quick Room Setup</h3>
          <h4 className="text-xs text-red-600 font-medium mb-4">
            All fields are required
          </h4>
          <div className="border rounded p-1 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1">Start Room Number</label>
                <input
                  type="number"
                  value={quickSetup.startRoom}
                  onChange={(e) =>
                    setQuickSetup({ ...quickSetup, startRoom: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 101"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">End Room Number</label>
                <input
                  type="number"
                  value={quickSetup.endRoom}
                  onChange={(e) =>
                    setQuickSetup({ ...quickSetup, endRoom: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 110"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Floor</label>
                <input
                  type="number"
                  value={quickSetup.floorNumber}
                  onChange={(e) =>
                    setQuickSetup({
                      ...quickSetup,
                      floorNumber: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Room Type</label>
                <select
                  value={quickSetup.type}
                  onChange={(e) =>
                    setQuickSetup({ ...quickSetup, type: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Rent Per Bed</label>
                <input
                  type="number"
                  value={quickSetup.rentPerBed}
                  onChange={(e) =>
                    setQuickSetup({ ...quickSetup, rentPerBed: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 5000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Initial Status</label>
                <select
                  value={quickSetup.defaultStatus}
                  onChange={(e) =>
                    setQuickSetup({
                      ...quickSetup,
                      defaultStatus: e.target.value as "vacant" | "occupied",
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="vacant">All Vacant</option>
                  <option value="occupied">All Occupied</option>
                </select>
              </div>
            </div>

            {quickSetup.defaultStatus === "occupied" && (
              <div className="border-t pt-4 mt-4">
                <h5 className="font-semibold mb-2">Default Tenant Template</h5>
                <p className="text-sm text-gray-500 mb-2">
                  These values will be used as defaults for all occupied beds.
                  You can edit individual values later.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Name Pattern</label>
                    <input
                      value={quickSetup.defaultTenantTemplate.name}
                      onChange={(e) =>
                        setQuickSetup({
                          ...quickSetup,
                          defaultTenantTemplate: {
                            ...quickSetup.defaultTenantTemplate,
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded"
                      placeholder="e.g., Tenant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Phone Pattern</label>
                    <input
                      value={quickSetup.defaultTenantTemplate.phone}
                      onChange={(e) =>
                        setQuickSetup({
                          ...quickSetup,
                          defaultTenantTemplate: {
                            ...quickSetup.defaultTenantTemplate,
                            phone: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded"
                      placeholder="e.g., 9999999999"
                      maxLength={10}
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Default Deposit
                    </label>
                    <input
                      type="number"
                      value={quickSetup.defaultTenantTemplate.deposit}
                      onChange={(e) =>
                        setQuickSetup({
                          ...quickSetup,
                          defaultTenantTemplate: {
                            ...quickSetup.defaultTenantTemplate,
                            deposit: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Default Notice Period (months)
                    </label>
                    <input
                      type="number"
                      value={
                        quickSetup.defaultTenantTemplate.noticePeriodInMonths
                      }
                      onChange={(e) =>
                        setQuickSetup({
                          ...quickSetup,
                          defaultTenantTemplate: {
                            ...quickSetup.defaultTenantTemplate,
                            noticePeriodInMonths: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateRooms}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={
                  !quickSetup.startRoom ||
                  !quickSetup.endRoom ||
                  !quickSetup.rentPerBed
                }
              >
                Generate Rooms
              </button>
            </div>
          </div>
        </>
      ) : (
        // Generated rooms review content
        <>
          <div className="flex justify-between items-center mb-1">
            <button
              onClick={() => setShowQuickSetup(true)}
              className="text-blue-500 hover:text-blue-600 bg-transparent text-sm font-semibold"
            >
              ← back
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className=" text-gray-600 hover:text-gray-800 bg-transparent text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`bg-blue-400 text-gray-800 px-4 py-2 rounded hover:bg-blue-600 bg-transparent text-sm font-semibold ${
                  isInvalid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isInvalid}
              >
                Save All Rooms
              </button>
            </div>
          </div>

          {floors.map((floor, floorIdx) => (
            <div key={floorIdx} className="border rounded p-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Floor {floor.floorNumber}</h4>
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedFloors((prev) => ({
                        ...prev,
                        [floor.floorNumber]: !prev[floor.floorNumber],
                      }))
                    }
                    className="text-purple-600 text-sm"
                  >
                    {expandedFloors[floor.floorNumber] ? "Collapse" : "Expand"}
                  </button>
                </div>
              </div>

              {expandedFloors[floor.floorNumber] && (
                <div className="space-y-4">
                  {floor.rooms.map((room, roomIdx) => (
                    <div
                      key={roomIdx}
                      className="border p-2 rounded bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <input
                          placeholder="Room Number"
                          value={room.roomNumber}
                          onChange={(e) =>
                            handleRoomUpdate(
                              floorIdx,
                              roomIdx,
                              "roomNumber",
                              e.target.value
                            )
                          }
                          className={`w-1/3 p-2 border rounded ${
                            validationErrors[
                              `${floorIdx}-${roomIdx}-roomNumber`
                            ]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {validationErrors[
                          `${floorIdx}-${roomIdx}-roomNumber`
                        ] && (
                          <div className="text-red-600 text-xs">
                            {
                              validationErrors[
                                `${floorIdx}-${roomIdx}-roomNumber`
                              ]
                            }
                          </div>
                        )}
                        <div className="relative w-1/3">
                          <select
                            value={room.type}
                            onChange={(e) =>
                              handleRoomUpdate(
                                floorIdx,
                                roomIdx,
                                "type",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {typeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col space-y-2 ml-auto">
                          <button
                            type="button"
                            onClick={() =>
                              handleDuplicateRoom(floorIdx, roomIdx)
                            }
                            className="text-blue-600 text-sm"
                          >
                            Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveRoom(floorIdx, roomIdx)}
                            className="text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {(validationErrors[
                        `${floorIdx}-${roomIdx}-roomNumber` as ValidationErrorKey
                      ] ||
                        validationErrors[
                          `${floorIdx}-${roomIdx}-duplicate` as ValidationErrorKey
                        ] ||
                        validationErrors[
                          `${floorIdx}-${roomIdx}-existing` as ValidationErrorKey
                        ]) && (
                        <div className="text-red-600 text-xs mb-2">
                          {validationErrors[
                            `${floorIdx}-${roomIdx}-roomNumber` as ValidationErrorKey
                          ] ||
                            validationErrors[
                              `${floorIdx}-${roomIdx}-duplicate` as ValidationErrorKey
                            ] ||
                            validationErrors[
                              `${floorIdx}-${roomIdx}-existing` as ValidationErrorKey
                            ]}
                        </div>
                      )}

                      <input
                        placeholder="Rent Per Bed"
                        type="number"
                        value={room.rentPerBed}
                        onChange={(e) =>
                          handleRoomUpdate(
                            floorIdx,
                            roomIdx,
                            "rentPerBed",
                            e.target.value
                          )
                        }
                        className={`w-1/3 p-2 border rounded ${
                          validationErrors[
                            `${floorIdx}-${roomIdx}-rentPerBed` as ValidationErrorKey
                          ]
                            ? "border-red-500"
                            : ""
                        }`}
                      />

                      <div className="mt-4">
                        <h5 className="font-semibold mb-2">Beds</h5>
                        {room.beds.map((bed, bedIdx) => (
                          <div key={bedIdx} className="mb-4">
                            <select
                              value={bed.status}
                              onChange={(e) =>
                                handleBedUpdate(
                                  floorIdx,
                                  roomIdx,
                                  bedIdx,
                                  "status",
                                  e.target.value
                                )
                              }
                              className="p-2 border rounded"
                            >
                              <option value="vacant">Vacant</option>
                              <option value="occupied">Occupied</option>
                            </select>

                            {bed.status === "occupied" && bed.tenant && (
                              <div className="ml-4 mt-2 space-y-2">
                                <input
                                  value={bed.tenant.name}
                                  onChange={(e) =>
                                    handleBedUpdate(
                                      floorIdx,
                                      roomIdx,
                                      bedIdx,
                                      "tenant.name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Tenant Name"
                                  className="w-full p-2 border rounded"
                                />
                                <input
                                  value={bed.tenant.phone}
                                  onChange={(e) =>
                                    handleBedUpdate(
                                      floorIdx,
                                      roomIdx,
                                      bedIdx,
                                      "tenant.phone",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Phone"
                                  className="w-full p-2 border rounded"
                                maxLength={10}
                                />
                                <input
                                  value={bed.tenant.aadhar}
                                  onChange={(e) =>
                                    handleBedUpdate(
                                      floorIdx,
                                      roomIdx,
                                      bedIdx,
                                      "tenant.aadhar",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Aadhar"
                                  className="w-full p-2 border rounded"
                                  maxLength={12}
                                />
                                <input
                                  type="number"
                                  value={bed.tenant.deposit}
                                  onChange={(e) =>
                                    handleBedUpdate(
                                      floorIdx,
                                      roomIdx,
                                      bedIdx,
                                      "tenant.deposit",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Deposit"
                                  className="w-full p-2 border rounded"
                                  min={0}
                                />
                                <input
                                  type="number"
                                  value={bed.tenant.noticePeriodInMonths}
                                  onChange={(e) =>
                                    handleBedUpdate(
                                      floorIdx,
                                      roomIdx,
                                      bedIdx,
                                      "tenant.noticePeriodInMonths",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Notice Period (months)"
                                  className="w-full p-2 border rounded"
                                  min={0}
                                />
                                <input
                                  type="number"
                                  value={bed.tenant.rentPaid}
                                  onChange={(e) =>
                                    handleBedUpdate(
                                      floorIdx,
                                      roomIdx,
                                      bedIdx,
                                      "tenant.rentPaid",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Rent Paid"
                                  className="w-full p-2 border rounded"
                                  min={0}
                                />
                                <select
                                  value={bed.tenant.rentPaidMethod}
                                  onChange={(e) =>
                                    handleBedUpdate(
                                      floorIdx,
                                      roomIdx,
                                      bedIdx,
                                      "tenant.rentPaidMethod",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border rounded"
                                >
                                  <option value="cash">Cash</option>
                                  <option value="upi">UPI</option>
                                  <option value="bank">Bank</option>
                                </select>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const newFloors = [...floors];
                      newFloors[floorIdx].rooms.push({
                        roomNumber: "",
                        type: "double",
                        rentPerBed: "",
                        beds: [{ status: "vacant", tenant: undefined }],
                      });
                      setFloors(newFloors);
                    }}
                    className="text-purple-600 text-sm"
                  >
                    + Add Room
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default BulkRoomForm;
