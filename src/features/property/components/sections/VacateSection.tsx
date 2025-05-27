import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import RemoveTenantForm from "../../../tenant/components/RemoveTenant";
import axiosInstance from "../../../../services/axiosInstance";

const VacateSection = ({
  propertyId,
  userPgPalId,
  onVacateChange,
}: {
  propertyId: string;
  userPgPalId: any;
  onVacateChange?: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [vacateRequest, setVacateRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);

  // Fetch current vacate request for this tenant/property
  useEffect(() => {
    const fetchVacate = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/tenant-service/vacate-request/${propertyId}/${userPgPalId}`
        );
        setVacateRequest(res.data || null);
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
    try {
      const res = await axiosInstance.post("/tenant-service/vacate", {
        ...data,
      });
      setAlert(
        res.data?.Comments?.closureNote || "Vacate request created successfully"
      );
      setShowModal(false);
      setVacateRequest(res.data);
      if (onVacateChange) onVacateChange();
    } catch (e: any) {
      setAlert(e?.response?.data?.error || "Failed to raise vacate request");
    } finally {
      setActionLoading(false);
    }
  };

  // Withdraw vacate request
  const handleWithdraw = async () => {
    setActionLoading(true);
    setAlert(null);
    try {
      const res = await axiosInstance.post("/tenant-service/withdraw-vacate");
      setAlert(res.data?.message || "Vacate request withdrawn successfully");
      setVacateRequest(null);
      if (onVacateChange) onVacateChange();
    } catch (e: any) {
      setAlert(e?.response?.data?.error || "Failed to withdraw vacate request");
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

  let latestVacate = null;
  if (Array.isArray(vacateRequest) && vacateRequest.length > 0) {
    // Only consider requests that are not completed/vacated
    const activeRequests = vacateRequest.filter(
      (req) =>
        req.status !== "completed" &&
        req.status !== "vacated" &&
        req.status !== "closed"
    );
    if (activeRequests.length > 0) {
      latestVacate = activeRequests.reduce((latest, curr) =>
        new Date(curr.createdAt) > new Date(latest.createdAt) ? curr : latest
      );
    }
  }

  const canWithdraw =
    latestVacate &&
    !latestVacate.removedByOwner &&
    latestVacate.vacateRaisedAt &&
    Date.now() - new Date(latestVacate.vacateRaisedAt).getTime() <
      7 * 24 * 60 * 60 * 1000;

  let withdrawNote = "";
  if (canWithdraw && latestVacate?.vacateRaisedAt) {
    const withdrawEnd = new Date(
      new Date(latestVacate.vacateRaisedAt).getTime() + 7 * 24 * 60 * 60 * 1000
    );
    withdrawNote = `You can withdraw this request until ${withdrawEnd.toLocaleDateString(
      undefined,
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )}`;
  }

  return (
    <div className="bg-white/80 rounded-xl shadow-lg p-6 border border-purple-200">
      {alert && (
        <div className="mb-3 text-sm text-green-700 bg-green-100 rounded px-3 py-2">
          {alert}
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : latestVacate ? (
        <div>
          <div className="mb-2 font-semibold text-purple-700">
            Vacate Request Status:{" "}
            <span className="text-black">{vacateRequest.status}</span>
          </div>
          <div className="mb-2 text-sm">
            <b>Reason:</b> {latestVacate.reason}
            <br />
            <b>Immediate Vacate:</b>{" "}
            {latestVacate.isImmediateVacate ? "Yes" : "No"}
            <br />
            <b>Deposit:</b>
            {latestVacate.isDeppositRefunded
              ? "Refunded"
              : `${latestVacate.previousSnapshot.deposit}`}
            <br />
            <b>Vacate Date:</b>{" "}
            {latestVacate.vacateDate
              ? new Date(latestVacate.vacateDate).toLocaleDateString()
              : "-"}
          </div>
          <div className="mb-1 text-xs text-gray-600">
            {latestVacate.status === "noticeperiod" && (
              <>
                <b>Notice Period:</b>{" "}
                {latestVacate.noticePeriodStartDate
                  ? new Date(
                      latestVacate.noticePeriodStartDate
                    ).toLocaleDateString()
                  : "-"}{" "}
                to{" "}
                {latestVacate.noticePeriodEndDate
                  ? new Date(
                      latestVacate.noticePeriodEndDate
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
            <div className="flex gap-2 mt-2">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleWithdraw}
                disabled={actionLoading}
              >
                Withdraw Vacate Request
              </button>
            </div>
          ) : latestVacate.removedByOwner ? (
            <h3 className="text-red-600">
              <b>You had been remove by Owner, contact owner to re-join.</b>
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
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
            onClick={() => setShowModal(true)}
          >
            Raise Vacate Request
          </button>
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <RemoveTenantForm
                onSubmit={handleVacate}
                onCancel={() => setShowModal(false)}
                isVacate={true}
              />
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default VacateSection;
