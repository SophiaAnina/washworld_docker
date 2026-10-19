"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../onboarding.css";

type Props = {
    password: string;
    setPassword: (val: string) => void;
    
};

export default function SinglePassword({ password, setPassword}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="password">
            <div className="container">
                <div className="inputContainer">
                    <label>Adgangskode</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="user_password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div onClick={() => setShowPassword(!showPassword)} className="icon-container">
                            {showPassword ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
