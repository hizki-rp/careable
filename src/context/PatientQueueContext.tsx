'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type QueueStage = 'Waiting Room' | 'Questioning' | 'Laboratory Test' | 'Results by Doctor' | 'Discharged';

export interface Patient {
  id: string;
  name: string;
  stage: QueueStage;
  checkInTime: Date;
  email?: string;
  phone?: string;
  address?: string;
  
  // New properties for detailed workflow
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
  addPatient: (patientData: Omit<Patient, 'id' | 'stage' | 'checkInTime'>) => void;
  movePatient: (patientId: string, nextStage: QueueStage, data?: PatientDataUpdate) => void;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  getPatientById: (patientId: string) => Patient | undefined;
}

const PatientQueueContext = createContext<PatientQueueContextType | undefined>(undefined);

// In-memory storage for discharged patients to allow for history lookup
const dischargedPatientHistory: Patient[] = [];

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

  const movePatient = (patientId: string, nextStage: QueueStage, data?: PatientDataUpdate) => {
    let patientToMove: Patient | undefined;

    const updatedPatients = patients.map(p => {
        if (p.id === patientId) {
            patientToMove = {
                ...p,
                stage: nextStage,
                ...data,
            };
            // By returning null, we prepare to filter this patient out
            return null; 
        }
        return p;
    }).filter(Boolean) as Patient[]; // Filter out the null entry

    if (patientToMove) {
        if (nextStage === 'Discharged') {
            // Move to history instead of active queue
            dischargedPatientHistory.push(patientToMove);
            setPatients(updatedPatients); // Set the state without the discharged patient
        } else {
            // Add the updated patient back into the active queue
            setPatients([...updatedPatients, { ...patientToMove, checkInTime: new Date() }]);
        }
    }
  };

  const getPatientById = (patientId: string): Patient | undefined => {
    // Search active patients first, then discharged history
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
