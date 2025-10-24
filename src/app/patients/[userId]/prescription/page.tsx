
'use client';
import { usePatientQueue } from '@/context/PatientQueueContext';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Patient } from '@/context/PatientQueueContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from '@/components/ui/checkbox';
import { Printer } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const PrescriptionPage = () => {
    const { userId } = useParams();
    const { getPatientById } = usePatientQueue();
    const [patient, setPatient] = useState<Patient | null>(null);

    useEffect(() => {
        if (userId) {
            const foundPatient = getPatientById(userId as string);
            setPatient(foundPatient || null);
        }
    }, [userId, getPatientById]);

    const handlePrint = () => {
        window.print();
    }

    if (!patient) {
        if (typeof window !== 'undefined' && !getPatientById(userId as string)) {
            notFound();
        }
        return <div className="flex justify-center items-center h-screen"><p>Loading prescription...</p></div>;
    }

    const prescriptionItems = patient.prescription?.split('\n').map(line => {
        const parts = line.split(',');
        return {
            drugName: parts[0]?.trim() || '',
            dose: parts[1]?.trim() || '',
            frequency: parts[2]?.trim() || '',
            duration: parts[3]?.trim() || '',
        }
    }) || [];

    return (
        <div className="bg-background text-foreground min-h-screen p-4 sm:p-8 print:bg-white">
            <main className="max-w-4xl mx-auto space-y-8">
                <header className="text-center py-4 border-b-4 border-primary bg-card rounded-xl shadow-xl print:shadow-none print:border-b-2">
                    <h1 className="text-3xl font-extrabold text-foreground">Menaharia Medium Clinic</h1>
                    <p className="text-md text-muted-foreground mt-1">☎: 022 331 77 57 / Asella</p>
                </header>

                <h2 className="text-2xl font-bold text-foreground text-center uppercase tracking-wider">Prescription Paper</h2>

                <section className="bg-card p-6 rounded-xl shadow-lg border print:shadow-none">
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Patient Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div><Label>Patient's Full Name</Label><Input value={patient.name} readOnly /></div>
                        <div><Label>Sex</Label><Input readOnly /></div>
                        <div><Label>Age</Label><Input type="number" readOnly /></div>
                        <div><Label>Weight (kg)</Label><Input type="number" readOnly /></div>
                        <div><Label>Card No.</Label><Input value={patient.id} readOnly /></div>
                        <div><Label>Tel No.</Label><Input type="tel" value={patient.phone} readOnly /></div>
                    </div>
                    
                    <div className="mb-4"><Label>Address</Label><Input value={patient.address} readOnly /></div>

                    <RadioGroup defaultValue="outpatient" className="flex space-x-6">
                        <div className="flex items-center"><RadioGroupItem value="inpatient" id="inpatient"/><Label htmlFor="inpatient" className="ml-2">Inpatient</Label></div>
                        <div className="flex items-center"><RadioGroupItem value="outpatient" id="outpatient"/><Label htmlFor="outpatient" className="ml-2">Outpatient</Label></div>
                    </RadioGroup>
                </section>

                <section className="bg-card p-6 rounded-xl shadow-lg border print:shadow-none">
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Diagnosis</h3>
                    <Input className="h-24" value={patient.diagnosis || ''} readOnly />
                </section>
                
                <section className="bg-card p-6 rounded-xl shadow-lg border print:shadow-none">
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Rx (Medication)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                             <thead>
                                <tr className="bg-muted">
                                    <th className="border p-2 text-sm text-left">Drug name, Strength, Dosage Form</th>
                                    <th className="border p-2 text-sm text-left">Dose</th>
                                    <th className="border p-2 text-sm text-left">Frequency</th>
                                    <th className="border p-2 text-sm text-left">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescriptionItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{item.drugName}</td>
                                        <td className="border p-2">{item.dose}</td>
                                        <td className="border p-2">{item.frequency}</td>
                                        <td className="border p-2">{item.duration}</td>
                                    </tr>
                                ))}
                                {Array.from({ length: Math.max(0, 8 - prescriptionItems.length) }).map((_, index) => (
                                     <tr key={`empty-${index}`}>
                                        <td className="border p-2 h-10"></td>
                                        <td className="border p-2"></td>
                                        <td className="border p-2"></td>
                                        <td className="border p-2"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="bg-card p-6 rounded-xl shadow-lg border print:shadow-none">
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Prescriber's Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div><Label>Full Name</Label><Input value="Dr. Sarah Lee" readOnly /></div>
                        <div><Label>Qualification</Label><Input value="General Practitioner" readOnly /></div>
                        <div><Label>Registration No.</Label><Input value="MD-12345" readOnly /></div>
                        <div><Label>Date</Label><Input type="date" defaultValue={new Date().toISOString().split('T')[0]} readOnly /></div>
                    </div>
                    <div className="mt-4"><Label>Signature</Label><div className="w-full h-12 border-b mt-1"></div></div>
                </section>

                <section className="bg-card p-6 rounded-xl shadow-lg border print:shadow-none">
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Dispenser's Use Only</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div><Label>Total Price</Label><Input placeholder="Price (dispenser's use only)" disabled /></div>
                        <div><Label>Dispenser's Info</Label><Input disabled /></div>
                    </div>
                </section>
                
                <div className="text-center pb-8 pt-4 print:hidden">
                    <Button onClick={handlePrint} size="lg" className="rounded-full shadow-lg">
                        <Printer className="mr-2" />
                        Generate/Print Prescription
                    </Button>
                </div>
            </main>
             <style jsx global>{`
                @media print {
                    body {
                        background-color: #fff !important;
                    }
                    .print\\:hidden {
                        display: none;
                    }
                    .print\\:shadow-none {
                        box-shadow: none;
                        border: 1px solid #e5e7eb;
                    }
                    main {
                        margin: 0;
                        max-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}

export default PrescriptionPage;
