import type { Metadata } from "next";
import { siteUrl } from "../../config/site";
import { PortfolioClient } from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Engineering and software portfolio by Yaw Appiah (httpsDXF) — robotics, mechatronics, and creative projects.",
  alternates: { canonical: `${siteUrl}/portfolio` },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
