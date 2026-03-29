import type { Metadata } from "next";
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
      <p className="mt-4 text-lg text-white/70">
        Project grid and case studies will live here.
      </p>
    </div>
  );
}
