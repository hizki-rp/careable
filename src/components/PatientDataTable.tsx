
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
import { type Patient } from '@/context/PatientQueueContext';
import { Button } from '@/components/ui/button';
import { FileText, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from './ui/badge';

interface PatientDataTableProps {
  data: Patient[];
}

const PatientDataTable = ({ data }: PatientDataTableProps) => {
  const router = useRouter();

  const handleViewSummary = (patientId: string) => {
    router.push(`/patients/${patientId}/summary`);
  };

  const handleViewPrescription = (patientId: string) => {
    router.push(`/patients/${patientId}/prescription`);
  };

  return (
    <div className="data-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Sex</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.sex}</TableCell>
                <TableCell>{patient.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={patient.stage === 'Discharged' ? 'secondary' : 'default'}>
                    {patient.stage}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewSummary(patient.id)}
                      title="View Patient Summary"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewPrescription(patient.id)}
                      disabled={patient.stage !== 'Discharged'}
                      title="View Prescription"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientDataTable;
