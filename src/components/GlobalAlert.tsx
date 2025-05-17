import React from "react";

const GlobalAlert = ({
  message,
  type = "info", // "info" | "success" | "error"
  onClose,
}: {
  message: string;
  type?: "info" | "success" | "error";
  onClose?: () => void;
}) => {
  const color =
    type === "error"
      ? "from-red-500 to-pink-500"
      : type === "success"
      ? "from-green-500 to-teal-400"
      : "from-purple-600 to-indigo-600";

  // Handle click outside the alert box
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!onClose) return;
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 20000);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="fixed top-1 left-1/2 transform -translate-x-1/2 z-[100]">
      <div
        ref={wrapperRef}
        className={`flex items-center gap-2 px-1 py-2 rounded shadow-lg text-black bg-gradient-to-r ${color}`}
      >
        <span className="">{message}</span>
      </div>
    </div>
  );
};

export default GlobalAlert;
