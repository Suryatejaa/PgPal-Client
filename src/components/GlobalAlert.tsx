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
      ? "bg-red-100 text-red-800"
      : type === "success"
      ? "bg-green-100 text-green-800"
      : "bg-purple-100 text-purple-800";

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
    }, 2000);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="fixed top-1 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-xs sm:max-w-md md:max-w-lg px-2 sm:px-0">
      <div
        ref={wrapperRef}
        className={`flex items-center gap-2 px-1 py-2 rounded shadow-lg ${color} w-full`}
      >
        <span className="">{message}</span>
      </div>
    </div>
  );
};

export default GlobalAlert;
