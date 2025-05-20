import React from "react";

const Modal: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
  readonly?: boolean;
}> = ({ children, onClose, readonly }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={() => {
      if (readonly) onClose();
    }}
  >
    <div
      className="relative w-full max-w-sm mx-4 sm:mx-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 max-h-[90vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="overflow-y-auto mt-1 scrollbar-none text-gray-700"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
      <style>
        {`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  </div>
);

export default Modal;
