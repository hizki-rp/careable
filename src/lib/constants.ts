import { PlaceHolderImages } from "./placeholder-images";

export const Doctors = [
  {
    image: PlaceHolderImages.find(img => img.id === 'dr-alcantara')?.imageUrl ?? '',
    name: "John Alcantara",
  },
  {
    image: PlaceHolderImages.find(img => img.id === 'dr-lee')?.imageUrl ?? '',
    name: "Sarah Lee",
  },
  {
    image: PlaceHolderImages.find(img => img.id === 'dr-williams')?.imageUrl ?? '',
    name: "David Williams",
  },
];

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as "Male" | "Female",
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const Genders = ["Male", "Female", "Other"];
