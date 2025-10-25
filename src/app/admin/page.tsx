
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import StatCard from '@/components/StatCard';
import { usePatientQueue, Patient } from '@/context/PatientQueueContext';
import PatientDataTable from '@/components/PatientDataTable';

const AdminPage = () => {
  const { allPatients } = usePatientQueue();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(allPatients);

  useEffect(() => {
    const results = allPatients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, allPatients]);
  
  const pendingAppointments = allPatients.filter(p => p.stage !== 'Discharged').length;
  const dischargedPatients = allPatients.filter(p => p.stage === 'Discharged').length;


  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <h1 className="text-2xl font-bold text-primary">Menaharia Medium Clinic</h1>
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>
      <main className="admin-main flex flex-col gap-8">
        <section>
          <h1 className="header">Welcome 👋</h1>
          <p className="text-muted-foreground">
            Manage your clinic's patients and performance.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            type="appointments"
            count={allPatients.length}
            label="Total Patients"
            icon="/assets/icons/user.svg"
          />
          <StatCard
            type="pending"
            count={pendingAppointments}
            label="Pending Patients"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="discharged"
            count={dischargedPatients}
            label="Discharged Patients"
            icon="/assets/icons/discharged.svg"
          />
          <StatCard
            type="cancelled"
            count={0}
            label="Cancelled Appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-bold mb-4">Patients</h2>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by patient name..."
              className="w-full max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <PatientDataTable data={filteredPatients} />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
