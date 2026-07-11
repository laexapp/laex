"use client";

import type { ReactNode } from "react";

export interface FormProviderProps {
  children: ReactNode;
}

export default function FormProvider({
  children,
}: FormProviderProps) {
  return (
    <>
      {children}
    </>
  );
}