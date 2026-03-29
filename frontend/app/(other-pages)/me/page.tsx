import type { Metadata } from "next";
import Link from "next/link";
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
      <p className="mt-4 max-w-2xl text-lg text-white/70">
        About and background can live on this page. To discuss a project or
        collaboration, use the{" "}
        <Link
          href="/hire"
          className="font-medium text-white underline-offset-4 hover:underline"
        >
          hire &amp; contact form
        </Link>
        .
      </p>
    </div>
  );
}
