import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const PrescriptionPage = () => {
    return (
        <div className="container mx-auto p-4 sm:p-8 max-w-4xl bg-card text-card-foreground rounded-lg shadow-lg my-8">
            <header className="text-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-primary">Menaharia Medium Clinic</h1>
                <p className="text-muted-foreground">☎: 022 331 77 57 / Asella</p>
                <h2 className="text-2xl font-semibold mt-2">PRESCRIPTION PAPER</h2>
            </header>

            <section className="patient-info mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <Label htmlFor="patientName">Patient's Full Name</Label>
                        <Input id="patientName" />
                    </div>
                    <div>
                        <Label htmlFor="sex">Sex</Label>
                        <Input id="sex" />
                    </div>
                    <div>
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" />
                    </div>
                    <div>
                        <Label htmlFor="weight">Weight</Label>
                        <Input id="weight" />
                    </div>
                    <div>
                        <Label htmlFor="cardNo">Card No.</Label>
                        <Input id="cardNo" />
                    </div>
                     <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <Label htmlFor="telNo">Tel No.</Label>
                        <Input id="telNo" />
                    </div>
                    <div>
                        <Label htmlFor="region">Region</Label>
                        <Input id="region" />
                    </div>
                    <div>
                        <Label htmlFor="town">Town</Label>
                        <Input id="town" />
                    </div>
                    <div>
                        <Label htmlFor="woreda">Woreda</Label>
                        <Input id="woreda" />
                    </div>
                    <div>
                        <Label htmlFor="kebele">Kebele</Label>
                        <Input id="kebele" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <Label htmlFor="houseNo">House No.</Label>
                        <Input id="houseNo" />
                    </div>
                   <div className="col-span-1 md:col-span-2 flex items-center gap-4 pt-6">
                        <div className="flex items-center gap-2">
                            <Checkbox id="inpatient"/>
                            <Label htmlFor="inpatient">Inpatient</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="outpatient"/>
                            <Label htmlFor="outpatient">Out patient</Label>
                        </div>
                   </div>
                </div>
            </section>
             <section className="diagnosis mb-6">
                 <Label htmlFor="diagnosis">Diagnosis if not CD</Label>
                 <Input id="diagnosis" />
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
                            {Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index}>
                                    <td className="border"><Input type="text" className="border-0 rounded-none w-full"/></td>
                                    <td className="border"><Input type="text" className="border-0 rounded-none w-full"/></td>
                                    <td className="border"><Input type="text" className="border-0 rounded-none w-full"/></td>
                                    <td className="border"><Input type="text" className="border-0 rounded-none w-full"/></td>
                                    <td className="border"><Input type="text" className="border-0 rounded-none w-full"/></td>
                                    <td className="border"><Input type="text" className="border-0 rounded-none w-full"/></td>
                                    <td className="border"><Input type="text" className="border-0 rounded-none w-full"/></td>
                                    <td className="border"><Input type="text" className="border-0 rounded-none w-full"/></td>
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
                        <Input id="prescriberName" />
                    </div>
                     <div>
                        <Label htmlFor="qualification">Qualification</Label>
                        <Input id="qualification" />
                    </div>
                     <div>
                        <Label htmlFor="registration">Registration</Label>
                        <Input id="registration" />
                    </div>
                    <div>
                        <Label htmlFor="signature">Signature</Label>
                        <div className="h-12 border rounded-md bg-muted/20"></div>
                    </div>
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" />
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
             <div className="mt-8 flex justify-end">
                <Button>Print Prescription</Button>
            </div>
        </div>
    );
}

export default PrescriptionPage;
