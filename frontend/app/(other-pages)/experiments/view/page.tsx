"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const ModelViewer = dynamic(
  () =>
    import("@/app/components/experiments/ModelViewer").then((m) => m.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <p className="mt-8 text-sm text-zinc-400" aria-live="polite">
        Loading 3D viewer…
      </p>
    ),
  },
);

export default function ExperimentsViewPage() {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-500">
        <Link href="/experiments" className="text-white/70 hover:text-white">
          ← Experiments
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
        3D viewer
      </h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-500">
        Sample model for orbit and lighting. Upload workflows are handled from the
        dashboard experiments flow.
      </p>

      <ModelViewer modelUrl={null} localFile={null} className="mt-8" />
    </div>
  );
}
