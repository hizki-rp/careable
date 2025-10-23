'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterPeriod = '3d' | '7d' | '30d' | '365d';

const AdminPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>('7d');

  const filterButtons: { label: string; value: FilterPeriod }[] = [
    { label: 'Last 3 Days', value: '3d' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last Year', value: '365d' },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14 p-4 md:p-0">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>
      <main className="admin-main">
        <section>
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing your clinic&apos;s performance.
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-2">
            {filterButtons.map((filter) => (
                <Button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn('h-9 rounded-md px-4', {
                    'bg-primary text-primary-foreground hover:bg-primary/90': activeFilter === filter.value,
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80': activeFilter !== filter.value,
                })}
                >
                {filter.label}
                </Button>
            ))}
        </div>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={125}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={30}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
           <StatCard
            type="lab"
            count={45}
            label="Laboratory Tests"
            icon="/assets/icons/lab.svg"
          />
           <StatCard
            type="discharged"
            count={250}
            label="Discharged Patients"
            icon="/assets/icons/discharged.svg"
          />
          <StatCard
            type="cancelled"
            count={15}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        
        <DataTable />

      </main>
    </div>
  );
};

export default AdminPage;