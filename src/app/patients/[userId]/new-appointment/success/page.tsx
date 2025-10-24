
import { Button } from "@/components/ui/button";
import { Doctors } from "@/lib/constants";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Check, Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SuccessPage = () => {
  const successGif = PlaceHolderImages.find(img => img.id === 'success-gif');
  const doctor = Doctors[0];

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          {successGif && (
            <Image
              src={successGif.imageUrl}
              height={300}
              width={280}
              alt={successGif.description}
              data-ai-hint={successGif.imageHint}
            />
          )}
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor.image}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor.name}</p>
          </div>
          <div className="flex gap-2">
            <Check className="text-green-500" />
            <p>
              {" "}
              <span>10:00 AM on </span>
              <span>12/12/2024</span>
            </p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/`}>New Appointment</Link>
        </Button>

        <p className="copyright">© 2024 Menaharia Medium Clinic</p>
      </div>
    </div>
  );
};

export default SuccessPage;
