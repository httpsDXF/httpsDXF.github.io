import type { Metadata } from "next";
import { siteUrl } from "../../config/site";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "Experiments and prototypes by Yaw Appiah (httpsDXF) — software, robotics, and mechatronics.",
  alternates: { canonical: `${siteUrl}/experiments` },
};

export default function ExperimentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Experiments
      </h1>
      <p className="mt-4 text-lg text-white/70">
        Playground pieces and prototypes will go here.
      </p>
    </div>
  );
}
