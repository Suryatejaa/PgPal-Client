import type { Floor, Room, Bed, ValidationErrors, QuickSetup } from '../types/roomTypes';
import { defaultTenant, typeOptions } from '../types/roomTypes';

export const duplicateRoom = (floors: Floor[], floorIdx: number, roomIdx: number): Floor[] => {
  const newFloors = [...floors];
  const room = { ...newFloors[floorIdx].rooms[roomIdx] };
  room.beds = room.beds.map((bed) => ({
    status: bed.status,
    tenant: bed.tenant ? { ...defaultTenant } : undefined,
  }));
  newFloors[floorIdx].rooms.push(room);
  return newFloors;
};

export const updateRoom = (
    floors: Floor[],
    floorIdx: number,
    roomIdx: number,
    field: keyof Room,
    value: any
  ): Floor[] => {
    const updatedFloors = [...floors];
    const room = updatedFloors[floorIdx].rooms[roomIdx];
  
    if (field === "type") {
      const bedCount = typeOptions.find((type) => type.value === value)?.beds || 1;
      room.beds = Array(bedCount).fill({ status: "vacant", tenant: undefined });
    }
  
    room[field] = value;
    return updatedFloors;
  };

export const updateBed = (
  floors: Floor[],
  floorIdx: number,
  roomIdx: number,
  bedIdx: number,
  field: string,
  value: string
): Floor[] => {
  const newFloors = [...floors];
  if (!newFloors[floorIdx]?.rooms[roomIdx]?.beds[bedIdx]) return floors;

  const bed = { ...newFloors[floorIdx].rooms[roomIdx].beds[bedIdx] };
  let updatedBed: Bed;
  if (field === "status") {
    const bedStatus = value as "vacant" | "occupied";
    updatedBed = {
      ...bed,
      status: bedStatus,
      tenant: bedStatus === "occupied" ? { ...defaultTenant } : undefined,
    };
  } else {
    const tenantField = field.split(".")[1] as keyof typeof defaultTenant;
    if (!bed.tenant) {
      bed.tenant = { ...defaultTenant };
    }
    updatedBed = {
      ...bed,
      tenant: {
        ...bed.tenant,
        [tenantField]: value,
      },
    };
  }

  newFloors[floorIdx].rooms[roomIdx].beds[bedIdx] = updatedBed;
  return newFloors;
};

export const removeRoom = (floors: Floor[], floorIdx: number, roomIdx: number): Floor[] => {
  const newFloors = [...floors];
  newFloors[floorIdx].rooms = newFloors[floorIdx].rooms.filter(
    (_, idx) => idx !== roomIdx
  );
  return newFloors;
};

export const validateFloors = (
  floors: Floor[],
  existingRooms: { roomNumber: string; floor: string }[]
): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};
  let isValid = true;

  floors.forEach((floor, floorIdx) => {
    floor.rooms.forEach((room, roomIdx) => {
      const roomKey = `${floorIdx}-${roomIdx}` as const;

      if (!room.roomNumber) {
        errors[`${roomKey}-roomNumber`] = "Room number required";
        isValid = false;
      }
      if (!room.rentPerBed) {
        errors[`${roomKey}-rentPerBed`] = "Rent per bed required";
        isValid = false;
      }

      // Check for duplicate rooms in the same floor
      const isDuplicate = floor.rooms.some(
        (r, idx) =>
          idx !== roomIdx && String(r.roomNumber) === String(room.roomNumber)
      );
      if (isDuplicate) {
        errors[`${roomKey}-duplicate`] = "Duplicate room number in same floor";
        isValid = false;
      }

      // Check if room exists in existing rooms
      const roomExists = existingRooms.some(
        (r) =>
          String(r.roomNumber) === String(room.roomNumber) &&
          String(r.floor) === String(floor.floorNumber)
      );
      if (roomExists) {
        errors[`${roomKey}-existing`] = "Room already exists";
        isValid = false;
      }

      room.beds.forEach((bed, bedIdx) => {
        validateBed(bed, roomKey, bedIdx, errors) && (isValid = false);
      });
    });
  });

  return { isValid, errors };
};

const validateBed = (
  bed: Bed,
  roomKey: string,
  bedIdx: number,
  errors: ValidationErrors
): boolean => {
  let hasError = false;

  if (bed.status === "occupied" && bed.tenant) {
    if (!bed.tenant.name) {
      errors[`${roomKey}-${bedIdx}-name`] = "Tenant name required";
      hasError = true;
    }
    if (!bed.tenant.phone) {
      errors[`${roomKey}-${bedIdx}-phone`] = "Phone required";
      hasError = true;
    }
    if (!bed.tenant.aadhar) {
      errors[`${roomKey}-${bedIdx}-aadhar`] = "Aadhar required";
      hasError = true;
    }
    if (!bed.tenant.deposit) {
      errors[`${roomKey}-${bedIdx}-deposit`] = "Deposit required";
      hasError = true;
    }
    if (!bed.tenant.noticePeriodInMonths) {
      errors[`${roomKey}-${bedIdx}-notice`] = "Notice period required";
      hasError = true;
    }
    const rentPaid = parseInt(bed.tenant.rentPaid || "0");
    if (rentPaid > 0 && !bed.tenant.rentPaidMethod) {
      errors[`${roomKey}-${bedIdx}-rentMethod`] =
        "Rent payment method required when rent is paid";
      hasError = true;
    }
  }

  return hasError;
};

export const generateRooms = (
  quickSetup: QuickSetup,
  floors: Floor[]
): { floors: Floor[]; error?: string } => {
  const start = parseInt(quickSetup.startRoom);
  const end = parseInt(quickSetup.endRoom);

  if (isNaN(start) || isNaN(end) || start > end) {
    return { 
      floors,
      error: "Invalid room number range"
    };
  }

  const bedCount = typeOptions.find((t) => t.value === quickSetup.type)?.beds || 2;
  const newRooms: Room[] = [];

  for (let i = start; i <= end; i++) {
    const room: Room = {
      roomNumber: i.toString(),
      type: quickSetup.type,
      rentPerBed: quickSetup.rentPerBed,
      beds: Array(bedCount)
        .fill(null)
        .map(() => ({
          status: quickSetup.defaultStatus,
          tenant:
            quickSetup.defaultStatus === "occupied"
              ? { ...quickSetup.defaultTenantTemplate }
              : undefined,
        })),
    };
    newRooms.push(room);
  }

  const floorIdx = floors.findIndex(
    (f) => f.floorNumber === quickSetup.floorNumber
  );

  if (floorIdx === -1) {
    return {
      floors: [
        ...floors,
        {
          floorNumber: quickSetup.floorNumber,
          rooms: newRooms,
        },
      ]
    };
  } else {
    const newFloors = [...floors];
    newFloors[floorIdx].rooms = [...newFloors[floorIdx].rooms, ...newRooms];
    return { floors: newFloors };
  }
};
