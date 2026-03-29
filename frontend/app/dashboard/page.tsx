"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { getAccessToken } from "@/lib/auth";

export default function DashboardHomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/dashboard/login");
      return;
    }
    const id = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(id);
  }, [router]);

  if (!ready) {
    return (
      <p className="text-zinc-400" aria-live="polite">
        Checking session…
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Overview</h1>
      <p className="mt-2 max-w-lg text-sm text-zinc-400">
        Blog, portfolio, and experiments—open a section to edit.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(
          [
            { href: "/dashboard/blog", label: "Blog" },
            { href: "/dashboard/experiments", label: "Experiments" },
            { href: "/dashboard/portfolio", label: "Portfolio" },
          ] as const
        ).map((item, i) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="card-fade-up block rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base font-medium text-white hover:border-white/20 hover:bg-white/[0.07]"
              style={
                {
                  "--card-fade-delay": `${i * 48}ms`,
                } as CSSProperties
              }
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
