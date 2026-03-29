"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getApiBase } from "@/lib/api";
import { setTokens } from "@/lib/auth";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const base = getApiBase();
    if (!base) {
      setError("Set NEXT_PUBLIC_API_URL in .env.local (e.g. http://127.0.0.1:8000).");
      return;
    }
    setPending(true);
    try {
      const r = await fetch(`${base}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await r.json()) as {
        access?: string;
        refresh?: string;
        detail?: string;
      };
      if (!r.ok || !data.access || !data.refresh) {
        setError(data.detail ?? "Login failed. Use a staff account.");
        return;
      }
      setTokens(data.access, data.refresh);
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Network error — is the Django server running?");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="text-sm text-zinc-500">
        <Link href="/" className="text-white/70 hover:text-white">
          ← Site
        </Link>
      </p>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Dashboard login</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Staff-only JWT login against your Django API.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Username</span>
          <input
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Password</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
          />
        </label>
        {error ? (
          <p className="text-sm text-red-400/90" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="interaction-smooth mt-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
