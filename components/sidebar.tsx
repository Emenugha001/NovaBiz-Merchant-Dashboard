"use client";

import Image from "next/image";
import { useState } from "react";
import { getActiveProfile } from "../lib/activeProfile";

const NAV_ITEMS = [
  {
    key: "overview",
    label: "Overview",
    icon: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789549893/overview_jvbuch.png",
  },
  {
    key: "transfers",
    label: "Transfers",
    icon: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789549834/statistic_nuowsh.png",
  },
  {
    key: "history",
    label: "History",
    icon: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789549770/savings_co0dzg.jpg",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789549711/settings_luq7z9.png",
  },
  {
    key: "support",
    label: "Support",
    icon: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789546118/blue_headset_fv86cq.png",
  },
];

function Logo() {
  return (
    <div className="flex items-center gap-2 px-2">
      <Image
        src="https://res.cloudinary.com/dbmsazt7b/image/upload/v1789549983/nova_mmunqz.png"
        alt="NovaBiz"
        width={32}
        height={32}
        className="h-7 w-7 object-contain mix-blend-multiply"
      />
      <span className="text-xl font-[700] text-[#23297A]">NovaBiz</span>
    </div>
  );
}

function NavList({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <nav className="mt-10 flex flex-col gap-1.5">
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            className={`flex items-center gap-3 rounded-full px-4 py-3 text-left text-sm font-[600] transition-colors ${
              isActive ? "bg-[#23297A] text-white" : "text-[#23297A] hover:bg-gray-50"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                isActive ? "bg-white" : ""
              }`}
            >
              <Image src={item.icon} alt="" width={24} height={24} className="h-6 w-6 object-contain mix-blend-multiply" />
            </span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function PromoCard() {
  return (
    <div className="mt-auto overflow-hidden rounded-2xl">
      <Image
        src="https://res.cloudinary.com/dbmsazt7b/image/upload/v1789548875/card_zlozhc.jpg"
        alt="Grow with NovaBiz"
        width={224}
        height={224}
        className="h-auto w-full object-cover"
      />
    </div>
  );
}

function ProfileFooter() {
  const profile = getActiveProfile();

  return (
    <div className="mt-6 flex items-center gap-3 px-2">
      <Image
        src="https://res.cloudinary.com/dbmsazt7b/image/upload/v1789546026/dummy_human_y0quhb.png"
        alt="Merchant"
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
      />
      <span className="text-sm font-[600] text-[#23297A]">{profile.name}</span>
    </div>
  );
}

export default function Sidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (key: string) => void;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSelect = (key: string) => {
    onSelect(key);
    setIsMobileOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-md text-[#23297A]"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-white px-5 py-8 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-md text-[#23297A]"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <NavList active={active} onSelect={handleSelect} />
            <PromoCard />
            <ProfileFooter />
          </div>
        </div>
      )}

      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-100 lg:bg-white lg:px-5 lg:py-8">
        <Logo />
        <NavList active={active} onSelect={handleSelect} />
        <PromoCard />
        <ProfileFooter />
      </aside>
    </>
  );
}
