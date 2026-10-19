"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveOnboardingData } from "../utils/onboardingStorage";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Progress from "../components/progress";
import { FaArrowRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import "../onboarding.css";
import BackButton from "@/app/components/layout/BackButton";
export default function OnboardingStep4() {
  const router = useRouter();
  const [carPlate, setCarPlate] = useState("");

  return (
    <div className="Onboarding-2">
      {/* <button
        className='tilbageLink'
        type="button"
      >
        <FaChevronLeft /> Tilbage
      </button> */}
      <BackButton />
      <h1>Tilføj nummerplade</h1>
      <p>Vi bruger nummerpladen til</p>
      <p>automatisk genkendelse</p>
      <label htmlFor="">Nummerplade</label>
      <input required type="text" placeholder="DK 123 4567" value={carPlate} onChange={(e) => setCarPlate(e.target.value)} />
      <button className="button">
        <FaPlus />
        Tilføj endnu en bil
      </button>
      <button
        className="nextButton"
        type="button"
        disabled={!carPlate.trim()}
        onClick={() => {
          saveOnboardingData({ car_plate: carPlate });
          router.push("/pages/onboarding/step5");
        }}
      >
        <FaArrowRight />
      </button>
      <Progress />
    </div>
  );
}
