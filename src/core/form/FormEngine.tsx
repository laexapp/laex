"use client";

import type { ReactNode } from "react";

export interface FormEngineProps {
  children: ReactNode;
}

export default function FormEngine({
  children,
}: FormEngineProps) {
  return (
    <>
      {children}
    </>
  );
}