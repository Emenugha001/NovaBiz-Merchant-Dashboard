"use client";

export default function ComingSoon({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#23297A] p-8 text-center shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-white/70 hover:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFBF0D]/15 text-[#FFBF0D]">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3.5 2" />
          </svg>
        </span>

        <h2 className="mt-5 text-lg font-[700] text-white">{title}</h2>
        <p className="mt-2 text-sm text-white/60">
          We&apos;re still building this. Check back soon — it&apos;ll be ready before you know it.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-[#FFBF0D] px-5 py-3 text-sm font-[700] text-[#23297A] transition-opacity hover:opacity-90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
