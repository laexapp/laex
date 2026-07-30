import { ReactNode } from "react";
import clsx from "clsx";

interface GradientTitleProps {
  children: ReactNode;
  className?: string;
}

export default function GradientTitle({
  children,
  className,
}: GradientTitleProps) {
  return (
    <h1
      className={clsx(
        "font-black tracking-[-0.045em]",
        "text-5xl leading-[0.98] md:text-7xl",
        "bg-gradient-to-br from-white via-cyan-100 to-cyan-400",
        "bg-clip-text text-transparent",
        "drop-shadow-[0_10px_40px_rgba(55,216,238,.12)]",
        className
      )}
    >
      {children}
    </h1>
  );
}
