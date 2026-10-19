import { GoDotFill } from "react-icons/go";
import { usePathname } from "next/navigation";

const stepPaths = [
    "/pages/onboarding/step1",
    "/pages/onboarding/step2",
    "/pages/onboarding/step3",
    "/pages/onboarding/step4",
    "/pages/onboarding/step5",
    "/pages/onboarding/step6",
    "/pages/onboarding/step7",
    "/pages/onboarding/step8"
];

export default function Progress() {
    const pathname = usePathname();
    // Find the index of the current step, default to -1 if not found
    const activeIndex = stepPaths.findIndex((step) => pathname.startsWith(step));

    return (
        <div className="progressDots">
            {stepPaths.map((_, idx) => (
                <GoDotFill
                    key={idx}
                    className={"dot" + (idx === activeIndex ? " active" : "")}
                />
            ))}
        </div>
    );
}