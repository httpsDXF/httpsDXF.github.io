"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import type { Experiment } from "@/lib/api";
import { fetchExperiment, mediaUrl } from "@/lib/api";

const ModelViewer = dynamic(
  () =>
    import("@/app/components/experiments/ModelViewer").then((m) => m.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <p className="mt-10 text-sm text-zinc-400" aria-live="polite">
        Loading 3D viewer…
      </p>
    ),
  },
);

export function ExperimentDetailClient({ slug }: { slug: string }) {
  const [exp, setExp] = useState<Experiment | null | undefined>(undefined);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchExperiment(slug);
        if (!cancelled) {
          if (!data) {
            setExp(null);
            setErr("not found");
          } else {
            setExp(data);
            setErr(null);
          }
        }
      } catch {
        if (!cancelled) {
          setExp(null);
          setErr("failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (exp === undefined) {
    return (
      <p className="text-zinc-300" aria-live="polite">
        Loading…
      </p>
    );
  }

  if (!exp) {
    return (
      <div>
        <p className="text-sm font-medium text-zinc-500">
          <Link href="/experiments" className="text-white/70 hover:text-white">
            ← Experiments
          </Link>
        </p>
        <h1 className="mt-4 text-2xl font-semibold">Experiment</h1>
        <p className="mt-4 text-zinc-400">
          {err === "not found"
            ? "This experiment isn’t available right now. You can still open the 3D viewer."
            : "Couldn’t load this experiment."}
        </p>
        <Link
          href="/experiments/view"
          className="mt-6 inline-block rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          Open viewer
        </Link>
      </div>
    );
  }

  const url = mediaUrl(exp.model_url);

  return (
    <div>
      <p className="text-sm font-medium text-zinc-500">
        <Link href="/experiments" className="text-white/70 hover:text-white">
          ← Experiments
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
        {exp.title}
      </h1>
      {exp.id < 0 ? (
        <p className="mt-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Demo model
        </p>
      ) : null}
      {exp.description ? (
        <p className="mt-4 text-lg text-white/70">{exp.description}</p>
      ) : null}
      <p className="mt-2 text-xs text-zinc-500">Format: {exp.source_format}</p>
      {exp.preview_image_url ? (
        <div
          className="card-fade-up relative mt-8 aspect-[21/9] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
          style={{ "--card-fade-delay": "0ms" } as CSSProperties}
        >
          <Image
            src={mediaUrl(exp.preview_image_url)}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
            unoptimized
          />
        </div>
      ) : null}
      <div
        className="card-fade-up mt-10"
        style={{ "--card-fade-delay": "80ms" } as CSSProperties}
      >
        <ModelViewer modelUrl={url} localFile={null} />
      </div>
    </div>
  );
}
