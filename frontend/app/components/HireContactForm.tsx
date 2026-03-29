"use client";

import { useState } from "react";
import { publicContactEmail } from "@/app/config/site";
import { getApiBase, submitHireInquiry } from "@/lib/api";

export function HireContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    const res = await submitHireInquiry({
      name,
      email,
      phone,
      company,
      project_description: projectDescription,
      website: honeypot,
    });
    if (res.ok) {
      setStatus("sent");
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setProjectDescription("");
      setHoneypot("");
      return;
    }
    setStatus("error");
    if (res.code === "missing_api") {
      setError(
        publicContactEmail
          ? "This form isn’t available here—use the email below to get in touch."
          : res.error,
      );
    } else {
      setError(res.error);
    }
  }

  if (status === "sent") {
    return (
      <div className="card-fade-up rounded-2xl border border-emerald-500/30 bg-emerald-950/30 px-6 py-8 text-center">
        <p className="text-lg font-medium text-emerald-100/95">
          Message sent.
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          I&apos;ll reply at the address you entered.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="interaction-smooth mt-6 text-sm text-zinc-400 underline-offset-4 hover:text-white hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card-fade-up relative mx-auto max-w-xl space-y-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 md:p-8"
      noValidate
    >
      {!getApiBase() ? (
        <p className="rounded-lg border border-amber-500/25 bg-amber-950/25 px-3 py-2 text-sm text-amber-100/90">
          {publicContactEmail
            ? "Messages can’t be sent from this build—use the email at the bottom of the page."
            : "The contact form isn’t configured for this environment yet."}
        </p>
      ) : null}

      <p className="text-sm leading-relaxed text-zinc-400">
        What you&apos;re trying to build, timeline if you have one, and the best
        way to reach you. I read every submission.
      </p>

      <div className="sr-only" aria-hidden>
        <label htmlFor="hire-website">Website</label>
        <input
          id="hire-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Name</span>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none ring-0 placeholder:text-zinc-600 focus:border-white/35"
          placeholder="Your name"
          autoComplete="name"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-white/35"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-300">
          Phone <span className="font-normal text-zinc-500">(optional)</span>
        </span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-white/35"
          placeholder="+1 …"
          autoComplete="tel"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-300">
          Company / org <span className="font-normal text-zinc-500">(optional)</span>
        </span>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-white/35"
          placeholder="—"
          autoComplete="organization"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-300">
          Project description
        </span>
        <textarea
          required
          minLength={20}
          rows={6}
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="mt-1.5 w-full resize-y rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-white/35"
          placeholder="What you need, rough timeline, links, constraints…"
        />
        <span className="mt-1 block text-xs text-zinc-500">
          A short paragraph is enough to reply usefully.
        </span>
      </label>

      {status === "error" ? (
        <div className="rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-2 text-sm text-red-200/90">
          <p>{error ?? "Something went wrong."}</p>
          {publicContactEmail ? (
            <p className="mt-2 text-zinc-400">
              You can also email{" "}
              <a
                href={`mailto:${publicContactEmail}`}
                className="text-emerald-400/90 underline-offset-2 hover:underline"
              >
                {publicContactEmail}
              </a>{" "}
              directly.
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="interaction-smooth w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:border-white/35 hover:bg-white/15 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {publicContactEmail ? (
        <p className="text-center text-sm text-zinc-500">
          Or email:{" "}
          <a
            href={`mailto:${publicContactEmail}`}
            className="text-zinc-300 underline-offset-2 hover:underline"
          >
            {publicContactEmail}
          </a>
        </p>
      ) : null}
    </form>
  );
}
