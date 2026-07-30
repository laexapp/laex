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
        "relative inline-flex items-center justify-center overflow-hidden rounded-2xl font-semibold",
        "transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-laex-standard",
        "focus:outline-none focus:ring-2 focus:ring-cyan-300/80 focus:ring-offset-2 focus:ring-offset-[#05070d]",
        "active:translate-y-px disabled:pointer-events-none disabled:opacity-50",

        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
        },

        {
          "border border-cyan-200/25 bg-gradient-to-b from-cyan-300 to-cyan-500 text-[#031016] shadow-[0_12px_34px_rgba(34,199,230,.22)] hover:-translate-y-0.5 hover:from-cyan-200 hover:to-cyan-400 hover:shadow-[0_18px_46px_rgba(34,199,230,.34)]":
            variant === "primary",

          "border border-white/15 bg-white/[0.055] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/[0.09] hover:shadow-[0_14px_38px_rgba(2,4,10,.36)]":
            variant === "secondary",

          "bg-transparent text-slate-300 hover:bg-white/[0.055] hover:text-white":
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
