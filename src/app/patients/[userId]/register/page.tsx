
import Image from "next/image";

import RegisterForm from "@/components/forms/RegisterForm";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const Register = ({ params: { userId } }: { params: { userId: string } }) => {
  const registerImage = PlaceHolderImages.find(img => img.id === 'register-img');

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm />

          <p className="copyright py-12">© 2024 Menaharia Medium Clinic</p>
        </div>
      </section>
      
      {registerImage && (
        <Image
          src={registerImage.imageUrl}
          height={1000}
          width={1000}
          alt={registerImage.description}
          data-ai-hint={registerImage.imageHint}
          className="side-img max-w-[390px]"
        />
      )}
    </div>
  );
};

export default Register;
