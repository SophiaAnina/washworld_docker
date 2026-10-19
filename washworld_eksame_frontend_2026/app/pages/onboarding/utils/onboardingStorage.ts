// export function saveOnboardingData(formData: any) {
//   if (typeof window !== "undefined") {
//     localStorage.setItem("onboardingData", JSON.stringify(formData));
//   }
// }

// export function loadOnboardingData() {
//   if (typeof window !== "undefined") {
//     const data = localStorage.getItem("onboardingData");
//     return data ? JSON.parse(data) : {};
//   }
//   return {};
// }


// utils/onboardingStorage.ts
const KEY = "onboarding_data";

export function saveOnboardingData(fields: Record<string, unknown>) {
  const existing = getOnboardingData();
  const merged = { ...existing, ...fields };
  sessionStorage.setItem(KEY, JSON.stringify(merged));
}

export function getOnboardingData(): Record<string, unknown> {
  if (typeof window === "undefined") return {}; // SSR guard
  const raw = sessionStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : {};
}

export function clearOnboardingData() {
  sessionStorage.removeItem(KEY);
}