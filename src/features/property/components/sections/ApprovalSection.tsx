import { FaEdit, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import GlobalAlert from "../../../../components/GlobalAlert";
import Modal from "../Modal";

const ApprovalSection = ({
  propertyId,
  userId,
  userName,
  userRole,
  isOwner,
  handleAction,
  requestedUsers,
  approvals = [],
  loading = false,
}: {
  propertyId: string;
  userId: string;
  userName: string;
  userRole: string;
  isOwner: boolean;
  handleAction: (approvalId: string, action: "approve" | "reject") => void;
  requestedUsers: any[];
  approvals: any[];
    loading?: boolean;
}) => {
  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  

  const filteredApprovals = approvals.filter((approval) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (approval.name && approval.name.toLowerCase().includes(q)) ||
      (approval.bedId && approval.bedId.toLowerCase().includes(q)) ||
      (approval.phone && approval.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div
            className="sticky top-0 z-10 bg-white -mt-5"
            style={{ marginBottom: "1rem" }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, bed ID, or phone"
              className="w-full px-3 py-2 border rounded focus:outline-none"
            />
          </div>
          <h2 className="text-lg font-semibold mb-2 -mt-2">Approval Requests</h2>

          {alert && (
            <GlobalAlert message={alert.message} type={alert.type || "info"} />
          )}
          {approvals.length === 0 ? (
            <p>No approval requests found.</p>
          ) : (
            <ul className="space-y-4">
              {approvals.map((approval) =>
                approval && approval.previousSnapshot ? (
                  <li key={approval._id} className="border p-4 bg-purple-200 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>
                          <b>Name: </b>
                          {approval.name}
                        </p>
                        <p>
                          <b>ID: </b>
                          {approval.tenantId}
                        </p>
                        <p>
                          <b>Phone: </b>
                          {approval.phone}
                        </p>
                        <p>
                          <b>Stay: </b>
                          {approval.bedId}
                        </p>
                        <p>
                          <b>Deposit: </b>
                          {approval?.previousSnapshot?.deposit || "N/A"}
                        </p>
                        <p>
                          <b>Reason: </b>
                          {approval.reason}
                        </p>
                      </div>
                      {isOwner && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setModalOpen(true)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-0 text-sm text-gray-500">
                      Requested on:{" "}
                      {new Date(approval.vacateRaisedAt).toLocaleDateString()}
                      <br />
                      Vacate Type:{" "}
                      {approval.isImmediateVacate
                        ? "Immediate"
                        : "Vacated Already"}
                      <br />
                      <p className="bg-yellow-100 p-2 rounded-md">
                        <b>Notes: </b>
                        {approval.ownerDepositInfo || "N/A"}
                      </p>
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`${
                          approval.status === "pending"
                            ? "text-yellow-600"
                            : approval.status === "approved"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {approval.status}
                      </span>{" "}
                      {modalOpen && (
                        <Modal onClose={() => setModalOpen(false)}>
                          {approval.status === "pending_owner_approval" &&
                            isOwner && (
                              <div className="p-0">
                                <div className="mb-4">
                                  <p className="text-sm text-gray-500">
                                    <b>Owner Approval Required</b>
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    handleAction(approval._id, "approve");
                                    setModalOpen(false);
                                  }}
                                  className="bg-green-600 text-white px-3 py-1 rounded"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    handleAction(approval._id, "reject");
                                    setModalOpen(false);
                                  }}
                                  className="bg-red-600 text-white px-3 py-1 rounded ml-2"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => setModalOpen(false)}
                                  className="bg-gray-300 text-gray-900 px-3 py-1 rounded ml-2"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                        </Modal>
                      )}
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
export default ApprovalSection;
