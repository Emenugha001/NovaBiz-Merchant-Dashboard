import Link from "next/link";

export default function Home() {
  return (
    <section className="relative isolate overflow-hidden bg-[#23297A] px-6 min-h-screen flex items-center justify-center">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <h1 className="text-4xl font-[600] leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-8xl">
          Seamlessly Manage Your<br /><span className="text-[#FFBF0D]">Business Finances</span>
        </h1>
        <p className="mt-8 max-w-2xl text-base text-white font- sm:text-lg">
          NovaBiz helps merchants track live payment collections, monitor wallet history, and securely send money across Nigeria with full peace of mind.
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
          <Link
            href="/login"
            className="flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-[600] text-[#23297A] transition-colors hover:bg-[#23297A] hover:text-white hover:border hover:border-white sm:py-4.5 sm:text-lg"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
