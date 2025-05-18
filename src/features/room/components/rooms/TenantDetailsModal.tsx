import Modal from "../Modal";

const TenantDetailsModal = ({
  tenantModal,
  onClose,
}: {
  tenantModal: {
    open: boolean;
    loading: boolean;
    data: any | null;
    error: string | null;
  };
  onClose: () => void;
}) => (
  <Modal onClose={onClose} readonly>
    <div className="min-w-[260px] max-w-s p-2">
      <h4 className="text-lg font-bold mb-1 text-purple-700">Tenant Details</h4>
      {tenantModal.loading && <div>Loading...</div>}
      {tenantModal.error && (
        <div className="text-red-600">{tenantModal.error}</div>
      )}
      {tenantModal.data && (
        <div className="space-y-1 text-sm">
          <div>
            <span className="font-semibold">Name:</span> {tenantModal.data.name}
          </div>
          <div>
            <span className="font-semibold">Phone:</span>{" "}
            {tenantModal.data.phone}
          </div>
          <div>
            <span className="font-semibold">Aadhar:</span>{" "}
            {tenantModal.data.aadhar}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {tenantModal.data.status}
          </div>
          <div>
            <span className="font-semibold">In Notice Period:</span>{" "}
            {tenantModal.data.In_Notice_Period ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-semibold">Assigned At:</span>{" "}
            {tenantModal.data.currentStay?.assignedAt
              ? new Date(
                  tenantModal.data.currentStay.assignedAt
                ).toLocaleString()
              : "N/A"}
          </div>
          <div>
            <span className="font-semibold">Rent Paid Status:</span>{" "}
            {tenantModal.data.currentStay?.rentPaidStatus || "N/A"}
          </div>
        </div>
      )}
      <button
        className="mt-4 block w-full bg-purple-600 text-white py-1 rounded"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </Modal>
);

export default TenantDetailsModal;
