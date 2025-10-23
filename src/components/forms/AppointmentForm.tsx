"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/lib/types";
import { Button } from "../ui/button";
import { Doctors } from "@/lib/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";

const formSchema = z.object({
  primaryPhysician: z.string().min(2, "Select a physician"),
  schedule: z.date(),
  reason: z.string().min(2, "Reason must be at least 2 characters").max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});


const AppointmentForm = ({
  type,
  userId,
  patientId,
}: {
  type: "create" | "cancel" | "schedule";
  userId: string;
  patientId: string;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });
  
  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(()=>{})} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Request a new appointment in 10 seconds</p>
        </section>

        {type === "create" && (
            <>
            <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Primary care physician"
                placeholder="Select a physician"
            >
                {Doctors.map((doctor, i) => (
                    <SelectItem key={doctor.name + i} value={doctor.name}>
                        <div className="flex cursor-pointer items-center gap-2">
                            <Image
                            src={doctor.image}
                            width={32}
                            height={32}
                            alt="doctor"
                            className="rounded-full"
                            />
                            <p>{doctor.name}</p>
                        </div>
                    </SelectItem>
                ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />
             <div
              className={`flex flex-col gap-6  ${
                type === "create" && "xl:flex-row"
              }`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="ex: Annual monthly check-up"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Additional comments/notes"
                placeholder="ex: Prefer afternoon appointments, if possible"
              />
            </div>
            </>
        )}
        
        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}
        
        <Button type="submit" disabled className="shad-primary-btn w-full">
          {buttonLabel}
        </Button>
      </form>
    </Form>
  );
};

export default AppointmentForm;
