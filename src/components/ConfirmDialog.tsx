import React from "react";
import Modal from "../features/room/components/Modal";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No",
}: {
  open: boolean;
  title?: string;
  message: any;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}) =>
  !open ? null : (
    <Modal onClose={onCancel}>
      <div className="p-0">
        <div className="font-bold text-lg text-red-600 mb-2">{title}</div>
        <div className="mb-4 text-gray-700">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-1 rounded bg-gray-200 text-gray-700"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-1 rounded bg-red-600 text-white"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );

export default ConfirmDialog;
