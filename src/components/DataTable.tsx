import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Appointment, Status } from "@/lib/types";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import { Doctors } from "@/lib/constants";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const dummyAppointments: Appointment[] = [
    {
        patient: { name: "John Doe", image: Doctors[0].image },
        schedule: new Date().toISOString(),
        status: "scheduled",
        primaryPhysician: Doctors[0].name,
        reason: "Annual Check-up",
        note: "Prefers morning appointments.",
        userId: "user1",
        cancellationReason: null,
    },
    {
        patient: { name: "Jane Smith", image: Doctors[1].image },
        schedule: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        primaryPhysician: Doctors[1].name,
        reason: "Follow-up",
        note: "",
        userId: "user2",
        cancellationReason: null,
    },
    {
        patient: { name: "Robert Brown", image: Doctors[2].image },
        schedule: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "cancelled",
        primaryPhysician: Doctors[2].name,
        reason: "Sore throat",
        note: "",
        userId: "user3",
        cancellationReason: "Scheduling conflict",
    },
    {
        patient: { name: "Emily White", image: Doctors[0].image },
        schedule: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "scheduled",
        primaryPhysician: Doctors[0].name,
        reason: "Vaccination",
        note: "Allergic to penicillin.",
        userId: "user4",
        cancellationReason: null,
    },
];

const DataTable = () => {
  return (
    <div className="data-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Appointment</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyAppointments.map((appointment) => (
            <TableRow key={appointment.userId}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={appointment.patient.image || '/assets/icons/user.svg'}
                    alt={appointment.patient.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <p className="text-14-medium">{appointment.patient.name}</p>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={appointment.status as Status} />
              </TableCell>
              <TableCell>
                <p>
                  {new Date(appointment.schedule).toLocaleDateString()} -{" "}
                  {new Date(appointment.schedule).toLocaleTimeString()}
                </p>
                <p className="text-12-regular text-dark-700">{appointment.reason}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={Doctors.find(d => d.name === appointment.primaryPhysician)?.image || '/assets/icons/user.svg'}
                    alt={appointment.primaryPhysician}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <p className="whitespace-nowrap">Dr. {appointment.primaryPhysician}</p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2">
                        <MoreVertical size={20} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="shad-menu">
                    <DropdownMenuItem>Schedule</DropdownMenuItem>
                    <DropdownMenuItem>Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
