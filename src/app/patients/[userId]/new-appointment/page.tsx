
import AppointmentForm from "@/components/forms/AppointmentForm";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function NewAppointment({ params: { userId }}: { params: { userId: string }}) {
  const appointmentImage = PlaceHolderImages.find(img => img.id === 'appointment-img');
  
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm type="create" userId={userId} patientId={"1"} />

          <p className="copyright mt-10 py-12">© 2024 Menaharia Medium Clinic</p>
        </div>
      </section>

      {appointmentImage && (
        <Image
          src={appointmentImage.imageUrl}
          height={1000}
          width={1000}
          alt={appointmentImage.description}
          data-ai-hint={appointmentImage.imageHint}
          className="side-img max-w-[390px] bg-bottom"
        />
      )}
    </div>
  );
}
