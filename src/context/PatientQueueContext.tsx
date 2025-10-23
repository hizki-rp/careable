'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type QueueStage = 'Waiting Room' | 'Questioning' | 'Laboratory Test' | 'Results by Doctor';

export interface Patient {
  id: string;
  name: string;
  stage: QueueStage;
  checkInTime: Date;
  email?: string;
  phone?: string;
  address?: string;
}

interface PatientQueueContextType {
  patients: Patient[];
  addPatient: (patientData: Omit<Patient, 'id' | 'stage' | 'checkInTime'>) => void;
  movePatient: (patientId: string, nextStage: QueueStage | 'Discharge') => void;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const PatientQueueContext = createContext<PatientQueueContextType | undefined>(undefined);

export const PatientQueueProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientIdCounter, setPatientIdCounter] = useState(1);

  const addPatient = (patientData: Omit<Patient, 'id' | 'stage' | 'checkInTime'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `P-${String(patientIdCounter).padStart(3, '0')}`,
      stage: 'Waiting Room',
      checkInTime: new Date(),
    };
    setPatients(prev => [...prev, newPatient]);
    setPatientIdCounter(prev => prev + 1);
  };

  const movePatient = (patientId: string, nextStage: QueueStage | 'Discharge') => {
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
    <PatientQueueContext.Provider value={{ patients, addPatient, movePatient, setPatients }}>
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
