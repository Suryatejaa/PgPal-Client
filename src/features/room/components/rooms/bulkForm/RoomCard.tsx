import React from "react";
import BedCard from "./BedCard";
import { typeOptions } from "../../../types/roomTypes";
import type { Room, ValidationErrors } from "../../../types/roomTypes";

interface Props {
  room: Room;
  floorIdx: number;
  roomIdx: number;
  validationErrors: ValidationErrors;
  onRoomUpdate: (
    floorIdx: number,
    roomIdx: number,
    field: string,
    value: string
  ) => void;
  onBedUpdate: (
    floorIdx: number,
    roomIdx: number,
    bedIdx: number,
    field: string,
    value: string
  ) => void;
  onDuplicateRoom: (floorIdx: number, roomIdx: number) => void;
  onRemoveRoom: (floorIdx: number, roomIdx: number) => void;
}

const RoomCard: React.FC<Props> = ({
  room,
  floorIdx,
  roomIdx,
  validationErrors,
  onRoomUpdate,
  onBedUpdate,
  onDuplicateRoom,
  onRemoveRoom,
}) => {
  const roomNumberError = validationErrors[`${floorIdx}-${roomIdx}-roomNumber`];
  const rentPerBedError = validationErrors[`${floorIdx}-${roomIdx}-rentPerBed`];
  const duplicateError = validationErrors[`${floorIdx}-${roomIdx}`];

  return (
    <div className="border p-1 rounded bg-gray-50">
      {/* Show duplicate/general room errors */}
      {duplicateError && (
        <div className="text-red-600 text-xs mb-2">{duplicateError}</div>
      )}

      <div className="flex items-start justify-between mb-1">
        <div className="gap-3">
          {/* Room Number Input */}
          <div className="flex-1">
            <input
              placeholder="Room Number"
              value={room.roomNumber}
              onChange={(e) =>
                onRoomUpdate(floorIdx, roomIdx, "roomNumber", e.target.value)
              }
              className={`w-full p-2 border rounded ${
                roomNumberError ? "border-red-500" : ""
              }`}
            />
            {roomNumberError && (
              <div className="text-red-600 text-xs mt-1">{roomNumberError}</div>
            )}
          </div>

          {/* Room Type Select */}
          <div className="flex-1">
            <select
              value={room.type}
              onChange={(e) =>
                onRoomUpdate(floorIdx, roomIdx, "type", e.target.value)
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

          {/* Rent Per Bed Input */}
          <div className="flex-1">
            <input
              placeholder="Rent Per Bed"
              type="number"
              value={room.rentPerBed}
              onChange={(e) =>
                onRoomUpdate(floorIdx, roomIdx, "rentPerBed", e.target.value)
              }
              className={`w-full p-2 border rounded ${
                rentPerBedError ? "border-red-500" : ""
              }`}
            />
            {rentPerBedError && (
              <div className="text-red-600 text-xs mt-1">{rentPerBedError}</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 ml-4">
          <button
            type="button"
            onClick={() => onDuplicateRoom(floorIdx, roomIdx)}
            className="text-blue-600 text-sm hover:text-blue-800"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => onRemoveRoom(floorIdx, roomIdx)}
            className="text-red-600 text-sm hover:text-red-800"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Beds Section */}
      <div className="mt-4">
        <h5 className="font-semibold mb-2">Beds</h5>
        {room.beds.map((bed, bedIdx) => (
          <BedCard
            key={bedIdx}
            bed={bed}
            floorIdx={floorIdx}
            roomIdx={roomIdx}
            bedIdx={bedIdx}
            validationErrors={validationErrors}
            onBedUpdate={onBedUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomCard;
