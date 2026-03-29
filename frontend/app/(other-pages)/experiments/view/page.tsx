"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useState } from "react";

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
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }, []);

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

      <div
        className="mt-8 flex flex-wrap items-center gap-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <input
          id="file-input"
          type="file"
          accept=".glb,.gltf,.stl,.obj"
          className="sr-only"
          onChange={onPick}
        />
        <label
          htmlFor="file-input"
          className="interaction-smooth cursor-pointer rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          Choose file
        </label>
        {file ? (
          <>
            <span className="text-sm text-zinc-400">{file.name}</span>
            <button
              type="button"
              className="text-sm text-white/70 underline hover:text-white"
              onClick={() => setFile(null)}
            >
              Clear
            </button>
          </>
        ) : null}
      </div>

      <ModelViewer modelUrl={null} localFile={file} className="mt-8" />
    </div>
  );
}
