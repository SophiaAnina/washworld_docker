import "../onboarding.css"

type ToggleProps = {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    onTermsChange: (checked: boolean) => void;
    onPrivacyChange: (checked: boolean) => void;
    error?: string;
}

export default function Toggle({
    termsAccepted,
    privacyAccepted,
    onTermsChange,
    onPrivacyChange,
    error,
}: ToggleProps){

    return(
        <div>
            <div className="toggleContainer">
                <p>Jeg acceptere <a href="">Terms & Condtions</a></p>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => onTermsChange(e.target.checked)}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="toggleContainer">
                <p>Jeg acceptere <a href="">Privacy guidelines</a></p>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => onPrivacyChange(e.target.checked)}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
            {error && <div style={{ color: "red", marginTop: 4 }}>{error}</div>}
        </div>
    )
}