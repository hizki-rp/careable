
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Appointment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import StatusBadge from './StatusBadge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

interface AppointmentDataTableProps {
  data: Appointment[];
}

const AppointmentDataTable = ({ data }: AppointmentDataTableProps) => {
  const router = useRouter();

  return (
    <div className="data-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((appointment) => (
              <TableRow key={appointment.patient.name}>
                <TableCell>
                    <div className="flex items-center gap-3">
                        {appointment.patient.image && (
                             <Image
                                src={appointment.patient.image}
                                alt={appointment.patient.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        )}
                        <p className="font-medium">{appointment.patient.name}</p>
                    </div>
                </TableCell>
                <TableCell>{new Date(appointment.schedule).toLocaleDateString()}</TableCell>
                <TableCell>
                    <StatusBadge status={appointment.status} />
                </TableCell>
                <TableCell>{appointment.primaryPhysician}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Cancel Appointment</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No appointments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentDataTable;
