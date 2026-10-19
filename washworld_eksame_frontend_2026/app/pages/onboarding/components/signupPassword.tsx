"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../onboarding.css";

type Props = {
    password: string;
    setPassword: (val: string) => void;
    repeatPassword: string;
    setRepeatPassword: (val: string) => void;
};

export default function PasswordRequirements({ password, setPassword, repeatPassword, setRepeatPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    function doPasswordsMatch(pwd: string, repeatPwd: string) {
        return pwd === repeatPwd;
    }

    return (
        <div className="password">
            <div className="container">
                <div className="inputContainer">
                    <label>Adgangskode</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", top: '20px', marginBottom: "10px" }}>
                        <input
                            style={{ position: 'absolute' }}
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
                <div className="inputContainer">
                    <label>Bekræft adgangkode</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", top: '20px', marginBottom: "30px" }}>
                        <input
                            style={{ position: 'absolute' }}
                            type={showPassword ? "text" : "password"}
                            name="repeat_user_spassword"
                            required
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                        />
                        <div onClick={() => setShowPassword(!showPassword)} className="icon-container">
                            {showPassword ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
                        </div>
                    </div>
                    {repeatPassword && !doPasswordsMatch(password, repeatPassword) && (
                        <div style={{ color: "red", marginTop: "5px" }}>Adgangkoder er ikke ens</div>
                    )}
                </div>
            </div>
        </div>
    );
}
