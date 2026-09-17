type IconName =
  | "transfer"
  | "card"
  | "network"
  | "recurring"
  | "ussd"
  | "airtime"
  | "data"
  | "education"
  | "electricity"
  | "government"
  | "tv"
  | "association"
  | "religion"
  | "taxes"
  | "betting"
  | "gaming"
  | "utilities"
  | "health"
  | "savings"
  | "statement"
  | "limits"
  | "settings"
  | "logout"
  | "search"
  | "home"
  | "rewards"
  | "grid";

function Icon({ name }: { name: IconName }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.75,
    className: "h-5 w-5",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "transfer":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7h-6M17 7v6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6M9 9v4M9 9h4" opacity={0.5} />
        </svg>
      );
    case "card":
      return (
        <svg {...props}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path strokeLinecap="round" d="M2 10h20" />
        </svg>
      );
    case "network":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20v-3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 16.5a5 5 0 017 0" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13a10 10 0 0114 0" />
        </svg>
      );
    case "recurring":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-5h-5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 9a8 8 0 00-14-3.7M4 15a8 8 0 0014 3.7" />
        </svg>
      );
    case "ussd":
      return <span className="text-lg font-[700] leading-none">#</span>;
    case "airtime":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"
          />
        </svg>
      );
    case "data":
      return (
        <svg {...props}>
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <path strokeLinecap="round" d="M11 18h2" />
        </svg>
      );
    case "education":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h5v16H6a2 2 0 00-2 2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 6a2 2 0 00-2-2h-5v16h5a2 2 0 012 2V6z" />
        </svg>
      );
    case "electricity":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h7l-1 8 11-14h-7l1-6z" />
        </svg>
      );
    case "government":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 16c.5-2 2-3 3-3s2.5 1 3 3" />
          <path strokeLinecap="round" d="M14 9h4M14 13h4" />
        </svg>
      );
    case "tv":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path strokeLinecap="round" d="M8 21h8M12 17v4" />
        </svg>
      );
    case "association":
      return (
        <svg {...props}>
          <circle cx="12" cy="10" r="6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l-2 6 5-3 5 3-2-6" />
        </svg>
      );
    case "religion":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l1.5 5L19 9l-5.5 2L12 16l-1.5-5L5 9l5.5-2L12 2z" />
        </svg>
      );
    case "taxes":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-6 9 6" />
          <path strokeLinecap="round" d="M4 10v9M9 10v9M15 10v9M20 10v9M2 21h20" />
        </svg>
      );
    case "betting":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v4M12 17v4M4.2 7.8l3.3 2.4M16.5 13.8l3.3 2.4M4.2 16.2l3.3-2.4M16.5 10.2l3.3-2.4"
          />
        </svg>
      );
    case "gaming":
      return (
        <svg {...props}>
          <rect x="2" y="8" width="20" height="9" rx="4" />
          <path strokeLinecap="round" d="M7 11v3M5.5 12.5h3" />
          <circle cx="16" cy="11.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="18" cy="13.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "utilities":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12v18l-6-4-6 4V3z" />
        </svg>
      );
    case "health":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
        </svg>
      );
    case "savings":
      return (
        <svg {...props}>
          <rect x="4" y="7" width="16" height="12" rx="2" />
          <circle cx="12" cy="13" r="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      );
    case "statement":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h8l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
          <path strokeLinecap="round" d="M9 9h6M9 13h6M9 17h4" />
        </svg>
      );
    case "limits":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l4-2" />
          <circle cx="8" cy="9" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "settings":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
          />
        </svg>
      );
    case "logout":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l5-5-5-5" />
          <path strokeLinecap="round" d="M21 12H9" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
      );
    case "home":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 001 1h4v-6h3v6h4a1 1 0 001-1v-9" />
        </svg>
      );
    case "rewards":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10v4a5 5 0 01-10 0V4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 5H4a3 3 0 003 3M17 5h3a3 3 0 01-3 3" />
          <path strokeLinecap="round" d="M8 21h8M12 17v4" />
        </svg>
      );
    case "grid":
      return (
        <svg {...props} fill="currentColor" stroke="none">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

const SECTIONS: { title: string; items: { key: string; label: string; icon: IconName; danger?: boolean }[] }[] = [
  {
    title: "Send and receive",
    items: [
      { key: "transfer", label: "Transfer", icon: "transfer" },
      { key: "card", label: "Card", icon: "card" },
      { key: "network", label: "Network", icon: "network" },
      { key: "recurring", label: "Recurring", icon: "recurring" },
      { key: "ussd", label: "USSD", icon: "ussd" },
    ],
  },
  {
    title: "Bills and recharges",
    items: [
      { key: "airtime", label: "Airtime", icon: "airtime" },
      { key: "data", label: "Data", icon: "data" },
      { key: "education", label: "Education", icon: "education" },
      { key: "electricity", label: "Electricity", icon: "electricity" },
      { key: "government", label: "Government", icon: "government" },
      { key: "tv", label: "TV", icon: "tv" },
      { key: "association", label: "Association", icon: "association" },
      { key: "religion", label: "Religion", icon: "religion" },
      { key: "taxes", label: "Taxes", icon: "taxes" },
    ],
  },
  {
    title: "Lifestyle",
    items: [
      { key: "betting", label: "Betting", icon: "betting" },
      { key: "gaming", label: "Gaming", icon: "gaming" },
      { key: "utilities", label: "Utilities", icon: "utilities" },
      { key: "health", label: "Health", icon: "health" },
    ],
  },
  {
    title: "Finance",
    items: [{ key: "savings", label: "Savings", icon: "savings" }],
  },
  {
    title: "Accounts and settings",
    items: [
      { key: "statement", label: "Statement", icon: "statement" },
      { key: "limits", label: "Limits", icon: "limits" },
      { key: "settings", label: "Settings", icon: "settings" },
      { key: "logout", label: "Logout", icon: "logout", danger: true },
    ],
  },
];

const TABS: { key: string; label: string; icon: IconName; active?: boolean }[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "card", label: "Card", icon: "card" },
  { key: "services", label: "Services", icon: "grid", active: true },
  { key: "rewards", label: "Rewards", icon: "rewards" },
];

export default function More({ onStatementClick }: { onStatementClick?: () => void }) {
  const handlers: Record<string, (() => void) | undefined> = {
    statement: onStatementClick,
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white">
      <div className="bg-[#23297A] px-6 py-5 text-center">
        <h2 className="text-xl font-[700] text-white">All services</h2>
      </div>

      <div className="px-6 pt-5">
        <div className="flex items-center gap-3 rounded-xl bg-[#23297A]/5 px-4 py-3">
          <span className="text-[#23297A]/50">
            <Icon name="search" />
          </span>
          <span className="text-base text-[#23297A]/50">Search services or settings</span>
        </div>
      </div>

      <div className="flex flex-col gap-8 px-6 py-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-base text-[#23297A]/60">{section.title}</h3>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {section.items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={handlers[item.key]}
                  className={`flex flex-col items-center gap-2 rounded-2xl bg-[#23297A]/5 px-2 py-4 text-center transition-colors hover:bg-[#23297A]/10 ${
                    item.danger ? "text-[#ec2d01]" : "text-[#23297A]"
                  }`}
                >
                  <Icon name={item.icon} />
                  <span className="text-sm font-[600]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-around border-t border-gray-100 px-4 py-4 lg:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`flex flex-col items-center gap-1 text-sm font-[600] ${
              tab.active ? "text-[#FFBF0D]" : "text-[#23297A]"
            }`}
          >
            <Icon name={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
