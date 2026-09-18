"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type { LoginRequest, LoginResponse } from "../lib/api";
import { setActiveProfileId } from "../lib/activeProfile";

const CAROUSEL_IMAGES = [
  "https://res.cloudinary.com/dbmsazt7b/image/upload/v1788180199/Government_qpvypb.png",
  "https://res.cloudinary.com/dbmsazt7b/image/upload/v1788180200/Finance_uji4op.png",
  "https://res.cloudinary.com/dbmsazt7b/image/upload/v1788180202/Enterprise_wyfycz.png",
  "https://res.cloudinary.com/dbmsazt7b/image/upload/v1765370751/company-update_ehes0d.jpg",
];

const CAROUSEL_INTERVAL_MS = 5000;

function EyeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 4.24A9.77 9.77 0 0112 4c5 0 9 4 10 8a13.2 13.2 0 01-1.6 2.9M6.6 6.6C4.4 8 2.9 10 2 12c1 4 5 8 10 8 1.35 0 2.63-.28 3.8-.78" />
    </svg>
  );
}

export default function Login() {
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((index) => (index + 1) % CAROUSEL_IMAGES.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const body: LoginRequest = { email, password };
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(data?.error ?? "Something went wrong. Please try again.");
        }
        return response.json() as Promise<LoginResponse>;
      })
      .then(({ profileId }) => {
        setActiveProfileId(profileId);
        router.push("/dashboard");
      })
      .catch((submitError: Error) => setError(submitError.message))
      .finally(() => setIsSubmitting(false));
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-white px-6 py-16 dark:bg-[#0d0f24]">
        <div className="relative h-72 w-full max-w-sm overflow-hidden rounded-3xl bg-[#23297A]/5 dark:bg-white/5">
          {CAROUSEL_IMAGES.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              className={`object-cover transition-opacity duration-700 ${
                index === imageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="max-w-sm text-center">
          <h2 className="text-xl font-[700] text-[#23297A] dark:text-white">Built for Merchants Like You</h2>
          <p className="mt-2 text-sm text-[#23297A]/60 dark:text-white/60">
            Track live payment collections, monitor wallet history, and send money across Nigeria — all from one dashboard.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-gray-50 px-6 py-16 dark:bg-[#111431]">
        <div className="flex w-full max-w-sm flex-col items-center">
          <Image
            src="https://res.cloudinary.com/dbmsazt7b/image/upload/v1789549983/nova_mmunqz.png"
            alt="NovaBiz"
            width={40}
            height={40}
            className="h-10 w-10 object-contain mix-blend-multiply dark:mix-blend-normal"
          />
          <h1 className="mt-6 text-2xl font-[700] text-[#23297A] dark:text-white">Welcome back</h1>
          <p className="mt-2 text-center text-sm text-[#23297A]/60 dark:text-white/60">
            Sign in to access your NovaBiz merchant dashboard
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-[600] text-[#23297A] dark:text-white">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@novabiz.test"
                className="w-full rounded-xl border border-[#23297A]/15 bg-white px-4 py-3 text-sm text-[#23297A] placeholder:text-[#23297A]/30 focus:outline-none focus:ring-2 focus:ring-[#23297A] dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus:ring-white/40"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-[600] text-[#23297A] dark:text-white">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#23297A]/15 bg-white px-4 py-3 pr-11 text-sm text-[#23297A] placeholder:text-[#23297A]/30 focus:outline-none focus:ring-2 focus:ring-[#23297A] dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus:ring-white/40"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#23297A]/50 hover:text-[#23297A] dark:text-white/50 dark:hover:text-white"
                >
                  {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-[#ec2d01]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-[#23297A] px-5 py-3.5 text-sm font-[700] text-white transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
