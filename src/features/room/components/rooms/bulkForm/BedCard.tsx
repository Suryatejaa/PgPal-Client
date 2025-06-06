import React from "react";
import TenantForm from "./TenantForm";
import type { Bed, ValidationErrors } from "../../../types/roomTypes";

interface Props {
  bed: Bed;
  floorIdx: number;
  roomIdx: number;
  bedIdx: number;
  validationErrors: ValidationErrors;
  onBedUpdate: (
    floorIdx: number,
    roomIdx: number,
    bedIdx: number,
    field: string,
    value: string
  ) => void;
}

const BedCard: React.FC<Props> = ({
  bed,
  floorIdx,
  roomIdx,
  bedIdx,
  validationErrors,
  onBedUpdate,
}) => {
  return (
    <div className="mb-4 p-3 border rounded bg-white">
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Bed Status</label>
        <select
          value={bed.status}
          onChange={(e) =>
            onBedUpdate(floorIdx, roomIdx, bedIdx, "status", e.target.value)
          }
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
        </select>
      </div>

      {bed.status === "occupied" && bed.tenant && (
        <TenantForm
          tenant={bed.tenant}
          floorIdx={floorIdx}
          roomIdx={roomIdx}
          bedIdx={bedIdx}
          validationErrors={validationErrors}
          onTenantUpdate={(field, value) =>
            onBedUpdate(floorIdx, roomIdx, bedIdx, `tenant.${field}`, value)
          }
        />
      )}
    </div>
  );
};

export default BedCard;
