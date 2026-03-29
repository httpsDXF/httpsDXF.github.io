"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNavItems } from "../config/navigation";

/** Current page matches this nav href (home is exact `/` only). */
function isActiveNav(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
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
      <div className="relative z-[110] mx-auto flex max-w-[1920px] items-start justify-between gap-4">
        <Link
          href="/"
          className="interaction-fast relative block h-10 w-11 shrink-0 opacity-95 hover:opacity-100 active:scale-[0.97] md:h-11 md:w-12"
          aria-label="Home"
          aria-current={pathname === "/" ? "page" : undefined}
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
          className="hidden items-center gap-8 text-[15px] font-medium text-white/95 md:mt-2 md:flex"
          aria-label="Main"
        >
          {mainNavItems.map(({ href, label }) => {
            const active = isActiveNav(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`interaction-fast relative rounded-md px-1 py-0.5 transition-colors ${
                  active
                    ? "font-semibold text-white after:absolute after:inset-x-1 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-white"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/hire"
            aria-current={pathname === "/hire" ? "page" : undefined}
            className={`interaction-smooth rounded-md border px-4 py-2 hover:scale-[1.02] active:scale-[0.98] ${
              pathname === "/hire"
                ? "border-white/45 bg-white/15 font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
                : "border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15"
            }`}
          >
            Hire Me
          </Link>
        </nav>

        <button
          type="button"
          className="interaction-smooth mt-1.5 flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/15 active:scale-[0.95] md:hidden"
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
            {mainNavItems.map(({ href, label }) => {
              const active = isActiveNav(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`mobile-nav-link interaction-fast block rounded-lg px-4 py-3 text-center text-lg font-medium active:scale-[0.99] ${
                    active
                      ? "bg-white/10 font-semibold text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/hire"
              aria-current={pathname === "/hire" ? "page" : undefined}
              className={`mobile-nav-link interaction-smooth mt-2 block rounded-md border px-4 py-3 text-center text-lg font-medium active:scale-[0.99] ${
                pathname === "/hire"
                  ? "border-white/45 bg-white/15 font-semibold text-white"
                  : "border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15"
              }`}
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
