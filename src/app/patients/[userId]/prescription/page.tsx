
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

    // Simple parsing of prescription text for the table
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
        <div className="bg-background text-foreground min-h-screen">
            <div className="container mx-auto p-4 sm:p-8 max-w-4xl bg-card text-card-foreground rounded-lg shadow-lg my-8 print:shadow-none print:my-0 print:rounded-none">
                <header className="text-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold text-primary">Menaharia Medium Clinic</h1>
                    <p className="text-muted-foreground">☎: 022 331 77 57 / Asella</p>
                    <h2 className="text-2xl font-semibold mt-2">PRESCRIPTION PAPER</h2>
                </header>

                <section className="patient-info mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="col-span-1 md:col-span-2 lg:col-span-2">
                            <Label htmlFor="patientName">Patient's Full Name</Label>
                            <Input id="patientName" value={patient.name} readOnly />
                        </div>
                        <div>
                            <Label htmlFor="sex">Sex</Label>
                            <Input id="sex" readOnly />
                        </div>
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" readOnly />
                        </div>
                        <div>
                            <Label htmlFor="weight">Weight</Label>
                            <Input id="weight" readOnly />
                        </div>
                        <div>
                            <Label htmlFor="cardNo">Card No.</Label>
                            <Input id="cardNo" value={patient.id} readOnly/>
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-2">
                            <Label htmlFor="telNo">Tel No.</Label>
                            <Input id="telNo" value={patient.phone || ''} readOnly />
                        </div>
                        <div className="col-span-full">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" value={patient.address || ''} readOnly />
                        </div>
                    <div className="col-span-1 md:col-span-2 flex items-center gap-4 pt-6">
                            <div className="flex items-center gap-2">
                                <Checkbox id="inpatient"/>
                                <Label htmlFor="inpatient">Inpatient</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="outpatient" checked/>
                                <Label htmlFor="outpatient">Out patient</Label>
                            </div>
                    </div>
                    </div>
                </section>
                <section className="diagnosis mb-6">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Input id="diagnosis" value={patient.diagnosis || ''} readOnly />
                </section>

                <section className="rx-section mb-6">
                    <h3 className="text-xl font-bold mb-2">Rx</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-muted">
                                    <th className="border p-2 text-sm">Drug name</th>
                                    <th className="border p-2 text-sm">Strength</th>
                                    <th className="border p-2 text-sm">Dosage Form</th>
                                    <th className="border p-2 text-sm">Dose</th>
                                    <th className="border p-2 text-sm">Frequency</th>
                                    <th className="border p-2 text-sm">Duration</th>
                                    <th className="border p-2 text-sm">Quantity</th>
                                    <th className="border p-2 text-sm">How to use and other information</th>
                                    <th className="border p-2 text-sm">Price (dispenser's use only)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescriptionItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" value={item.drugName} readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" value={item.dose} readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" value={item.frequency} readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" value={item.duration} readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" disabled/></td>
                                    </tr>
                                ))}
                                {/* Add empty rows for spacing */}
                                {Array.from({ length: Math.max(0, 5 - prescriptionItems.length) }).map((_, index) => (
                                    <tr key={`empty-${index}`}>
                                        <td className="border h-12"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" readOnly/></td>
                                        <td className="border"><Input type="text" className="border-0 rounded-none w-full" disabled/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                    <div className="prescriber-section space-y-4">
                        <h4 className="font-bold text-lg">Prescriber's</h4>
                        <div>
                            <Label htmlFor="prescriberName">Full Name</Label>
                            <Input id="prescriberName" value="Dr. Sarah Lee" readOnly/>
                        </div>
                        <div>
                            <Label htmlFor="qualification">Qualification</Label>
                            <Input id="qualification" value="General Practitioner" readOnly/>
                        </div>
                        <div>
                            <Label htmlFor="registration">Registration</Label>
                            <Input id="registration" value="MD-12345" readOnly/>
                        </div>
                        <div>
                            <Label htmlFor="signature">Signature</Label>
                            <div className="h-12 border rounded-md bg-muted/20"></div>
                        </div>
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} readOnly />
                        </div>
                    </div>

                    <div className="dispenser-section space-y-4">
                        <h4 className="font-bold text-lg">Dispenser's</h4>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Label htmlFor="totalPrice">Total Price</Label>
                                <Input id="totalPrice" disabled/>
                            </div>
                        </div>
                        <div className="flex-grow space-y-2">
                            <Label>Dispenser's Info</Label>
                            <div className="h-48 border rounded-md bg-muted/20 p-2">
                                {/* for signature or stamp */}
                            </div>
                        </div>
                    </div>
                </footer>
                <div className="mt-8 flex justify-end print:hidden">
                   <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" />Print Prescription</Button>
                </div>

                <style jsx global>{`
                    @media print {
                        body {
                            background-color: #fff;
                        }
                        .print\\:hidden {
                            display: none;
                        }
                        .print\\:shadow-none {
                            box-shadow: none;
                        }
                        .print\\:my-0 {
                            margin-top: 0;
                            margin-bottom: 0;
                        }
                        .print\\:rounded-none {
                            border-radius: 0;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}

export default PrescriptionPage;
