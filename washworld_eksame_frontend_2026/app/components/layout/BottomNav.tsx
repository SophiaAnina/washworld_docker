import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { BsDroplet } from "react-icons/bs";
import { IconType } from "react-icons";
import styles from "./BottomNav.module.css";

interface NavItem {
  id: string;
  label: string;
  Icon: IconType;
  route: string;
}

const navItems: NavItem[] = [
  { id: "profile", label: "Profil", Icon: FaRegUser, route: "/pages/profile" },
  { id: "dashboard", label: "Kort", Icon: IoLocationOutline, route: "/pages/dashboard" },
  { id: "wash", label: "Vask", Icon: BsDroplet, route: "/pages/wash" },
];

interface BottomNavProps {
  activeTab: string;
  variant?: "simple" | "angled";
}

export default function BottomNav({ activeTab, variant = "simple" }: BottomNavProps) {
  if (variant === "angled") {
    return (
      <nav className={styles.bottomNavAngled} aria-label="Bottom navigation">
        {navItems.map(({ id, label, Icon, route }) => (
          <Link
            key={id}
            href={route}
            className={id === activeTab ? styles.navItemActiveAngled : styles.navItemAngled}
          >
            <Icon className={styles.navIcon} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className={styles.bottomNavSimple} aria-label="Bottom navigation">
      {navItems.map(({ id, label, Icon, route }) => (
        <Link
          key={id}
          href={route}
          className={id === activeTab ? styles.navItemActiveSimple : styles.navItemSimple}
        >
          <Icon className={styles.navIcon} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
