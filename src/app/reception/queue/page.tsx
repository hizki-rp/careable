'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, User } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type QueueStage = 'Waiting Room' | 'Questioning' | 'Laboratory Test' | 'Results by Doctor';

interface Patient {
  id: string;
  name: string;
  stage: QueueStage;
  checkInTime: Date;
}

const STAGES: QueueStage[] = ['Waiting Room', 'Questioning', 'Laboratory Test', 'Results by Doctor'];

const CheckInForm = ({ onCheckIn }: { onCheckIn: (name: string) => void }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCheckIn(name.trim());
      setName('');
    }
  };

  return (
    <Card className="mb-8">
        <CardHeader>
            <CardTitle>Patient Check-In</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-4">
                <div className="w-full sm:w-auto flex-grow space-y-2">
                    <Label htmlFor="patient-name">Patient Name</Label>
                    <Input
                        id="patient-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter patient's full name"
                        required
                    />
                </div>
                <Button type="submit" className="w-full sm:w-auto">Check In</Button>
            </form>
        </CardContent>
    </Card>
  );
};


const PatientCard = ({ patient, onMove }: { patient: Patient; onMove: (patientId: string, nextStage: QueueStage | 'Discharge') => void }) => {
  const currentStageIndex = STAGES.indexOf(patient.stage);
  const nextStage = currentStageIndex + 1 < STAGES.length ? STAGES[currentStageIndex + 1] : 'Discharge';

  const getActionButtonText = () => {
    switch (patient.stage) {
      case 'Waiting Room':
        return 'Start Questioning';
      case 'Questioning':
        return 'Send to Lab';
      case 'Laboratory Test':
        return 'Results Ready';
      case 'Results by Doctor':
        return 'Discharge Patient';
    }
  };
  
  const handleMove = () => {
    onMove(patient.id, nextStage);
  }

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
        </div>
        <Button size="sm" variant="outline" onClick={handleMove} className="w-full">
            {getActionButtonText()} <ArrowRight className="ml-2 h-4 w-4"/>
        </Button>
      </CardContent>
    </Card>
  );
};


const QueueColumn = ({ title, patients, onMove }: { title: string; patients: Patient[]; onMove: (patientId: string, nextStage: QueueStage | 'Discharge') => void; }) => {
  return (
    <Card className="flex-1 min-w-[300px] bg-muted/50 flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {patients.sort((a, b) => a.checkInTime.getTime() - b.checkInTime.getTime()).map(p => <PatientCard key={p.id} patient={p} onMove={onMove} />)}
        {patients.length === 0 && <p className="text-muted-foreground text-center p-8">No patients in this stage.</p>}
      </CardContent>
    </Card>
  );
};

export default function ClinicQueueManager() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientIdCounter, setPatientIdCounter] = useState(1);

  const handleCheckIn = (name: string) => {
    const newPatient: Patient = {
        id: `P-${String(patientIdCounter).padStart(3, '0')}`,
        name,
        stage: 'Waiting Room',
        checkInTime: new Date(),
    };
    setPatients(prev => [...prev, newPatient]);
    setPatientIdCounter(prev => prev + 1);
  }

  const handleMovePatient = (patientId: string, nextStage: QueueStage | 'Discharge') => {
    if (nextStage === 'Discharge') {
        setPatients(prev => prev.filter(p => p.id !== patientId));
    } else {
        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                return {
                    ...p,
                    stage: nextStage,
                    checkInTime: new Date(), // Reset timer for the new stage
                }
            }
            return p;
        }));
    }
  };

  return (
    <main className="p-4 md:p-6 lg:p-8 h-screen flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Clinic Queue Manager</h1>
        <p className="text-muted-foreground">
          Visualize and manage the patient flow in real-time.
        </p>
      </header>

      <CheckInForm onCheckIn={handleCheckIn} />

      <div className="flex-grow flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <QueueColumn
            key={stage}
            title={stage}
            patients={patients.filter(p => p.stage === stage)}
            onMove={handleMovePatient}
          />
        ))}
      </div>
    </main>
  );
}
