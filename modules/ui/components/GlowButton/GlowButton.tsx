import { ButtonHTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

interface GlowButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export default function GlowButton({
  children,
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: GlowButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={clsx(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-cyan-400",

        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
        },

        {
          "bg-cyan-500 text-white shadow-[0_0_25px_rgba(34,211,238,.35)] hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,.6)]":
            variant === "primary",

          "border border-white/15 bg-white/5 backdrop-blur-xl hover:border-cyan-400/60 hover:bg-white/10":
            variant === "secondary",

          "bg-transparent hover:bg-white/5":
            variant === "ghost",
        },

        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}