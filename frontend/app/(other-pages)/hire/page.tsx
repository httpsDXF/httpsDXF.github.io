import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { HireContactForm } from "@/app/components/HireContactForm";
import { siteUrl } from "../../config/site";

export const metadata: Metadata = {
  title: "Hire & contact",
  description:
    "Contact Yaw Appiah (httpsDXF) about projects or collaborations. Send a short brief and your details.",
  alternates: { canonical: `${siteUrl}/hire` },
};

export default function HirePage() {
  return (
    <div>
      <div
        className="card-fade-up"
        style={{ "--card-fade-delay": "0ms" } as CSSProperties}
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Hire &amp; contact
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70">
          Send a short description of what you need and how to reach you. I
          reply by email.
        </p>
      </div>
      <div className="mt-10">
        <HireContactForm />
      </div>
    </div>
  );
}
