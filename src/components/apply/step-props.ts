import type { FormValues } from "./form-state";

export type StepProps = {
  v: FormValues;
  set: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void;
  err: (path: string) => string | undefined;
};
