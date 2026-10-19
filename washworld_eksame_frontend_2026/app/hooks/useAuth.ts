import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  user_id: string;
  user_name: string;
  user_last_name: string;
  user_email: string;
  user_phone: string;
  user_address: string | null;
  car_plate: string | null;
  payment_gateway_name: string | null;
  membership_name: string | null;
  membership_description: string | null;
  membership_price: number | null;
};

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/pages/login");
      return;
    }
    fetch("http://localhost:80/api-my-info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/pages/login");
          return;
        }
        const data = await res.json();
        if (data.status === "ok") {
          setUser(data.user);
        } else {
          setError(data.message || "Kunne ikke hente brugerdata");
        }
      })
      .catch(() => setError("System under maintenance"))
      .finally(() => setLoading(false));
  }, [router]);

  function logout() {
    localStorage.removeItem("authUser");
    localStorage.removeItem("access_token");
    router.push("/pages/login");
  }
  async function deleteAccount() {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://localhost:80/api-delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Kunne ikke slette konto");
      localStorage.removeItem("authUser");
      localStorage.removeItem("access_token");
      router.push("/pages/login");
    } catch {
      setError("Kunne ikke slette konto. Prøv igen.");
    }
  }

  return { user, loading, error, logout, deleteAccount };
}
