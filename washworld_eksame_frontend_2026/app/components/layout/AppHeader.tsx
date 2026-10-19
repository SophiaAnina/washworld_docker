import Image from "next/image";
import styles from "./AppHeader.module.css";

interface User {
  firstName?: string;
  membershipTier?: string;
}

interface Notifications {
  unreadCount?: number;
}

interface AppHeaderProps {
  variant?: "brand" | "dashboard";
  user?: User;
  notifications?: Notifications;
}

export default function AppHeader({ variant = "brand", user, notifications }: AppHeaderProps) {
  if (variant === "dashboard") {
    return (
      <header className={styles.dashboardHeader}>
        <div>
          <p className={styles.eyebrow}>WashWorld</p>
          <h1 className={styles.title}>Hej {user?.firstName || "bruger"}</h1>
          <p className={styles.muted}>{user?.membershipTier || "Intet medlemskab"}</p>
        </div>

        <div className={styles.badge} aria-label="notifications">
          {notifications?.unreadCount || 0}
        </div>
      </header>
    );
  }

  return (
    <header className={styles.brandHeader}>
      <Image
        src="/logo.svg"
        width={120}
        height={42}
        alt="WashWorld"
        priority
        className={styles.logo}
      />
    </header>
  );
}
