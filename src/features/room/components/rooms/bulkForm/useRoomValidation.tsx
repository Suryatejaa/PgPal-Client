import { useState, useEffect, useCallback } from "react";
import type {
  Floor,
  ValidationErrors,
  QuickSetup,
} from "../../../types/roomTypes";

export const useRoomValidation = (
  floors: Floor[],
  existingRooms: { roomNumber: string; floor: string }[] = []
) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const validateQuickSetup = useCallback(
    (quickSetup: QuickSetup): ValidationErrors => {
      const errors: ValidationErrors = {};

      if (!quickSetup.startRoom) {
        errors.startRoom = "Start room number is required";
      }
      if (!quickSetup.endRoom) {
        errors.endRoom = "End room number is required";
      }
      if (!quickSetup.floorNumber) {
        errors.floorNumber = "Floor number is required";
      }
      if (!quickSetup.rentPerBed) {
        errors.rentPerBed = "Rent per bed is required";
      }
      if (
        quickSetup.startRoom &&
        quickSetup.endRoom &&
        Number(quickSetup.endRoom) < Number(quickSetup.startRoom)
      ) {
        errors.quickSetup =
          "End room number must be greater than or equal to start room number";
      }

      return errors;
    },
    []
  );

  const validateRequiredFields = useCallback(
    (floors: Floor[]): ValidationErrors => {
      const errors: ValidationErrors = {};

      floors.forEach((floor, floorIdx) => {
        floor.rooms.forEach((room, roomIdx) => {
          if (!room.roomNumber) {
            errors[`${floorIdx}-${roomIdx}-roomNumber`] =
              "Room number is required";
          }
          if (!room.rentPerBed) {
            errors[`${floorIdx}-${roomIdx}-rentPerBed`] =
              "Rent per bed is required";
          }

          room.beds.forEach((bed, bedIdx) => {
            if (bed.status === "occupied" && bed.tenant) {
              type TenantKey =
                | "name"
                | "phone"
                | "aadhar"
                | "deposit"
                | "noticePeriodInDays"
                | "rentPaid";
              const requiredTenantFields: { key: TenantKey; label: string }[] =
                [
                  { key: "name", label: "Tenant name" },
                  { key: "phone", label: "Tenant phone" },
                  { key: "aadhar", label: "Tenant Aadhar" },
                  { key: "deposit", label: "Tenant deposit" },
                  { key: "noticePeriodInDays", label: "Notice period" },
                  { key: "rentPaid", label: "Rent paid" },
                ];

              requiredTenantFields.forEach(({ key, label }) => {
                if (!bed.tenant || !bed.tenant[key]) {
                  const errorKey = `${floorIdx}-${roomIdx}-${bedIdx}-tenant${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }`;
                  errors[errorKey] = `${label} is required`;
                }
              });
            }
          });
        });
      });

      return errors;
    },
    []
  );

  const getDuplicateRoomError = useCallback(
    (floors: Floor[], floorIdx: number, roomIdx: number): string | null => {
      const currentFloor = floors[floorIdx];
      const currentRoom = currentFloor.rooms[roomIdx];

      if (!currentRoom.roomNumber) return null;

      const isDuplicate = currentFloor.rooms.some(
        (room, idx) =>
          idx !== roomIdx && room.roomNumber === currentRoom.roomNumber
      );

      return isDuplicate
        ? `Room number ${currentRoom.roomNumber} is duplicated on floor ${currentFloor.floorNumber}`
        : null;
    },
    []
  );

  const clearValidationError = useCallback((errorKey: string) => {
    setValidationErrors((prevErrors) => {
      const { [errorKey]: _, ...rest } = prevErrors;
      return rest;
    });
  }, []);

  const clearFieldError = useCallback(
    (floorIdx: number, roomIdx: number, field: string, bedIdx?: number) => {
      const errorKey =
        bedIdx !== undefined
          ? `${floorIdx}-${roomIdx}-${bedIdx}-${field}`
          : `${floorIdx}-${roomIdx}-${field}`;
      clearValidationError(errorKey);
    },
    [clearValidationError]
  );

  // Update validation errors when floors change
  useEffect(() => {
    setValidationErrors((prevErrors) => {
      // Start with a clean slate for validation errors
      const newErrors: ValidationErrors = {};

      // Add required field errors
      const requiredFieldErrors = validateRequiredFields(floors);
      Object.assign(newErrors, requiredFieldErrors);

      // Add duplicate room errors
      floors.forEach((floor, floorIdx) => {
        floor.rooms.forEach((_, roomIdx) => {
          const error = getDuplicateRoomError(floors, floorIdx, roomIdx);
          if (error) {
            newErrors[`${floorIdx}-${roomIdx}`] = error;
          }
        });
      });

      return newErrors;
    });
  }, [floors, getDuplicateRoomError, validateRequiredFields]);

  return {
    validationErrors,
    setValidationErrors,
    validateQuickSetup,
    validateRequiredFields,
    getDuplicateRoomError,
    clearValidationError,
    clearFieldError,
  };
};
