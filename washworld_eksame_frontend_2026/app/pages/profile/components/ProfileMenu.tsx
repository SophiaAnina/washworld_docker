import { IconType } from "react-icons";
import { IoPeopleOutline } from "react-icons/io5";
import { LuClock3, LuSettings, LuLogOut } from "react-icons/lu";
import profileData from "../data/mockProfileData";

const iconMap: Record<string, IconType> = {
  membership: IoPeopleOutline,
  history: LuClock3,
  details: LuSettings,
  logout: LuLogOut,
};

interface ProfileMenuProps {
  onItemClick: (id: string) => void;
}

export default function ProfileMenu({ onItemClick }: ProfileMenuProps) {
  return (
    <section className="profileMenu" aria-label="Profil menu">
      {profileData.menuItems.map((item) => {
        const Icon = iconMap[item.id];
        const isDelete = item.id === "delete-account";

        if (isDelete) {
          return (
            <button key={item.id} type="button" className="deleteAccountBtn" onClick={() => onItemClick(item.id)}>
              {item.label}
            </button>
          );
        }

        return (
          <button key={item.id} type="button" className="profileMenuItem" onClick={() => onItemClick(item.id)}>
            {Icon && <Icon className="menuIcon" aria-hidden="true" />}
            <span className="menuLabel">{item.label}</span>
            <span className="menuChevron" aria-hidden="true">›</span>
          </button>
        );
      })}
    </section>
  );
}