import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import HeroImage from "../public/hero.jpg";
import Logo from "../Components/Logo/Logo";

export default function Home() {
  const { user } = useUser();
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Image src={HeroImage} alt="Hero" fill className="absolute"></Image>
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm ">
        <Logo></Logo>
        <p>The AI powered SAS Solution to generate</p>
        <p>SEO-optimized blog bost in minutues. Get </p>
        <p>high quality content without wasting your time.</p>
        <Link href="/post/new" className="btn my-4"> BEGIN</Link>
      </div>
    </div>
  );
}
