import type { Metadata } from "next";
import { HireContactForm } from "@/app/components/HireContactForm";
import { siteUrl } from "../../config/site";

export const metadata: Metadata = {
  title: "Hire & contact",
  description:
    "Reach out about projects, collaborations, or consulting — project details and your contact info.",
  alternates: { canonical: `${siteUrl}/hire` },
};

export default function HirePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Hire &amp; contact
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-white/70">
        Tell me about your project and the best way to reach you. I will reply
        by email.
      </p>
      <div className="mt-10">
        <HireContactForm />
      </div>
    </div>
  );
}
