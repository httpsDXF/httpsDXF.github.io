import type { Metadata } from "next";
import Link from "next/link";
import { ExperimentCardPreview } from "@/app/components/experiments/ExperimentCardPreview";
import { fetchExperiments } from "@/lib/api";
import { siteUrl } from "../../config/site";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "Experiments and prototypes by Yaw Appiah (httpsDXF) — software, robotics, and mechatronics.",
  alternates: { canonical: `${siteUrl}/experiments` },
};

const STATIC_INTRO = [
  {
    title: "3D viewer",
    description:
      "Interactive models with orbit controls and exploded views for multi-part assemblies.",
    href: "/experiments/view",
    cta: "Open viewer",
    variant: "viewer" as const,
  },
] as const;

export default async function ExperimentsPage() {
  const apiList = await fetchExperiments();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Experiments
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-white/70">
        Prototypes, CAD viewers, and tooling.
      </p>

      <ul className="mt-12 grid gap-8 sm:grid-cols-2">
        {STATIC_INTRO.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group block overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-sm transition hover:border-white/20 hover:bg-zinc-900/70"
            >
              <ExperimentCardPreview
                previewUrl={null}
                variant={item.variant}
              />
              <div className="p-5 md:p-6">
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {item.description}
                </p>
                <p className="mt-4 flex items-center gap-1 text-sm font-medium text-white/85">
                  {item.cta}
                  <span
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
        {apiList.map((exp) => (
          <li key={exp.slug}>
            <Link
              href={`/experiments/${exp.slug}`}
              className="group block overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-sm transition hover:border-white/20 hover:bg-zinc-900/70"
            >
              <ExperimentCardPreview
                previewUrl={exp.preview_image_url}
                variant="default"
              />
              <div className="p-5 md:p-6">
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  {exp.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                  {exp.description || "3D model"}
                </p>
                <p className="mt-4 flex items-center gap-1 text-sm font-medium text-white/85">
                  Open viewer
                  <span
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {apiList.length === 0 ? (
        <p className="mt-10 text-sm text-zinc-500">
          Project models will appear here when published.
        </p>
      ) : null}
    </div>
  );
}
