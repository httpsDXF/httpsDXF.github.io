import type { Metadata } from "next";
import { Suspense } from "react";
import { PortfolioIndexClient } from "./PortfolioIndexClient";
import { siteUrl } from "../../config/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Engineering and software portfolio by Yaw Appiah (httpsDXF) — robotics, mechatronics, and creative projects.",
  alternates: { canonical: `${siteUrl}/portfolio` },
};

export default function PortfolioPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Portfolio</h1>
      <Suspense
        fallback={
          <p className="mt-6 text-zinc-500" aria-live="polite">
            Loading…
          </p>
        }
      >
        <PortfolioIndexClient />
      </Suspense>
    </div>
  );
}
