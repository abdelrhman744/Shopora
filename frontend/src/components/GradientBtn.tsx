import { ReactNode, MouseEventHandler } from "react";
import { GRADIENT_BTN } from "@/lib/theme";

export default function GradientBtn({
  children,
  onClick,
  className = "",
  size = "md",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const pad =
    size === "sm"
      ? "px-4 py-2 text-sm"
      : size === "lg"
      ? "px-8 py-4 text-base"
      : "px-6 py-3 text-sm";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative font-semibold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${pad} ${className}`}
      style={{ background: GRADIENT_BTN, boxShadow: "0 4px 30px rgba(255,45,149,0.35)" }}
    >
      {children}
    </button>
  );
}
