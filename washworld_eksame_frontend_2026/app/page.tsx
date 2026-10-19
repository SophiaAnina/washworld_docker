"use client"
import Image from "next/image";
import Link from "next/link";
import "./start.css"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="Start">
      <Image
        src="/logo.svg"
        width={100}
        height={400}
        alt="WashWorld"
        priority
      />

      <div>
        <button
          className="brandGrøn"
          onClick={() => {
            router.push("/pages/login")
          }}>Login</button>
        <button
          type="button"
          className="primaryWhite"
          onClick={() => {
            router.push("/pages/onboarding/step1");
          }}
        >Opret bruger</button>
      </div>

    </div>

  );
}
