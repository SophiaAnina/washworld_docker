"use client";

import { useRouter } from "next/navigation";
import "../onboarding.css";
import { FaCheck } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import Progress from "../components/progress";
export default function OnboardingStep8() {
    const router = useRouter();

    return (
        <div className="Onboarding-6">
            <h1>Velkommen til WashWorld!</h1>
            <FaCheck className="checkIcon" />
            <h2>Du er nu medlem!</h2>
            <p>
               Din bil er nu klar til vask!
            </p>
            <p>God tur!</p>
            <button className="nextButton" type="button" onClick={() => router.push("/pages/login")}>
              <FaChevronRight/>
            </button>
            <Progress/>
        </div>
    );
}


