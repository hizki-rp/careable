/* eslint-disable no-unused-vars */

import { type ReactNode } from "react";
import { type FieldValues, type UseFormReturn } from "react-hook-form";

export interface CustomFormFieldProps {
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  className?: string;
  control: any; // UseFormReturn<FieldValues>["control"]
}

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  FILE_UPLOADER = "fileUploader",
}

export type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type Status = "pending" | "scheduled" | "cancelled";

export interface Appointment {
  patient: { name: string, image?: string };
  schedule: string;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}
