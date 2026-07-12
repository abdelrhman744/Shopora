import { ReactNode } from "react";
import { GRADIENT } from "@/lib/theme";

export default function GradientText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{ backgroundImage: GRADIENT }}
    >
      {children}
    </span>
  );
}
