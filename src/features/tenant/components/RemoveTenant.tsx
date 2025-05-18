import React, { useState } from "react";

const RemoveTenantForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const [reason, setReason] = useState("");
  const [isImmediateVacate, setIsImmediateVacate] = useState(false);
  const [isDepositRefunded, setIsDepositRefunded] = useState(false);
  const [isVacatedAlready, setIsVacatedAlready] = useState(false);

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          reason,
          isImmediateVacate,
          isDepositRefunded,
          isVacatedAlready,
        });
      }}
    >
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isImmediateVacate}
          onChange={(e) => setIsImmediateVacate(e.target.checked)}
        />
        Immediate Vacate
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isDepositRefunded}
          onChange={(e) => setIsDepositRefunded(e.target.checked)}
        />
        Deposit Refunded
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isVacatedAlready}
          onChange={(e) => setIsVacatedAlready(e.target.checked)}
        />
        Already Vacated
      </label>
      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Remove Tenant
        </button>
        <button
          type="button"
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RemoveTenantForm;
