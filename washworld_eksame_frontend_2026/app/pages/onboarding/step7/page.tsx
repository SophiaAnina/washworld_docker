"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../onboarding.css";
import { FaArrowRight } from "react-icons/fa";
import Progress from "../components/progress";
import BackButton from "@/app/components/layout/BackButton";

export default function OnboardingStep7() {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Vi tjekker din verificering...");

    useEffect(() => {
        const alreadyVerified = localStorage.getItem("onboarding_email_verified") === "true";
        if (alreadyVerified) {
            setIsVerified(true);
            setStatusMessage("Din konto er verificeret. Du kan fortsætte.");
            return;
        }

        const verificationKey = localStorage.getItem("onboarding_verification_key");

        if (!verificationKey) {
            setStatusMessage("Vi kan ikke finde din verificeringsnøgle. Prøv at tilmelde dig igen.");
            return;
        }

        let isMounted = true;

        const checkVerification = async () => {
            try {
                const res = await fetch(`http://localhost:80/api-verification-status/${verificationKey}`);
                const data = await res.json();

                if (!isMounted) return;

                if (res.ok && data.status === "ok") {
                    const verified =
                        data.verified === true ||
                        data.verified === 1 ||
                        data.verified === "1" ||
                        data.verified === "true";
                    setIsVerified(verified);

                    if (verified) {
                        setStatusMessage("Din konto er verificeret. Du kan fortsætte.");
                        localStorage.setItem("onboarding_email_verified", "true");
                        localStorage.removeItem("onboarding_verification_key");
                        return;
                    }

                    setStatusMessage("Vi venter på, at du bekræfter din email.");
                    return;
                }

                setStatusMessage(data.message || "Kunne ikke tjekke verificering.");
            } catch {
                if (!isMounted) return;
                setStatusMessage("Netværksfejl. Kunne ikke tjekke verificering.");
            }
        };

        checkVerification();
        const intervalId = window.setInterval(checkVerification, 3000);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, []);
    
    return (
        <div className="Onboarding-5">
           
            <BackButton/>
            <h1>Tjek din email</h1>
            <p>
                Vi har sendt dig et link til at bekræfte din konto. Klik på linket i
                emailen for at aktivere din profil.
            </p>
            <p>{statusMessage}</p>
            <button
                className={`nextButton ${!isVerified ? "nextButton--disabled" : ""}`}
                type="button"
                onClick={() => router.push("/pages/onboarding/step8")}
                disabled={!isVerified}
            >
                <FaArrowRight />
            </button>
            <Progress/>
        </div>
    );
}


