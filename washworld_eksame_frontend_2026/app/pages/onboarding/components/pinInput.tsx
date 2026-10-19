
import { useState } from "react";

type PinInputProps = {
    onChange: (pin: string) => void;
};

export default function PinInput({ onChange }: PinInputProps) {
    const [digits, setDigits] = useState(["", "", "", ""]);

    const updatePin = (nextDigits: string[]) => {
        setDigits(nextDigits);
        onChange(nextDigits.join(""));
    };

    const handleInput = (event: React.FormEvent<HTMLInputElement>, index: number) => {
        const input = event.currentTarget;
        const numericValue = input.value.replace(/\D/g, "").slice(-1);
        const nextDigits = [...digits];
        nextDigits[index] = numericValue;
        updatePin(nextDigits);

        if (numericValue && input.nextElementSibling instanceof HTMLInputElement) {
            input.nextElementSibling.focus();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const input = event.currentTarget;
        if (event.key === "Backspace" && !input.value && input.previousElementSibling instanceof HTMLInputElement) {
            input.previousElementSibling.focus();
        }
    };

    return (
        <div className="pinInputContainer">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    type="tel"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    size={1}
                    maxLength={1}
                    value={digit}
                    onInput={(event) => handleInput(event, index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                />
            ))}
        </div>
    );
}