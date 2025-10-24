
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, User, Stethoscope, Beaker, ClipboardPlus, Printer, Plus, UserCheck, TestTube, LogOut, FileText } from 'lucide-react';
import React, { useState, useContext, createContext } from 'react';
import { Button } from '@/components/ui/button';
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
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STAGES: QueueStage[] = ['Waiting Room', 'Questioning', 'Laboratory Test', 'Results by Doctor'];
const AVAILABLE_LAB_TESTS = ["Complete Blood Count (CBC)", "Urinalysis", "Blood Glucose", "Lipid Panel", "Liver Function Test"];

type Role = 'Receptionist' | 'Doctor' | 'Laboratorian';

interface RoleContextType {
    role: Role;
    setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
}

const PatientCard = ({ patient }: { patient: Patient }) => {
  const { movePatient } = usePatientQueue();
  const { role } = useRole();
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
        if(role === 'Receptionist') movePatient(patient.id, 'Questioning');
        break;
      case 'Questioning':
        if(role === 'Doctor') setQuestioningModalOpen(true);
        break;
      case 'Laboratory Test':
        if(role === 'Laboratorian') setLabModalOpen(true);
        break;
      case 'Results by Doctor':
        if(role === 'Doctor') setDoctorModalOpen(true);
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
    // Navigate to the prescription page
    router.push(`/patients/${patient.id}/prescription`);
  }
  
  const handlePrint = () => {
    router.push(`/patients/${patient.id}/summary`);
  }

  const getActionButton = () => {
    let text = '';
    let icon: React.ReactNode = <ArrowRight className="ml-2 h-4 w-4" />;
    let isVisible = false;

    switch (patient.stage) {
      case 'Waiting Room':
        text = 'Start Questioning';
        icon = <UserCheck className="mr-2 h-4 w-4" />
        isVisible = role === 'Receptionist';
        break;
      case 'Questioning':
        text = 'Assign Lab Tests';
        icon = <Stethoscope className="mr-2 h-4 w-4" />;
        isVisible = role === 'Doctor';
        break;

      case 'Laboratory Test':
        text = 'Add Lab Results';
        icon = <TestTube className="mr-2 h-4 w-4" />;
        isVisible = role === 'Laboratorian';
        break;
      case 'Results by Doctor':
        text = 'Diagnose & Discharge';
        icon = <LogOut className="mr-2 h-4 w-4" />;
        isVisible = role === 'Doctor';
        break;
    }

    if (!isVisible) return null;

    return (
        <Button size="sm" variant="outline" onClick={handleTestAction} className="w-full mt-4">
            {icon} {text}
        </Button>
    )
  };

  return (
    <Card className="mb-4 bg-card shadow-md border-l-4 border-primary">
      <CardContent className="p-4 flex flex-col items-start gap-1">
        <div className="flex items-center justify-between w-full">
            <p className="font-bold text-lg">{patient.name}</p>
            {patient.stage === 'Results by Doctor' && role === 'Doctor' && (
                <Button variant="ghost" size="icon" onClick={handlePrint} title="Print Summary">
                <Printer className="h-5 w-5"/>
                </Button>
            )}
        </div>
        <p className="text-sm text-muted-foreground">Checked in at: {patient.checkInTime.toLocaleTimeString()}</p>

        
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
                                id={`test-${patient.id}-${test}`}
                                onCheckedChange={(checked) => {
                                    setSelectedTests(prev => checked ? [...prev, test] : prev.filter(t => t !== test))
                                }}
                            />
                            <label htmlFor={`test-${patient.id}-${test}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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


const QueueColumn = ({ title, patients, color }: { title: string; patients: Patient[], color: string }) => {
  return (
    <div className="flex-1 min-w-[320px] max-w-md">
        <Card className="bg-muted/30 rounded-xl shadow-lg border border-border/50 h-full flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center p-4 border-b">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${color}`}></span>
                    {title}
                </CardTitle>
                 <span className="bg-primary/20 text-primary font-bold text-sm px-3 py-1 rounded-full">{patients.length}</span>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
                {patients.sort((a, b) => a.checkInTime.getTime() - b.checkInTime.getTime()).map(p => <PatientCard key={p.id} patient={p} />)}
                {patients.length === 0 && <p className="text-muted-foreground text-center p-8">No patients here.</p>}
            </CardContent>
        </Card>
    </div>
  );
};

const RoleProvider = ({ children }: { children: React.ReactNode }) => {
    const [role, setRole] = useState<Role>('Receptionist');
    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    )
}

const RoleSwitcher = () => {
    const { role, setRole } = useRole();
    return (
        <div className="flex items-center gap-2">
            <Label htmlFor="role-switcher" className="text-sm">Role:</Label>
            <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                <SelectTrigger id="role-switcher" className="w-[180px] bg-card">
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Laboratorian">Laboratorian</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}


export default function ClinicQueueManager() {
  const { patients } = usePatientQueue();
  const router = useRouter();

  const columnColors = {
    'Waiting Room': 'bg-blue-500',
    'Questioning': 'bg-yellow-500',
    'Laboratory Test': 'bg-purple-500',
    'Results by Doctor': 'bg-green-500',
  }

  return (
    <RoleProvider>
        <main className="p-4 md:p-6 lg:p-8 h-screen flex flex-col bg-background">
        <header className="mb-6 flex flex-wrap gap-4 justify-between items-center">
            <div>
                <h1 className="text-3xl font-extrabold">Clinic Queue Manager</h1>
                <p className="text-lg text-muted-foreground">
                    Real-time patient flow management.
                </p>
            </div>
            <div className="flex items-center gap-4">
                <RoleSwitcher />
                <Button onClick={() => router.push('/reception/add-user')}>
                    <Plus className="mr-2 h-4 w-4"/> Add Patient
                </Button>
            </div>
        </header>

        <div className="flex-grow flex gap-6 overflow-x-auto pb-4">
            {STAGES.map((stage) => (
            <QueueColumn
                key={stage}
                title={stage}
                patients={patients.filter(p => p.stage === stage)}
                color={columnColors[stage]}
            />
            ))}
        </div>
        </main>
    </RoleProvider>
  );
}

    