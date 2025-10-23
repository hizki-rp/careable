'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, ChevronRight, User } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type QueueStage = 'triage' | 'lab' | 'consultation' | 'done';
type PatientStatus = 'waiting' | 'in-progress' | 'completed';

interface Patient {
  id: number;
  name: string;
  avatar: string;
  stage: QueueStage;
  status: PatientStatus;
  waitingSince: Date;
}

const dummyPatients: Patient[] = [
  { id: 1, name: "Maria Garcia", avatar: "https://i.pravatar.cc/150?img=1", stage: 'triage', status: 'in-progress', waitingSince: new Date(Date.now() - 5 * 60000) },
  { id: 2, name: "John Smith", avatar: "https://i.pravatar.cc/150?img=2", stage: 'triage', status: 'waiting', waitingSince: new Date(Date.now() - 2 * 60000) },
  { id: 3, name: "Chen Wei", avatar: "https://i.pravatar.cc/150?img=3", stage: 'lab', status: 'in-progress', waitingSince: new Date(Date.now() - 15 * 60000) },
  { id: 4, name: "Fatima Al-Fassi", avatar: "https://i.pravatar.cc/150?img=4", stage: 'consultation', status: 'waiting', waitingSince: new Date(Date.now() - 8 * 60000) },
  { id: 5, name: "David Miller", avatar: "https://i.pravatar.cc/150?img=5", stage: 'lab', status: 'waiting', waitingSince: new Date(Date.now() - 3 * 60000) },
  { id: 6, name: "Anya Petrova", avatar: "https://i.pravatar.cc/150?img=6", stage: 'consultation', status: 'in-progress', waitingSince: new Date(Date.now() - 25 * 60000) },
];

const STAGE_TITLES: Record<QueueStage, string> = {
  triage: 'Triage / Questioning',
  lab: 'Laboratory Tests',
  consultation: 'Doctor Consultation',
  done: 'Completed'
};

const STAGES: QueueStage[] = ['triage', 'lab', 'consultation'];

const PatientCard = ({ patient, onMove }: { patient: Patient; onMove: (id: number, nextStage: QueueStage) => void }) => {
  const getWaitingTime = (since: Date) => {
    const minutes = Math.floor((Date.now() - since.getTime()) / 60000);
    return `${minutes} min ago`;
  }
  
  const currentStageIndex = STAGES.indexOf(patient.stage);
  const nextStage = currentStageIndex + 1 < STAGES.length ? STAGES[currentStageIndex + 1] : 'done';

  return (
    <Card className="mb-4">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <User className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">{patient.name}</p>
            <p className="text-sm text-muted-foreground">
              {patient.status === 'in-progress' ? 'In Progress' : `Waiting since ${getWaitingTime(patient.waitingSince)}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onMove(patient.id, nextStage)}>
                Move to {STAGE_TITLES[nextStage]} <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};


const QueueColumn = ({ title, patients, onMove }: { title: string; patients: Patient[]; onMove: (id: number, nextStage: QueueStage) => void; }) => {
  return (
    <Card className="flex-1 min-w-[300px] bg-muted/50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {patients.map(p => <PatientCard key={p.id} patient={p} onMove={onMove} />)}
        {patients.length === 0 && <p className="text-muted-foreground text-center p-8">No patients in this stage.</p>}
      </CardContent>
    </Card>
  );
};

export default function QueuePage() {
  const [patients, setPatients] = useState<Patient[]>(dummyPatients);

  const handleMovePatient = (id: number, nextStage: QueueStage) => {
    setPatients(prev => prev.map(p => {
        if (p.id === id) {
            return {
                ...p,
                stage: nextStage,
                status: 'waiting',
                waitingSince: new Date()
            }
        }
        return p;
    }));
  };

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Patient Queue</h1>
        <p className="text-muted-foreground">
          Manage the flow of patients through the clinic in real-time.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <QueueColumn
            key={stage}
            title={STAGE_TITLES[stage]}
            patients={patients.filter(p => p.stage === stage)}
            onMove={handleMovePatient}
          />
        ))}
      </div>
    </main>
  );
}
