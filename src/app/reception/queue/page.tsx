'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, User, Stethoscope, Beaker, ClipboardPlus, FileText, Printer, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePatientQueue, type Patient, type QueueStage } from '@/context/PatientQueueContext';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STAGES: QueueStage[] = ['Waiting Room', 'Questioning', 'Laboratory Test', 'Results by Doctor'];
const AVAILABLE_LAB_TESTS = ["Complete Blood Count (CBC)", "Urinalysis", "Blood Glucose", "Lipid Panel", "Liver Function Test"];


const PatientCard = ({ patient }: { patient: Patient }) => {
  const { movePatient } = usePatientQueue();
  const [isQuestioningModalOpen, setQuestioningModalOpen] = useState(false);
  const [isLabModalOpen, setLabModalOpen] = useState(false);
  const [isDoctorModalOpen, setDoctorModalOpen] = useState(false);

  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [labResults, setLabResults] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const router = useRouter();


  const handleTestAction = () => {
    switch (patient.stage) {
      case 'Waiting Room':
        movePatient(patient.id, 'Questioning');
        break;
      case 'Questioning':
        setQuestioningModalOpen(true);
        break;
      case 'Laboratory Test':
        setLabModalOpen(true);
        break;
      case 'Results by Doctor':
        setDoctorModalOpen(true);
        break;
    }
  };

  const handleSendToLab = () => {
    movePatient(patient.id, 'Laboratory Test', { requestedLabTests: selectedTests });
    setQuestioningModalOpen(false);
    setSelectedTests([]);
  }

  const handleAddLabResults = () => {
    movePatient(patient.id, 'Results by Doctor', { labResults });
    setLabModalOpen(false);
    setLabResults('');
  }

  const handleDischarge = () => {
    movePatient(patient.id, 'Discharged', { diagnosis, prescription });
    setDoctorModalOpen(false);
  }
  
  const handlePrint = () => {
    router.push(`/patients/${patient.id}/summary`);
  }

  const getActionButton = () => {
    let text = '';
    let icon = <ArrowRight className="ml-2 h-4 w-4" />;
    switch (patient.stage) {
      case 'Waiting Room':
        text = 'Start Questioning';
        break;
      case 'Questioning':
        text = 'Assign Lab Tests';
        icon = <Stethoscope className="mr-2 h-4 w-4" />;
        break;

      case 'Laboratory Test':
        text = 'Add Lab Results';
        icon = <Beaker className="mr-2 h-4 w-4" />;
        break;
      case 'Results by Doctor':
        text = 'Diagnose & Discharge';
        icon = <ClipboardPlus className="mr-2 h-4 w-4" />;
        break;
    }
    return (
        <Button size="sm" variant="outline" onClick={handleTestAction} className="w-full">
            {icon} {text}
        </Button>
    )
  };

  return (
    <Card className="mb-4 bg-card">
      <CardContent className="p-4 flex flex-col items-start gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="text-muted-foreground" size={20} />
          </div>
          <div className="flex-grow">
            <p className="font-semibold">{patient.name}</p>
            <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
          </div>
          {patient.stage === 'Results by Doctor' && (
            <Button variant="ghost" size="icon" onClick={handlePrint} title="Print Summary">
              <Printer className="h-5 w-5"/>
            </Button>
          )}
        </div>
        
        {getActionButton()}
        
        {/* Questioning Modal */}
        <AlertDialog open={isQuestioningModalOpen} onOpenChange={setQuestioningModalOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Assign Lab Tests for {patient.name}</AlertDialogTitle>
                    <AlertDialogDescription>Select the required laboratory tests.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                    {AVAILABLE_LAB_TESTS.map(test => (
                        <div key={test} className="flex items-center space-x-2">
                            <Checkbox 
                                id={test} 
                                onCheckedChange={(checked) => {
                                    setSelectedTests(prev => checked ? [...prev, test] : prev.filter(t => t !== test))
                                }}
                            />
                            <label htmlFor={test} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {test}
                            </label>
                        </div>
                    ))}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSendToLab} disabled={selectedTests.length === 0}>Send to Lab</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* Lab Results Modal */}
        <AlertDialog open={isLabModalOpen} onOpenChange={setLabModalOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Enter Lab Results for {patient.name}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <h4 className="font-semibold mb-2">Requested Tests:</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                            {patient.requestedLabTests?.map(test => <li key={test}>{test}</li>)}
                        </ul>
                    </div>
                    <Label htmlFor="lab-results">Test Results</Label>
                    <Textarea 
                        id="lab-results" 
                        value={labResults} 
                        onChange={e => setLabResults(e.target.value)}
                        placeholder="Enter summary of lab findings..."
                        className="min-h-[150px]"
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAddLabResults} disabled={!labResults}>Submit Results</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        
        {/* Doctor's Diagnosis Modal */}
        <AlertDialog open={isDoctorModalOpen} onOpenChange={setDoctorModalOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Diagnosis for {patient.name}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div>
                        <h4 className="font-semibold mb-2">Lab Results:</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap">{patient.labResults || "No results submitted."}</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnosis</Label>
                        <Textarea 
                            id="diagnosis" 
                            value={diagnosis}
                            onChange={e => setDiagnosis(e.target.value)}
                            placeholder="Enter final diagnosis..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prescription">Prescription</Label>
                        <Textarea 
                            id="prescription" 
                            value={prescription}
                            onChange={e => setPrescription(e.target.value)}
                            placeholder="e.g., Amoxicillin 500mg, 3 times a day for 7 days"
                        />
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDischarge} disabled={!diagnosis || !prescription}>Discharge Patient</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </CardContent>
    </Card>
  );
};


const QueueColumn = ({ title, patients }: { title: string; patients: Patient[] }) => {
  return (
    <Card className="flex-1 min-w-[300px] bg-muted/50 flex flex-col">
      <CardHeader>
        <CardTitle>{title} ({patients.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4">
        {patients.sort((a, b) => a.checkInTime.getTime() - b.checkInTime.getTime()).map(p => <PatientCard key={p.id} patient={p} />)}
        {patients.length === 0 && <p className="text-muted-foreground text-center p-8">No patients in this stage.</p>}
      </CardContent>
    </Card>
  );
};

export default function ClinicQueueManager() {
  const { patients } = usePatientQueue();
  const router = useRouter();

  return (
    <main className="p-4 md:p-6 lg:p-8 h-screen flex flex-col">
      <header className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Clinic Queue Manager</h1>
            <p className="text-muted-foreground">
            Visualize and manage the patient flow in real-time.
            </p>
        </div>
        <Button onClick={() => router.push('/reception/add-user')}>
            <Plus className="mr-2 h-4 w-4"/> Add Patient
        </Button>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <QueueColumn
            key={stage}
            title={stage}
            patients={patients.filter(p => p.stage === stage)}
          />
        ))}
      </div>
    </main>
  );
}
