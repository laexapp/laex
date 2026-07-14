export type FormStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export interface FormState<T> {
  values: T;
  status: FormStatus;
  message?: string;
}

export interface FormEngine<T> {
  initialValues: T;
  submit: (values: T) => Promise<void>;
}

export function createFormEngine<T>(
  config: FormEngine<T>
): FormEngine<T> {
  return config;
}