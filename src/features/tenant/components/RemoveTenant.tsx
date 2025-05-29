import React, { useState, useEffect } from "react";

const VacateForm = ({
  onSubmit,
  onCancel,
  currentStay,
  isVacate,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isVacate: boolean;
  currentStay: {
    rentDue?: number;
    rentPaidStatus?: string;
    deposit?: number;
  };
}) => {
  const [reason, setReason] = useState("");
  const [isImmediateVacate, setIsImmediateVacate] = useState(false);
  const [isVacatedAlready, setIsVacatedAlready] = useState(false);
  const [isDepositRefunded, setIsDepositRefunded] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [timer, setTimer] = useState(5);

  const hasUnpaidDues = (currentStay?.rentDue ?? 0) > 0;

  // Disable checkboxes if tenant has dues
  const disableImmediate = hasUnpaidDues;
  const disableAlready = hasUnpaidDues;

  // Show warning if either is checked
  const showWithdrawWarning = isImmediateVacate || isVacatedAlready;

  // Handle 5-second disable logic
  useEffect(() => {
    if (showWithdrawWarning) {
      setSubmitDisabled(true);
      setTimer(5);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setSubmitDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setSubmitDisabled(false);
      setTimer(5);
    }
  }, [isImmediateVacate, isVacatedAlready]);

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          reason,
          isImmediateVacate,
          isVacatedAlready,
          isDepositRefunded: !isVacate ? isDepositRefunded : undefined,
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
          disabled={disableImmediate}
        />
        Immediate Vacate
        {disableImmediate && (
          <span className="text-xs text-red-500 ml-2">
            (Clear dues to enable)
          </span>
        )}
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isVacatedAlready}
          onChange={(e) => setIsVacatedAlready(e.target.checked)}
          disabled={disableAlready}
        />
        Already Vacated
        {disableAlready && (
          <span className="text-xs text-red-500 ml-2">
            (Clear dues to enable)
          </span>
        )}
      </label>

      {/* Show deposit refunded checkbox only for owner (isVacate === false) */}
      {!isVacate && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isDepositRefunded}
            onChange={(e) => setIsDepositRefunded(e.target.checked)}
          />
          Deposit Refunded
        </label>
      )}

      {showWithdrawWarning && (
        <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-sm mb-2">
          <b>Warning:</b> Immediate/Vacated Already requests cannot be
          withdrawn.
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          className={`bg-red-600 text-white px-4 py-2 rounded ${
            submitDisabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={submitDisabled}
        >
          {submitDisabled
            ? `${isVacate ? "Confirm Vacate" : "Remove Tenant"} ${timer}s...`
            : isVacate
            ? "Confirm Vacate"
            : "Remove Tenant"}
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

export default VacateForm;
