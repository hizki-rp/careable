
'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Patient, usePatientQueue } from '@/context/PatientQueueContext';
import { Button } from '@/components/ui/button';
import { FileText, Eye, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface PatientDataTableProps {
  data: Patient[];
}

const PatientDataTable = ({ data }: PatientDataTableProps) => {
  const router = useRouter();
  const { reAdmitPatient } = usePatientQueue();
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleViewSummary = (patientId: string) => {
    router.push(`/patients/${patientId}/summary`);
  };

  const handleViewPrescription = (patientId: string) => {
    router.push(`/patients/${patientId}/prescription`);
  };

  const openReAdmitAlert = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsAlertOpen(true);
  };

  const handleReAdmit = () => {
    if (selectedPatient) {
      reAdmitPatient(selectedPatient.id);
      toast({
        title: "Patient Re-admitted",
        description: `${selectedPatient.name} has been added back to the waiting room.`,
      });
      setIsAlertOpen(false);
      setSelectedPatient(null);
      router.push('/reception/queue');
    }
  };

  return (
    <>
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
                        onClick={() => openReAdmitAlert(patient)}
                        title="Re-admit Patient for New Examination"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
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

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Re-admit Patient?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to re-admit <span className="font-bold">{selectedPatient?.name}</span> for a new examination? This will add them back to the waiting room queue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPatient(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReAdmit}>
              Re-admit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PatientDataTable;
