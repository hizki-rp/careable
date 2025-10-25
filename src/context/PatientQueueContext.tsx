
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type QueueStage = 'Waiting Room' | 'Questioning' | 'Laboratory Test' | 'Results by Doctor' | 'Discharged';
export type PatientPriority = 'Standard' | 'Urgent';

export interface Patient {
  id: string;
  name: string;
  stage: QueueStage;
  checkInTime: Date;
  email?: string;
  phone?: string;
  address?: string;
  age?: number;
  sex?: string;
  priority: PatientPriority;

  requestedLabTests?: string[];
  labResults?: string;
  diagnosis?: string;
  prescription?: string;
}

interface PatientDataUpdate {
  requestedLabTests?: string[];
  labResults?: string;
  diagnosis?: string;
  prescription?: string;
}

interface PatientQueueContextType {
  patients: Patient[];
  addPatient: (patientData: { 
    name: string, 
    email?: string, 
    phone?: string, 
    address?: string, 
    age?: number, 
    sex?: string, 
    priority: PatientPriority 
  }) => void;
  movePatient: (patientId: string, nextStage: QueueStage, data?: PatientDataUpdate) => void;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  getPatientById: (patientId: string) => Patient | undefined;
}

const PatientQueueContext = createContext<PatientQueueContextType | undefined>(undefined);

const dischargedPatientHistory: Patient[] = [];

export const PatientQueueProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientIdCounter, setPatientIdCounter] = useState(1);

  const addPatient = (patientData: { 
    name: string, 
    email?: string, 
    phone?: string, 
    address?: string,
    age?: number,
    sex?: string,
    priority: PatientPriority
  }) => {
    const newPatient: Patient = {
      ...patientData,
      id: `P-${String(patientIdCounter).padStart(3, '0')}`,
      stage: 'Waiting Room',
      checkInTime: new Date(),
    };
    setPatients(prev => [...prev, newPatient]);
    setPatientIdCounter(prev => prev + 1);
  };

  const movePatient = (patientId: string, nextStage: QueueStage, data?: PatientDataUpdate) => {
    let patientToMove: Patient | undefined;

    const updatedPatients = patients.map(p => {
        if (p.id === patientId) {
            patientToMove = {
                ...p,
                stage: nextStage,
                ...data,
            };
            return null; 
        }
        return p;
    }).filter(Boolean) as Patient[];

    if (patientToMove) {
        if (nextStage === 'Discharged') {
            dischargedPatientHistory.push(patientToMove);
            setPatients(updatedPatients);
        } else {
            setPatients([...updatedPatients, { ...patientToMove, checkInTime: new Date() }]);
        }
    }
  };

  const getPatientById = (patientId: string): Patient | undefined => {
    return patients.find(p => p.id === patientId) || dischargedPatientHistory.find(p => p.id === patientId);
  }

  return (
    <PatientQueueContext.Provider value={{ patients, addPatient, movePatient, setPatients, getPatientById }}>
      {children}
    </PatientQueueContext.Provider>
  );
};

export const usePatientQueue = () => {
  const context = useContext(PatientQueueContext);
  if (context === undefined) {
    throw new Error('usePatientQueue must be used within a PatientQueueProvider');
  }
  return context;
};

    