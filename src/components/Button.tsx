/* filepath: d:\project\PgPaal\PgPaalWeb\src\components\ui\Button.tsx */
import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-purple-600 text-force-white border border-purple-600 hover:bg-purple-700 hover:border-purple-700 focus:ring-purple-500",
    secondary:
      "bg-force-white text-purple-600 border border-purple-600 hover:bg-purple-50 focus:ring-purple-500",
    outline:
      "bg-force-transparent text-force-white border-2 border-force-white hover:bg-force-white hover:text-purple-700 focus:ring-white",
    ghost:
      "bg-white/10 backdrop-blur-sm text-black border border-white/20 hover:bg-white/20 focus:ring-white",
    gradient:
      "bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 hover:shadow-lg transform hover:scale-105 focus:ring-yellow-400",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
