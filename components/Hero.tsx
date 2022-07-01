import React from "react";
import Image from "next/dist/client/image";
import { useRouter } from "next/router";

const Hero = () => {
  const router = useRouter()
  return (
    <div className="relative h-[400px] sm:h-[450px] lg:h-[500px] xl:h-[600px]">
      <Image
        src="https://res.cloudinary.com/dtram9qiy/image/upload/v1656246620/my-upload/i5l1ligj8yhiskxpae9s.jpg"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
        placeholder="blur"
        blurDataURL="https://res.cloudinary.com/dtram9qiy/image/upload/v1656246620/my-upload/i5l1ligj8yhiskxpae9s.jpg"
        priority={true}
      />
      <header className="absolute top-1/4 w-full text-center">
        <h3 className="text-xl sm:text-3xl lg:text-5xl font-bold tracking-widest">The Furniture Barn Home!</h3>
        <button onClick={() => router.push("/get-started")} className="heroBtn">Get Started</button>
      </header>
    </div>
  );
};

export default Hero;
