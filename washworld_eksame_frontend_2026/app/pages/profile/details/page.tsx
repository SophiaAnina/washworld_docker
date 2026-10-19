"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../../../components/layout/AppHeader";
import BottomNav from "../../../components/layout/BottomNav";
import ProfileDetailsForm from "../components/ProfileDetailsForm";
import "../profile.css";


const DEFAULT_DETAILS_FORM = {
  phone: "+45 11 22 33 44",
  email: "test@email.dk",
  password: "********",
  paymentMethod: "**** 4242",
  address: "Jagtvej 123, 2200 Kobenhavn N",
  plateNumber: "AB 12 456",
};


export default function ProfileDetailsPage() {
  const router = useRouter();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [detailsForm, setDetailsForm] = useState(DEFAULT_DETAILS_FORM);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/pages/login");
      return;
    }

    fetch("http://localhost:80/api-my-info", { //127.0.0.1
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          throw new Error("UNAUTHORIZED");
        }
        if (!res.ok) {
          throw new Error("FETCH_FAILED");
        }
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setDetailsForm((prev) => ({
            ...prev,
            phone: data.user.user_phone || prev.phone,
            email: data.user.user_email || prev.email,
           
            address: data.user.user_address || prev.address,
            plateNumber: data.user.car_plate || prev.plateNumber,
            // paymentMethod: data.user.payment_gateway_name || prev.paymentMethod,
            paymentMethod: data.user.payment_gateway_id || prev.paymentMethod,
          }));
        }
      })
      .catch((error: Error) => {
        if (error.message === "UNAUTHORIZED") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("authUser");
          router.replace("/pages/login");
        }
      });
  }, [router]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveMessage(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/pages/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:80/api-update-my-info", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_phone: detailsForm.phone,
          user_email: detailsForm.email,
          
          user_address: detailsForm.address,
          car_plate: detailsForm.plateNumber,
          transaction_gateway_fk: detailsForm.paymentMethod, // ck added
        }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("authUser");
        router.replace("/pages/login");
        return;
      }

      if (!response.ok) {
        setSaveMessage(data.message || "Kunne ikke gemme oplysninger.");
        return;
      }

      setSaveMessage("Dine oplysninger er opdateret.");
    } catch {
      setSaveMessage("Systemfejl. Prøv igen senere.");
    }
  }

  return (
    <main className="ProfilePage">
      <AppHeader variant="brand" />
      <ProfileDetailsForm
        detailsForm={detailsForm}
        onChange={(field, value) =>
          setDetailsForm((prev) => ({ ...prev, [field]: value }))
        }
        onSubmit={handleSave}
        onBack={() => router.push("/pages/profile")}
        saveMessage={saveMessage}
      />
      <BottomNav activeTab="profile" variant="angled" />
    </main>
  );
}
