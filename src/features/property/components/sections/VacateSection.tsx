import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import RemoveTenantForm from "../../../tenant/components/RemoveTenant";
import axiosInstance from "../../../../services/axiosInstance";
import GlobalAlert from "../../../../components/GlobalAlert";

const VacateSection = ({
  propertyId,
  userPgPalId,
  onVacateChange,
  currentStay,
}: {
  propertyId: string;
  userPgPalId: any;
  onVacateChange?: () => void;
  currentStay?: any;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [vacateRequest, setVacateRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [globalAlert, setGlobalAlert] = useState<string | null>(null);
  const [pendingApproval, setPendingApproval] = useState(false);

  // Fetch current vacate request for this tenant/property
  useEffect(() => {
    const fetchVacate = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/tenant-service/vacate-request/${propertyId}/${userPgPalId}`
        );
        const vacateReq = res.data?.vacateRequests?.find(
          (req: any) => req.status === "noticeperiod"
        );
        setVacateRequest(vacateReq || null);

        const pendingReq = res.data?.vacateRequests?.find(
          (req: any) => req.status === "pending_owner_approval"
        );
        setPendingApproval(!!pendingReq);
      } catch {
        setVacateRequest(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVacate();
  }, [propertyId, userPgPalId, showModal]);

  // Raise vacate request
  const handleVacate = async (data: any) => {
    setActionLoading(true);
    setAlert(null);
    setGlobalAlert(null);
    try {
      const res = await axiosInstance.post("/tenant-service/vacate", {
        ...data,
      });
      setAlert(
        res.data?.message ||
          res.data?.error ||
          res.data?.details?.status ||
          "Vacate request created successfully"
      );
      setShowModal(false);
      setVacateRequest(res.data.vacateRequest || res.data);
      if (onVacateChange) onVacateChange();
    } catch (e: any) {
      // Show server error message in GlobalAlert if present, else fallback
      setGlobalAlert(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          "Failed to raise vacate request"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Withdraw vacate request
  const handleWithdraw = async () => {
    setActionLoading(true);
    setAlert(null);
    setGlobalAlert(null);
    try {
      const res = await axiosInstance.post("/tenant-service/withdraw-vacate", {
        vacateRequestId: vacateRequest._id,
      });
      setAlert(res.data?.message || "Vacate request withdrawn successfully");
      setVacateRequest(null);
      if (onVacateChange) onVacateChange();
    } catch (e: any) {
      setGlobalAlert(
        e?.response?.data?.error || "Failed to withdraw vacate request"
      );
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  // Withdraw window logic (7 days from vacateRaisedAt)
  let canWithdraw = false;
  let withdrawNote = "";
  if (vacateRequest && vacateRequest.vacateRaisedAt) {
    const raisedAt = new Date(vacateRequest.vacateRaisedAt).getTime();
    const now = Date.now();
    const withdrawEnd = raisedAt + 7 * 24 * 60 * 60 * 1000;
    canWithdraw = !vacateRequest.removedByOwner && now < withdrawEnd;
    if (canWithdraw) {
      withdrawNote = `You can withdraw this request until ${new Date(
        withdrawEnd
      ).toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    }
  }

  return (
    <div className="bg-white/80 rounded-xl shadow-lg p-6 border border-purple-200">
      {globalAlert && (
        <GlobalAlert
          type="error"
          message={globalAlert}
          onClose={() => setGlobalAlert(null)}
        />
      )}
      {alert && (
        <div className="mb-3 text-sm text-green-700 bg-green-100 rounded px-3 py-2">
          {alert}
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : vacateRequest ? (
        <div>
          <div className="mb-2 font-semibold text-purple-700">
            Vacate Request Status:{" "}
            <span className="text-black">{vacateRequest.status}</span>
          </div>
          <div className="mb-2 text-sm">
            <b>Reason:</b> {vacateRequest.reason}
            <br />
            <b>Immediate Vacate:</b>{" "}
            {vacateRequest.isImmediateVacate ? "Yes" : "No"}
            <br />
            <b>Deposit:</b>{" "}
            {vacateRequest.isDeppositRefunded
              ? "Refunded"
              : vacateRequest.tenantDepositInfo || "-"}
            <br />
            <b>Vacate Date:</b>{" "}
            {vacateRequest.vacateDate
              ? new Date(vacateRequest.vacateDate).toLocaleDateString()
              : "-"}
          </div>
          <div className="mb-1 text-xs text-gray-600">
            {vacateRequest.status === "noticeperiod" && (
              <>
                <b>Notice Period:</b>{" "}
                {vacateRequest.noticePeriodStartDate
                  ? new Date(
                      vacateRequest.noticePeriodStartDate
                    ).toLocaleDateString()
                  : "-"}{" "}
                to{" "}
                {vacateRequest.noticePeriodEndDate
                  ? new Date(
                      vacateRequest.noticePeriodEndDate
                    ).toLocaleDateString()
                  : "-"}
              </>
            )}
          </div>
          {canWithdraw && (
            <div className="text-xs text-yellow-800 bg-yellow-100 rounded px-2 py-1 mb-2">
              {withdrawNote}
            </div>
          )}
          {canWithdraw ? (
            <div className="flex gap-2 mt-1">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleWithdraw}
                disabled={actionLoading}
              >
                Withdraw Vacate Request
              </button>
            </div>
          ) : vacateRequest.removedByOwner ? (
            <h3 className="text-red-600">
              <b>You had been removed by Owner, contact owner to re-join.</b>
            </h3>
          ) : (
            <div className="text-gray-500 text-sm">
              Withdraw window has been closed
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition disabled:opacity-60"
            onClick={() => setShowModal(true)}
            disabled={pendingApproval}
          >
            Raise Vacate Request
          </button>
          {pendingApproval && (
            <div className="text-xs text-yellow-700 mt-2">
              You have already raised a vacate request. Waiting for owner
              approval.
            </div>
          )}
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <RemoveTenantForm
                onSubmit={handleVacate}
                onCancel={() => setShowModal(false)}
                isVacate={true}
                currentStay={currentStay}
              />
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default VacateSection;
