import type { Metadata } from "next";
import Link from "next/link";
import { ExperimentCardPreview } from "@/app/components/experiments/ExperimentCardPreview";
import { fetchExperiments, type Experiment } from "@/lib/api";
import { siteUrl } from "../../config/site";

function isPlaceholderExperiments(list: Experiment[]): boolean {
  return list.length > 0 && list[0].id < 0;
}

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "Experiments and work-in-progress by Yaw Appiah (httpsDXF) — app previews, robotics and mechatronics notes, CAD demos, and interactive 3D viewers.",
  alternates: { canonical: `${siteUrl}/experiments` },
};

const STATIC_INTRO = [
  {
    title: "3D viewer",
    description:
      "Standalone demo for glTF and CAD-style assets: orbit controls and exploded views when you upload multi-part models.",
    href: "/experiments/view",
    cta: "Open viewer",
    variant: "viewer" as const,
  },
] as const;

export default async function ExperimentsPage() {
  const apiList = await fetchExperiments();
  const showSampleNote = isPlaceholderExperiments(apiList);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Experiments
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-white/70">
        Prototypes, CAD viewers, and tooling — including sample GLB projects when the
        API has no uploads yet.
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
                  {exp.description || "Experiment"}
                </p>
                <p className="mt-4 flex items-center gap-1 text-sm font-medium text-white/85">
                  Open
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

      {showSampleNote ? (
        <p className="mt-10 max-w-2xl text-sm text-zinc-500">
          Showing sample experiments (Khronos glTF demos) until your API returns
          published entries or you upload from the dashboard. Use title and
          description to label app previews, docs, or robotics work — the
          interactive viewer applies when the asset is a 3D model.
        </p>
      ) : null}
    </div>
  );
}
