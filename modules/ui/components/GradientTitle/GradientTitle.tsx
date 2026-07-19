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
        "font-black tracking-tight",
        "text-5xl md:text-7xl",
        "bg-gradient-to-r from-white via-cyan-200 to-cyan-500",
        "bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </h1>
  );
}