import React from "react";
import type { ValidationErrors } from "../../../types/roomTypes";

interface Props {
  tenant: any;
  floorIdx: number;
  roomIdx: number;
  bedIdx: number;
  validationErrors: ValidationErrors;
  onTenantUpdate: (field: string, value: string) => void;
}

const TenantForm: React.FC<Props> = ({
  tenant,
  floorIdx,
  roomIdx,
  bedIdx,
  validationErrors,
  onTenantUpdate,
}) => {
  const getErrorKey = (field: string) =>
    `${floorIdx}-${roomIdx}-${bedIdx}-tenant${
      field.charAt(0).toUpperCase() + field.slice(1)
    }`;

  const tenantFields = [
    {
      key: "name",
      label: "Tenant Name",
      type: "text",
      placeholder: "Enter tenant name",
    },
    {
      key: "phone",
      label: "Phone",
      type: "text",
      placeholder: "10-digit phone number",
      maxLength: 10,
    },
    {
      key: "aadhar",
      label: "Aadhar",
      type: "text",
      placeholder: "12-digit Aadhar number",
      maxLength: 12,
    },
    {
      key: "deposit",
      label: "Deposit",
      type: "number",
      placeholder: "Security deposit amount",
      min: 0,
    },
    {
      key: "noticePeriodInDays",
      label: "Notice Period (days)",
      type: "number",
      placeholder: "Notice period",
      min: 0,
    },
    {
      key: "rentPaid",
      label: "Rent Paid",
      type: "number",
      placeholder: "Rent amount paid",
      min: 0,
    },
  ];

  return (
    <div className="ml-4 mt-2 space-y-3">
      <h6 className="font-medium text-sm text-gray-700">Tenant Information</h6>

      {tenantFields.map(({ key, label, type, placeholder, maxLength, min }) => {
        const errorKey = getErrorKey(key);
        const hasError = validationErrors[errorKey];

        return (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {label} <span className="text-red-500">*</span>
            </label>
            <input
              type={type}
              value={tenant[key] || ""}
              onChange={(e) => onTenantUpdate(key, e.target.value)}
              placeholder={placeholder}
              className={`w-full p-2 border rounded text-sm ${
                hasError ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              maxLength={maxLength}
              min={min}
            />
            {hasError && (
              <div className="text-red-600 text-xs mt-1">{hasError}</div>
            )}
          </div>
        );
      })}

      {/* Rent Payment Method */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Payment Method
        </label>
        <select
          value={tenant.rentPaidMethod || "cash"}
          onChange={(e) => onTenantUpdate("rentPaidMethod", e.target.value)}
          className="w-full p-2 border rounded text-sm border-gray-300"
        >
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="bank">Bank Transfer</option>
        </select>
      </div>
    </div>
  );
};

export default TenantForm;
