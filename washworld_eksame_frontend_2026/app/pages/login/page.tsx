"use client";
import "./login.css";
import "../../globals.css";
import SinglePassword from "../onboarding/components/singlePassword";
import { FaArrowRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:80/api-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: email,
          user_password: password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
        }
        if (data.user) {
          localStorage.setItem("authUser", JSON.stringify(data.user));
        }
        setError("");
        router.push("/pages/dashboard");
      }
    } catch (err) {
      setError("System under maintenance");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <Link href="/" className="tilbageLink">
        <FaChevronLeft /> Tilbage
      </Link>
      <h1>Login</h1>
      <form action="handle" style={{display:"flex", flexDirection:"column",gap:"16px"}}>
      <div className="inputContainer">
        <label>Email</label>
        <input
          name="user_email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
        <SinglePassword 
        password={password}
        setPassword={setPassword}
        />
      <Link className="glemtAdgangskode" href="/pages/forgotPassword">Glemt adgangskode? </Link>
        <button
          className="nextButton"
          type="button"
          onClick={handleLogin}
          disabled={loading}
        >
          <FaArrowRight />
        </button>
        </form>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
    </div>
  );
}
