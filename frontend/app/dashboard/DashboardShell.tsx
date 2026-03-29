"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/blog", label: "Blog posts" },
  { href: "/dashboard/experiments", label: "Experiments" },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/dashboard/login";

  if (isLogin) {
    return (
      <div className="mx-auto w-full max-w-lg px-[5%] py-12 md:py-20">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <aside className="shrink-0 border-b border-white/10 bg-zinc-900/80 md:w-56 md:border-b-0 md:border-r md:border-white/10">
        <div className="flex gap-1 overflow-x-auto px-[5%] py-3 md:flex-col md:gap-0 md:px-4 md:py-6">
          <p className="hidden px-3 pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:block">
            Dashboard
          </p>
          {nav.map(({ href, label }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`interaction-fast whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium md:px-3 ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <div className="border-t border-white/10 px-[5%] py-3 md:px-4 md:py-4">
          <button
            type="button"
            onClick={() => {
              clearTokens();
              router.replace("/dashboard/login");
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 md:text-left"
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1 px-[5%] py-8 md:py-12 md:pr-10">
        {children}
      </div>
    </div>
  );
}
