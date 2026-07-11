"use client";

import type { ReactNode } from "react";

export interface FormFieldProps {
  children: ReactNode;
}

export default function FormField({
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      {children}
    </div>
  );
}