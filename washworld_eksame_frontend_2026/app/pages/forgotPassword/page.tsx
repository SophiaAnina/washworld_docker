"use client";
import "../../globals.css"
import "./forgot-password.css"
import { useState } from "react";
import { useRouter } from "next/navigation";
import {FaChevronLeft } from "react-icons/fa";

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost:80/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_email: email })
            });
            const data = await res.json();
            setMessage(data.message || (res.ok ? "Check your email" : "Something went wrong"));
        } catch (err) {
            setMessage("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password">
            <button className='tilbageLink' type="button" onClick={() => router.back()}>
                    <FaChevronLeft /> Tilbage
                  </button>
            <h1>Forgot password?</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="user_email">Email</label>
                <input
                    type="email"
                    name="user_email"
                    id="user_email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send email"}</button>
            </form>
            {message && <div style={{ marginTop: 16 }}>{message}</div>}
        </div>
    );
}