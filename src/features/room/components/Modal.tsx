const Modal: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({
  children,
  onClose,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="relative w-full max-w-sm mx-4 sm:mx-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 max-h-[90vh] flex flex-col">     
      <div
        className="overflow-y-auto mt-1 scrollbar-none"
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
