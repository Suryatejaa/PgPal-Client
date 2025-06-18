/* filepath: d:\project\PgPaal\PgPaalWeb\src\components\ui\Text.tsx */
import React from "react";
import { clsx } from "clsx";

interface TextProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  variant?:
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "body"
    | "small"
    | "caption";
  color?:
    | "white"
    | "black"
    | "gray-900"
    | "gray-600"
    | "purple-600"
    | "inherit";
  children: React.ReactNode;
  className?: string;
}

const Text: React.FC<TextProps> = ({
  as: Component = "p",
  variant = "body",
  color = "inherit",
  children,
  className,
  ...props
}) => {
  const variants = {
    "heading-1": "text-4xl md:text-6xl font-bold leading-tight",
    "heading-2": "text-3xl md:text-5xl font-bold leading-tight",
    "heading-3": "text-2xl md:text-3xl font-semibold leading-tight",
    body: "text-base leading-relaxed",
    small: "text-sm leading-normal",
    caption: "text-xs leading-normal",
  };

  const colors = {
    white: "text-force-white",
    black: "text-force-black",
    "gray-900": "text-force-gray-900",
    "gray-600": "text-gray-600",
    "purple-600": "text-purple-600",
    inherit: "color-inherit",
  };

  return (
    <Component
      className={clsx(variants[variant], colors[color], className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
