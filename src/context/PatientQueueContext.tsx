
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

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
  allPatients: Patient[];
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
  reAdmitPatient: (patientId: string) => void;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  getPatientById: (patientId: string) => Patient | undefined;
}

const PatientQueueContext = createContext<PatientQueueContextType | undefined>(undefined);

// Keep discharged history at the module level to persist it across re-renders.
let dischargedPatientHistory: Patient[] = [];

export const PatientQueueProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dischargedPatients, setDischargedPatients] = useState<Patient[]>(dischargedPatientHistory);
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
            dischargedPatientHistory = [patientToMove, ...dischargedPatientHistory];
            setDischargedPatients(dischargedPatientHistory);
            setPatients(updatedPatients);
        } else {
            setPatients([...updatedPatients, { ...patientToMove, checkInTime: new Date() }]);
        }
    }
  };

  const reAdmitPatient = (patientId: string) => {
    const patientToReAdmit = dischargedPatients.find(p => p.id === patientId);
    if (patientToReAdmit) {
      // Remove from discharged
      const newDischargedHistory = dischargedPatients.filter(p => p.id !== patientId);
      dischargedPatientHistory = newDischargedHistory;
      setDischargedPatients(newDischargedHistory);

      // Reset and add to active queue
      const newVisitPatient: Patient = {
        ...patientToReAdmit,
        stage: 'Waiting Room',
        checkInTime: new Date(),
        // Clear data from previous visit
        requestedLabTests: undefined,
        labResults: undefined,
        diagnosis: undefined,
        prescription: undefined,
      };
      setPatients(prev => [...prev, newVisitPatient]);
    }
  };


  const getPatientById = (patientId: string): Patient | undefined => {
    return patients.find(p => p.id === patientId) || dischargedPatients.find(p => p.id === patientId);
  }

  const allPatients = useMemo(() => [...patients, ...dischargedPatients], [patients, dischargedPatients]);

  return (
    <PatientQueueContext.Provider value={{ patients, addPatient, movePatient, setPatients, getPatientById, allPatients, reAdmitPatient }}>
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
