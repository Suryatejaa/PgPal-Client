import React, { useEffect, useState } from "react";
import {
  getAllComplaints,
  raiseComplaint,
  deleteComplaint,
  getComplaintMetrics,
  updateComplaint,
} from "../../services/complaintsApi";
import Modal from "../Modal";
import AddComplaintForm from "../AddComplaintForm";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import ComplaintActionForm from "../ComplaintActionForm";

const ComplaintsSection = ({
  property,
  userPpid,
  isOwner,
  refreshKey = 0,
}: {
  property: any;
  userPpid: any;
  isOwner: boolean;
  refreshKey?: number;
}) => {
  if (!property || !property.pgpalId) {
    return <div className="text-gray-500 text-sm">No property selected.</div>;
  }
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type?: string } | null>(
    null
  );
  const [metrics, setMetrics] = useState<any>(null);
  const [filter, setFilter] = useState(
    () => sessionStorage.getItem("complaintFilter") || "all"
  );
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    complaintId: string | null;
  }>({ open: false, complaintId: null });
  const [actionComplaint, setActionComplaint] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [openNotes, setOpenNotes] = useState<{
    [complaintId: string]: boolean;
  }>({});

  const COMPLAINT_FILTERS = [
    { key: "all", label: "All" },
    { key: "Pending", label: "Pending" },
    { key: "In Progress", label: "In Progress" },
    { key: "Resolved", label: "Resolved" },
    { key: "Closed", label: "Closed" },
    { key: "Rejected", label: "Rejected" },
  ];

  useEffect(() => {
    // Save filter to session storage
    sessionStorage.setItem("complaintFilter", filter);
  }, [filter]);

  const filteredComplaints = React.useMemo(() => {
    if (filter === "all") {
      // Sort by latest note date, fallback to createdAt
      return [...complaints].sort((a, b) => {
        const aLatest =
          a.notes && a.notes.length > 0
            ? new Date(a.notes[a.notes.length - 1].at).getTime()
            : new Date(a.createdAt).getTime();
        const bLatest =
          b.notes && b.notes.length > 0
            ? new Date(b.notes[b.notes.length - 1].at).getTime()
            : new Date(b.createdAt).getTime();
        return bLatest - aLatest;
      });
    }
    return complaints
      .filter((c) => c.status === filter)
      .sort((a, b) => {
        const aLatest =
          a.notes && a.notes.length > 0
            ? new Date(a.notes[a.notes.length - 1].at).getTime()
            : new Date(a.createdAt).getTime();
        const bLatest =
          b.notes && b.notes.length > 0
            ? new Date(b.notes[b.notes.length - 1].at).getTime()
            : new Date(b.createdAt).getTime();
        return bLatest - aLatest;
      });
  }, [complaints, filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getAllComplaints(property.pgpalId);
      setComplaints(
        res.data.filter((c: any) => c.propertyId === property.pgpalId)
      );
    } catch (e: any) {
      setAlert({
        message: e?.response?.data?.error || "Failed to fetch complaints",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await getComplaintMetrics(property.pgpalId);
      setMetrics(res.data);
    } catch {}
  };

  useEffect(() => {
    if (property?.pgpalId) {
      fetchComplaints();
      fetchMetrics();
    }
  }, [property?.pgpalId, refreshKey]);

  const handleRaiseComplaint = async (data: any) => {
    try {
      await raiseComplaint(data);
      await fetchComplaints();
      setShowForm(false);
      setAlert({ message: "Complaint raised!", type: "success" });
      fetchMetrics();
    } catch (e: any) {
      setAlert({
        message: e?.response?.data?.error || "Failed to raise complaint",
        type: "error",
      });
    }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    try {
      await deleteComplaint(complaintId);
      await fetchComplaints();
      setAlert({ message: "Complaint deleted!", type: "success" });
      fetchMetrics();
    } catch (e: any) {
      setAlert({
        message: e?.response?.data?.error || "Failed to delete complaint",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handleUpdateComplaint = async (data: any) => {
    setActionLoading(true);
    try {
      const res = await updateComplaint(actionComplaint.complaintId, data);

      console.log(data, res);
      await fetchComplaints();
      setActionComplaint(null);
      setAlert({ message: "Complaint updated!", type: "success" });
      fetchMetrics();
    } catch (e: any) {
      console.log(data);
      console.log(e);
      setAlert({
        message: e?.response?.data?.error || "Failed to update complaint",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="sticky z-20 flex overflow-x-auto text-sm -mt-1 pb-1 bg-purple-300 border-gray-200"
        style={{ top: 139 }}
      >
        {COMPLAINT_FILTERS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`px-3 py-2 whitespace-nowrap font-semibold transition focus:outline-none
        ${
          filter === opt.key
            ? "bg-transparent text-black rounded-t-md rounded-b-none border-none"
            : "bg-transparent text-indigo-700 hover:text-purple-700 border-none"
        }`}
          >
            {opt.label} (
            {opt.key === "all"
              ? complaints.length
              : complaints.filter((c) => c.status === opt.key).length}
            )
          </button>
        ))}
      </div>
      {alert && (
        <div
          className={`mb-2 text-sm ${
            alert.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {alert.message}
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4 shadow-none border-b-none mt-2">
          {filteredComplaints.length === 0 && (
            <div className="text-gray-500 text-sm">No complaints found.</div>
          )}
          {filteredComplaints.map((c) => (
            <div
              key={c.complaintId}
              className="border rounded p-3 relative  bg-white rounded-lg shadow-none"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="font-bold text-sm text-purple-800">
                    {c.complaintId}
                  </div>
                  <span className="font-semibold">{c.complaintType}</span>
                  <span className="ml-1 text-xs text-gray-500">
                    ({c.complaintOn})
                  </span>

                  <div className="text-xs text-gray-500 -mb-2">
                    <p>
                      <b>Created by:</b> {c.tenantName}
                    </p>
                    <p>
                      <b>Room No:</b> {c.tenantStay?.roomNo}, <b>Bed: </b>{" "}
                      {c.tenantStay?.bedId}
                    </p>
                    <p>
                      <b>Created at:</b>{" "}
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <b>Status:</b> {c.status}
                    </p>
                    <p>
                      <b>Priority:</b> {c.complaintMetadata?.priority} |{" "}
                      <b>Response:</b> {c.complaintMetadata?.responseTime}
                    </p>
                  </div>
                </div>
                {!["Closed", "Rejected"].includes(c.status) && (
                  <button
                    className="text-purple-600 bg-gray-100 border-none text-sm font-semibold px-2 py-1 rounded hover:bg-purple-50 self-start"
                    onClick={() => setActionComplaint(c)}
                  >
                    Update
                  </button>
                )}
              </div>
              <div className="mt-3 mb-1 text-md text-black bg-gray-200 p-2 w-full rounded">
                <b className="text-purple-900">Description:</b> {c.description}
              </div>
              {c.notes && c.notes.length > 0 && (
                <div className="mt-3 bg-gray-50 border rounded p-2">
                  <div
                    className="font-semibold text-xs text-gray-700 mb-1 cursor-pointer select-none flex items-center"
                    onClick={() =>
                      setOpenNotes((prev) => ({
                        ...prev,
                        [c.complaintId]: !prev[c.complaintId],
                      }))
                    }
                  >
                    Notes
                    <span className="ml-2 text-purple-600">
                      [{openNotes[c.complaintId] ? "Hide" : "Show"}]
                    </span>
                  </div>
                  {openNotes[c.complaintId] && (
                    <div className="flex flex-col gap-2">
                      {c.notes.map((note: any) => (
                        <div
                          key={note._id}
                          className="text-xs text-gray-800 border-b pb-1 last:border-b-0"
                        >
                          <div>
                            <span className="font-medium">{note.by}</span>
                            <span className="ml-2 text-gray-500">
                              {note.at
                                ? new Date(note.at).toLocaleString()
                                : ""}
                            </span>
                            <span>
                              {note.by === userPpid
                                ? " (You)"
                                : isOwner
                                ? " (Tenant)"
                                : " (Owner)"}
                            </span>
                          </div>
                          <div className="ml-0">{note.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <AddComplaintForm
            propertyId={property.pgpalId}
            onSubmit={handleRaiseComplaint}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
      {actionComplaint && (
        <Modal onClose={() => setActionComplaint(null)}>
          <ComplaintActionForm
            complaint={actionComplaint}
            loading={actionLoading}
            onCancel={() => setActionComplaint(null)}
            onSubmit={handleUpdateComplaint}
            userId={userPpid}
            allowClose={actionComplaint.createdBy === userPpid}
          />
        </Modal>
      )}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Complaint"
        message="Are you sure you want to delete this complaint?"
        onConfirm={async () => {
          if (confirmDelete.complaintId) {
            await handleDeleteComplaint(confirmDelete.complaintId);
          }
          setConfirmDelete({ open: false, complaintId: null });
        }}
        onCancel={() => setConfirmDelete({ open: false, complaintId: null })}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ComplaintsSection;
