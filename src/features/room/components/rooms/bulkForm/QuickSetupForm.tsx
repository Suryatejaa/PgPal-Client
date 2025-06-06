import React from "react";
import { typeOptions } from "../../../types/roomTypes";
import type { QuickSetup, ValidationErrors } from "../../../types/roomTypes";

interface Props {
  quickSetup: QuickSetup;
  validationErrors: ValidationErrors;
  onQuickSetupChange: (field: keyof QuickSetup, value: any) => void;
  onGenerateRooms: () => void;
  onClose?: () => void;
}

const QuickSetupForm: React.FC<Props> = ({
  quickSetup,
  validationErrors,
  onQuickSetupChange,
  onGenerateRooms,
  onClose,
}) => {
  const hasRentPerBedError = !quickSetup.rentPerBed;
  const hasStartRoomError = !quickSetup.startRoom;
  const hasEndRoomError = !quickSetup.endRoom;
  const hasFloorError = !quickSetup.floorNumber;

  return (
    <>
      <h3 className="text-md font-medium mb-1">Quick Room Setup</h3>
      <h4 className="text-xs text-red-600 font-medium mb-4">
        All fields are required
      </h4>
      <div className="border rounded p-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Start Room Number</label>
            <input
              type="number"
              value={quickSetup.startRoom}
              onChange={(e) => onQuickSetupChange("startRoom", e.target.value)}
              className={`w-full p-2 border rounded ${
                validationErrors.startRoom ? "border-red-500" : ""
              }`}
              placeholder="e.g., 101"
            />
            {validationErrors.startRoom && (
              <div className="text-red-600 text-xs mt-1">
                {validationErrors.startRoom}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">End Room Number</label>
            <input
              type="number"
              value={quickSetup.endRoom}
              onChange={(e) => onQuickSetupChange("endRoom", e.target.value)}
              className={`w-full p-2 border rounded ${
                validationErrors.endRoom ? "border-red-500" : ""
              }`}
              placeholder="e.g., 110"
            />
            {validationErrors.endRoom && (
              <div className="text-red-600 text-xs mt-1">
                {validationErrors.endRoom}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Floor</label>
            <input
              type="number"
              value={quickSetup.floorNumber}
              onChange={(e) =>
                onQuickSetupChange("floorNumber", e.target.value)
              }
              className={`w-full p-2 border rounded ${
                validationErrors.floorNumber ? "border-red-500" : ""
              }`}
            />
            {validationErrors.floorNumber && (
              <div className="text-red-600 text-xs mt-1">
                {validationErrors.floorNumber}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Room Type</label>
            <select
              value={quickSetup.type}
              onChange={(e) => onQuickSetupChange("type", e.target.value)}
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
              onChange={(e) => onQuickSetupChange("rentPerBed", e.target.value)}
              className={`w-full p-2 border rounded ${
                validationErrors.rentPerBed ? "border-red-500" : ""
              }`}
              placeholder="e.g., 5000"
              required
            />
            {(validationErrors.rentPerBed ||
              (hasRentPerBedError && validationErrors.quickSetup)) && (
              <div className="text-red-600 text-xs mt-1">
                {validationErrors.rentPerBed || "Rent per bed is required"}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Initial Status</label>
            <select
              value={quickSetup.defaultStatus}
              onChange={(e) =>
                onQuickSetupChange("defaultStatus", e.target.value)
              }
              className="w-full p-2 border rounded"
            >
              <option value="vacant">All Vacant</option>
              <option value="occupied">All Occupied</option>
            </select>
          </div>
        </div>

        {quickSetup.defaultStatus === "occupied" && (
          <TenantTemplateForm
            defaultTenantTemplate={quickSetup.defaultTenantTemplate}
            onTemplateChange={(field, value) => {
              onQuickSetupChange("defaultTenantTemplate", {
                ...quickSetup.defaultTenantTemplate,
                [field]: value,
              });
            }}
          />
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onGenerateRooms}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={
              !quickSetup.startRoom ||
              !quickSetup.endRoom ||
              !quickSetup.rentPerBed ||
              !quickSetup.floorNumber
            }
          >
            Generate Rooms
          </button>
        </div>
        {validationErrors.quickSetup && (
          <div className="text-red-600 text-sm mt-2">
            {validationErrors.quickSetup}
          </div>
        )}
      </div>
    </>
  );
};

const TenantTemplateForm: React.FC<{
  defaultTenantTemplate: any;
  onTemplateChange: (field: string, value: string) => void;
}> = ({ defaultTenantTemplate, onTemplateChange }) => (
  <div className="border-t pt-4 mt-4">
    <h5 className="font-semibold mb-2">Default Tenant Template</h5>
    <p className="text-sm text-gray-500 mb-2">
      These values will be used as defaults for all occupied beds. You can edit
      individual values later.
    </p>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm mb-1">Name Pattern</label>
        <input
          value={defaultTenantTemplate.name}
          onChange={(e) => onTemplateChange("name", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., Tenant"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Phone Pattern</label>
        <input
          value={defaultTenantTemplate.phone}
          onChange={(e) => onTemplateChange("phone", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., 9999999999"
          maxLength={10}
          pattern="[0-9]{10}"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Default Deposit</label>
        <input
          type="number"
          value={defaultTenantTemplate.deposit}
          onChange={(e) => onTemplateChange("deposit", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">
          Default Notice Period (months)
        </label>
        <input
          type="number"
          value={defaultTenantTemplate.noticePeriodInDays}
          onChange={(e) =>
            onTemplateChange("noticePeriodInDays", e.target.value)
          }
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  </div>
);

export default QuickSetupForm;
