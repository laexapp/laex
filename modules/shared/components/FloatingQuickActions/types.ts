import type { LucideIcon } from "lucide-react";

export type FloatingQuickAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  visual?: () => React.ReactNode;
  accent?: "green" | "cyan" | "violet" | "gold";
  href?: string;
  panel?: () => React.ReactNode;
};

export type FloatingQuickActionsProps = {
  actions: FloatingQuickAction[];
  ariaLabel?: string;
};
