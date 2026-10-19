"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveOnboardingData } from "../utils/onboardingStorage";
import Toggle from "../components/toggle";
import { FaArrowRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import PasswordRequirements from "../components/signupPassword";
import "../onboarding.css";
import Progress from "../components/progress";
import BackButton from "@/app/components/layout/BackButton";


export default function OnboardingStep1() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [toggleError, setToggleError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  
  const isNextDisabled =
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !phone.trim() ||
    !password.trim() ||
    !repeatPassword.trim() ||
    !termsAccepted ||
    !privacyAccepted;

  
  const validateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setToggleError("");
    setFormError("");
    setSuccess("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (trimmedFirstName.length < 2) {
      setFirstNameError("First name must be at least 2 characters.");
      return;
    }
    if (trimmedFirstName.length > 20) {
      setFirstNameError("First name must be less than 20 characters.");
      return;
    }
    if (trimmedLastName.length < 2) {
      setLastNameError("Last name must be at least 2 characters.");
      return;
    }
    if (trimmedLastName.length > 20) {
      setLastNameError("Last name must be less than 20 characters.");
      return;
    }

    // Check if email is present
    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    if (!termsAccepted || !privacyAccepted) {
      setToggleError("Must fill out");
      return;
    }
    try {
      const res = await fetch("http://localhost:80/email-validation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setEmailError(data.message || "Bruger allerede oprettet");
        return;
      }
      if (password !== repeatPassword) {
        setFormError("Adgangkoder er ikke ens");
        return;
      }
     

      saveOnboardingData({ user_name: trimmedFirstName, user_last_name: trimmedLastName, user_email: email, user_phone: phone, user_password: password });
      setTimeout(() => {
        router.push("/pages/onboarding/step2");
      }, 1500);
    } catch (err) {
      setFormError("Network error. Please try igen.");
    }
  };
  return (
    <div>
    <form className="Onboarding-1" onSubmit={validateEmail} action="#" autoComplete="off" noValidate>
      {/* <button
        className='tilbageLink'
        type="button"
        onClick={() => router.back()}
      >
        <FaChevronLeft /> Tilbage
      </button> */}
        <BackButton/>
      <h1 className="title">Indtast navn</h1>
      <div className="inputContainer">
        <label>Navn</label>
        <input
          type="text"
          name="user_name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        {firstNameError && <div style={{ color: 'red', marginTop: 4, minHeight: 20 }}>{firstNameError}</div>}
      </div>
      <div className="inputContainer">
        <label htmlFor="Efternavn">Efternavn</label>
        <input
          type="text"
          name="user_last_name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        {lastNameError && <div style={{ color: 'red', marginTop: 4, minHeight: 20 }}>{lastNameError}</div>}
      </div>
      <div className="inputContainer">
        <label>Email</label>
        <input
          name="user_email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {emailError && <div style={{ color: 'red', marginTop: 4 }}>{emailError}</div>}
      </div>
      <div className="inputContainer">
        <label>Telefonnummer</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="12 34 56 78"
        />
      </div>

      
      {success && <div style={{ color: 'green', marginTop: 4 }}>{success}</div>}
      <PasswordRequirements
        password={password}
        setPassword={setPassword}
        repeatPassword={repeatPassword}
        setRepeatPassword={setRepeatPassword}
      />
      
      {formError && <div style={{ color: 'red', marginTop: 4 }}>{formError}</div>}
      <Toggle
        termsAccepted={termsAccepted}
        privacyAccepted={privacyAccepted}
        onTermsChange={(checked) => {
          setTermsAccepted(checked);
          if (checked && privacyAccepted) {
            setToggleError("");
          }
        }}
        onPrivacyChange={(checked) => {
          setPrivacyAccepted(checked);
          if (checked && termsAccepted) {
            setToggleError("");
          }
        }}
        error={toggleError}
      />
      <button className='nextButton' type="submit" disabled={isNextDisabled} aria-disabled={isNextDisabled}>
        <FaArrowRight />
      </button>
    </form>
    <Progress/>
    </div>
  );
}