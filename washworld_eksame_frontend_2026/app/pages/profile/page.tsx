"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../../components/layout/AppHeader";
import BottomNav from "../../components/layout/BottomNav";
import ProfileMenu from "./components/ProfileMenu";
import "./profile.css";
import { useAuth } from "@/app/hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user, loading, error, logout, deleteAccount } = useAuth();

  function handleItemClick(id: string) {
    if (id === "logout") {
      setShowLogoutModal(true);
      return;
    }
    if (id === "delete-account") {
      setShowDeleteModal(true);
      return;
    }
    if (id === "membership") {
      router.push("/pages/profile/membership/details");
      return;
    }
    router.push(`/pages/profile/${id}`);
  }

  async function handleConfirmLogout() {
    try {
      await fetch("http://127.0.0.1:80/logout", {
        method: "GET",
      });
    } catch {}
    logout();
    setShowLogoutModal(false);
  }

  return (
    <main className="ProfilePage">
      <AppHeader variant="brand" />
      {loading ? (
        <div>Indlæser...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : user ? (
        <>
          <ProfileMenu onItemClick={handleItemClick} />
        </>
      ) : null}
      {showDeleteModal && (
        <div className="logoutOverlay">
          <div className="logoutModal">
            <p className="logoutQuestion">Er du sikker på, at du vil slette din konto?</p>
            <div className="logoutActions">
              <button
                type="button"
                className="logoutConfirm"
                onClick={async () => {
                  await deleteAccount();
                  setShowDeleteModal(false);
                }}
              >
                Slet konto
              </button>
              <button type="button" className="logoutCancel" onClick={() => setShowDeleteModal(false)}>
                Fortryd
              </button>
            </div>
          </div>
        </div>
      )}
      {showLogoutModal && (
        <div className="logoutOverlay" role="dialog" aria-modal="true" aria-label="Log ud bekræftelse">
          <div className="logoutModal">
            <p className="logoutQuestion">Log ud af din konto ?</p>
            <div className="logoutActions">
              <button type="button" className="logoutConfirm" onClick={handleConfirmLogout}>
                Log ud
              </button>
              <button type="button" className="logoutCancel" onClick={() => setShowLogoutModal(false)}>
                Fortryd
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav activeTab="profile" variant="angled" />
    </main>
  );
}
