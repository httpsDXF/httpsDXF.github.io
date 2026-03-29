"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
        Manage published writing and 3D experiments. Use the sidebar to switch
        between sections.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li>
          <Link
            href="/dashboard/blog"
            className="block rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base font-medium text-white transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            Blog posts
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/experiments"
            className="block rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base font-medium text-white transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            Experiments
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/portfolio"
            className="block rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base font-medium text-white transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            Portfolio categories
          </Link>
        </li>
      </ul>
    </div>
  );
}
