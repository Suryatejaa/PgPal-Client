import React from "react";
import RoomCard from "./RoomCard";
import type { Floor, ValidationErrors } from "../../../types/roomTypes";

interface Props {
  floor: Floor;
  floorIdx: number;
  isExpanded: boolean;
  validationErrors: ValidationErrors;
  onToggle: () => void;
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
  onAddRoom: () => void;
}

const FloorCard: React.FC<Props> = ({
  floor,
  floorIdx,
  isExpanded,
  validationErrors,
  onToggle,
  onRoomUpdate,
  onBedUpdate,
  onDuplicateRoom,
  onRemoveRoom,
  onAddRoom,
}) => {
  return (
    <div className="border rounded p-1 mb-1">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Floor {floor.floorNumber}</h4>
        <button
          type="button"
          onClick={onToggle}
          className="text-purple-600 text-sm"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {floor.rooms.map((room, roomIdx) => (
            <RoomCard
              key={roomIdx}
              room={room}
              floorIdx={floorIdx}
              roomIdx={roomIdx}
              validationErrors={validationErrors}
              onRoomUpdate={onRoomUpdate}
              onBedUpdate={onBedUpdate}
              onDuplicateRoom={onDuplicateRoom}
              onRemoveRoom={onRemoveRoom}
            />
          ))}

          <button
            type="button"
            onClick={onAddRoom}
            className="text-purple-600 text-sm"
          >
            + Add Room
          </button>
        </div>
      )}
    </div>
  );
};

export default FloorCard;
