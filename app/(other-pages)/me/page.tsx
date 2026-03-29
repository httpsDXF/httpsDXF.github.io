import type { Metadata } from "next";
import { siteConfig, siteUrl } from "../../config/site";

export const metadata: Metadata = {
  title: "About & contact",
  description: `About Yaw Nhyira Antwi Appiah (httpsDXF) — ${siteConfig.person.jobTitle.join(", ")}. Contact and hire information.`,
  alternates: { canonical: `${siteUrl}/me` },
};

export default function MePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Me</h1>
      <p className="mt-4 text-lg text-white/70">
        About, contact, and hire details can live on this page.
      </p>
    </div>
  );
}
