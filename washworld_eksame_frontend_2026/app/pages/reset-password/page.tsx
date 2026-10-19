"use client"
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./reset-password.css"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../onboarding/onboarding.css"

type Props = {
    password: string;
    setPassword: (val: string) => void;
    repeatPassword: string;
    setRepeatPassword: (val: string) => void;
};


    
export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

       function doPasswordsMatch(pwd: string, repeatPwd: string) {
        return pwd === repeatPwd;
    }
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    // Try to get key from /reset-password?key=...
    const key = searchParams?.get("key") || "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://127.0.0.1:80/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, "confirm-password": confirmPassword, key })
            });
            const data = await res.json();
            setMessage(data.message || (res.ok ? "Password changed, please login" : "Something went wrong"));
            if (res.ok) {
                setTimeout(() => router.push("/pages/login"), 2000);
            }
        } catch (err) {
            setMessage("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password">
            <form onSubmit={handleSubmit}>
                <h1>Ny adgangskode</h1>
               
                 <div className="inputContainer">
                            <label>Ny adgangskode</label>
                            <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                <input
                                    
                                    type={showPassword ? "text" : "password"}
                                    name="new_password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    
                                />
                                <div onClick={() => setShowPassword(!showPassword)} className="icon-container">
                                    {showPassword ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
                                </div>
                            </div>
            </div>
            <div className="inputContainer">
                <label>Bekræft ny adgangkode</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "30px" }}>
                    <input
                        
                        type={showPassword ? "text" : "password"}
                        placeholder="confirm new password"
                        name="confirm-new-password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                    <div onClick={() => setShowPassword(!showPassword)} className="icon-container">
                        {showPassword ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
                    </div>
                </div>
                {repeatPassword && !doPasswordsMatch(password, repeatPassword) && (
                    <div style={{ color: "red", marginTop: "5px" }}>Adgangkoder er ikke ens</div>
                )}
            </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save password"}
                </button>
            </form>
           
            {message && <div style={{ marginTop: 16 }}>{message}</div>}
        </div>
    );
}