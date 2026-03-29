"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mainNavItems } from "../config/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="relative z-[100] w-full px-[5%] pt-6 md:pt-8">
      <div className="relative z-[110] mx-auto flex max-w-[1920px] items-center justify-between gap-4">
        <Link
          href="/"
          className="interaction-fast relative block h-10 w-11 shrink-0 opacity-95 hover:opacity-100 active:scale-[0.97] md:h-11 md:w-12"
          aria-label="Home"
        >
          <Image
            src="/logo.svg"
            alt=""
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-8 text-[15px] font-medium text-white/95 md:flex"
          aria-label="Main"
        >
          {mainNavItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="interaction-fast text-white/95 hover:text-white/70"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/me"
            className="interaction-smooth rounded-md border border-white/20 bg-white/10 px-4 py-2 text-white hover:border-white/35 hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98]"
          >
            Hire Me
          </Link>
        </nav>

        <button
          type="button"
          className="interaction-smooth flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/15 active:scale-[0.95] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span
            className={`relative block h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "rotate-90" : "rotate-0"
            }`}
            aria-hidden
          >
            {open ? (
              <svg
                className="absolute inset-0 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="absolute inset-0 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`mobile-nav-layer fixed inset-0 z-[90] flex min-h-dvh flex-col px-[5%] pb-10 pt-24 md:hidden ${
          open ? "mobile-nav-layer--open" : ""
        }`}
        aria-hidden={!open}
      >
        <nav
          className="flex flex-1 flex-col items-center justify-center py-8"
          aria-label="Mobile"
        >
          <div className="flex w-full max-w-xs flex-col items-stretch gap-1 px-4">
            {mainNavItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="mobile-nav-link interaction-fast block rounded-lg px-4 py-3 text-center text-lg font-medium text-white/95 hover:bg-white/10 active:scale-[0.99]"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/me"
              className="mobile-nav-link interaction-smooth mt-2 block rounded-md border border-white/25 bg-white/10 px-4 py-3 text-center text-lg font-medium text-white hover:border-white/40 hover:bg-white/15 active:scale-[0.99]"
              onClick={() => setOpen(false)}
            >
              Hire Me
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
