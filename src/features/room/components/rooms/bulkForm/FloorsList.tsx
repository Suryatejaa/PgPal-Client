import React from "react";
import FloorCard from "./FloorCard";
import type { Floor, ValidationErrors } from "../../../types/roomTypes";

interface Props {
  floors: Floor[];
  expandedFloors: { [key: string]: boolean };
  validationErrors: ValidationErrors;
  onToggleFloor: (floorNumber: string) => void;
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
  onAddRoom: (floorIdx: number) => void;
}

const FloorsList: React.FC<Props> = ({
  floors,
  expandedFloors,
  validationErrors,
  onToggleFloor,
  onRoomUpdate,
  onBedUpdate,
  onDuplicateRoom,
  onRemoveRoom,
  onAddRoom,
}) => {
  return (
    <>
      {floors.map((floor, floorIdx) => (
        <FloorCard
          key={floorIdx}
          floor={floor}
          floorIdx={floorIdx}
          isExpanded={expandedFloors[floor.floorNumber]}
          validationErrors={validationErrors}
          onToggle={() => onToggleFloor(floor.floorNumber)}
          onRoomUpdate={onRoomUpdate}
          onBedUpdate={onBedUpdate}
          onDuplicateRoom={onDuplicateRoom}
          onRemoveRoom={onRemoveRoom}
          onAddRoom={() => onAddRoom(floorIdx)}
        />
      ))}
    </>
  );
};

export default FloorsList;