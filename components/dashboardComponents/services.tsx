const SERVICES = [
  {
    key: "transfer",
    label: "Transfer",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7h-6M17 7v6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6M9 9v4M9 9h4" opacity={0.5} />
      </svg>
    ),
  },
  {
    key: "airtime",
    label: "Airtime",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l6-6M20 4h-4M20 4v4" />
      </svg>
    ),
  },
  {
    key: "data",
    label: "Data",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6" aria-hidden="true">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path strokeLinecap="round" d="M11 18h2" />
      </svg>
    ),
  },
  {
    key: "betting",
    label: "Betting",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v4M12 17v4M4.2 7.8l3.3 2.4M16.5 13.8l3.3 2.4M4.2 16.2l3.3-2.4M16.5 10.2l3.3-2.4"
        />
      </svg>
    ),
  },
  {
    key: "savings",
    label: "Savings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6" aria-hidden="true">
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <circle cx="12" cy="13" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
    ),
  },
  {
    key: "statement",
    label: "Statement",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h8l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path strokeLinecap="round" d="M9 9h6M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    key: "more",
    label: "More",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
];

export default function Services({
  onMoreClick,
  onTransferClick,
  onAirtimeClick,
  onDataClick,
  onStatementClick,
}: {
  onMoreClick?: () => void;
  onTransferClick?: () => void;
  onAirtimeClick?: () => void;
  onDataClick?: () => void;
  onStatementClick?: () => void;
}) {
  const handlers: Record<string, (() => void) | undefined> = {
    more: onMoreClick,
    transfer: onTransferClick,
    airtime: onAirtimeClick,
    data: onDataClick,
    statement: onStatementClick,
  };

  return (
    <div className="w-full rounded-2xl bg-white p-6 dark:bg-[#161a42]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-[600] text-[#23297A] dark:text-white">Services</h2>
        <button type="button" className="text-sm font-[600] text-[#FFBF0D]">
          Edit
        </button>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3">
        {SERVICES.map((service) => (
          <button
            key={service.key}
            type="button"
            onClick={handlers[service.key]}
            className="flex flex-col items-center gap-2 rounded-2xl bg-[#23297A]/5 px-2 py-4 text-[#23297A] transition-colors hover:bg-[#23297A]/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            {service.icon}
            <span className="text-xs font-[600] sm:text-sm">{service.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
