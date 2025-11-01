
import Image from "next/image";
import Link from "next/link";
import PatientForm from "@/components/forms/PatientForm";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

export default function Home() {
  const onboardingImage = PlaceHolderImages.find(img => img.id === 'onboarding-img');

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-full">
          <section className="mb-12 flex items-center gap-x-8">
            <div className="space-y-6">
              <h1 className="header text-4xl xl:text-5xl">
                Your Health, <br />
                Our Priority
              </h1>
              <p className="text-lg text-muted-foreground">
                Menaharia Medium Clinic provides comprehensive healthcare for all. We are committed to your well-being.
              </p>
              <div className="flex gap-x-4">
                <Button asChild>
                  <Link href="/patients/user1/new-appointment">New Appointment</Link>
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
             <div className="rounded-lg bg-card p-6 shadow-sm border">
                <h3 className="text-3xl font-bold">24/7</h3>
                <p className="text-muted-foreground">Support</p>
            </div>
             <div className="rounded-lg bg-card p-6 shadow-sm border">
                <h3 className="text-3xl font-bold">1,000+</h3>
                <p className="text-muted-foreground">Happy Patients</p>
            </div>
             <div className="rounded-lg bg-card p-6 shadow-sm border">
                <h3 className="text-3xl font-bold">10+</h3>
                <p className="text-muted-foreground">Years of Experience</p>
            </div>
          </section>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="copyright">© 2024 Menaharia Medium Clinic</p>
            <Link href="/?admin=true" className="text-primary hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </section>

      {onboardingImage && (
        <Image
          src={onboardingImage.imageUrl}
          height={1000}
          width={1000}
          alt={onboardingImage.description}
          data-ai-hint={onboardingImage.imageHint}
          className="side-img max-w-[50%]"
          priority
        />
      )}
    </div>
  );
}

