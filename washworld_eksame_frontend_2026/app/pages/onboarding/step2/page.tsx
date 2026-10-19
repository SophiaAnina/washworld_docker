"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getOnboardingData, saveOnboardingData, clearOnboardingData } from "../utils/onboardingStorage";
import { autofillDanishAddress } from "../utils/autofillDanishAddress";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Progress from "../components/progress";
import { FaArrowRight } from "react-icons/fa";

import "../onboarding.css";
import BackButton from "@/app/components/layout/BackButton";
export default function OnboardingStep2() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions as user types
  useEffect(() => {
    let active = true;
    if (address.length < 3) {
      setSuggestions([]);
      return;
    }
    autofillDanishAddress(address).then((result) => {
      if (!active) return;
      if (result && result.length > 0) {
        setSuggestions(result);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
    return () => {
      active = false;
    };
  }, [address]);

  const handleSuggestionClick = (suggestion: any) => {
    const fullAddress = `${suggestion.vejnavn} ${suggestion.husnr}, ${suggestion.postnr} ${suggestion.postnrnavn}`;
    setAddress(fullAddress);
    setShowSuggestions(false);
    setSuggestions([]);
    inputRef.current?.blur();
  };
  
  return (
    <div className="Onboarding-2">
      <BackButton />
      <h1>Din Adresse</h1>
      <label htmlFor="">Adresse</label>
      <div style={{ position: "relative" }}>
        <input
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          ref={inputRef}
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="adressSuggestions">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                style={{ padding: "8px", cursor: "pointer" }}
                onMouseDown={() => handleSuggestionClick(s)}
              >
                {s.vejnavn} {s.husnr}, {s.postnr} {s.postnrnavn}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="nextButton"
        type="button"
        onClick={() => {
          router.push("/pages/onboarding/step4");
          saveOnboardingData({ user_address: address });
        }}
      >
        <FaArrowRight />
      </button>
      <Progress />
    </div>
  );
}
