"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getApiBase, mediaUrl, type Experiment } from "@/lib/api";
import { authHeaders, clearTokens, getAccessToken } from "@/lib/auth";
import { slugify } from "@/lib/slug";

const FORMATS = [
  { value: "glb", label: "glTF / GLB" },
  { value: "gltf", label: "glTF (JSON)" },
  { value: "stl", label: "STL" },
  { value: "obj", label: "OBJ" },
  { value: "other", label: "Other" },
] as const;

export default function DashboardExperimentsPage() {
  const router = useRouter();
  const base = getApiBase();
  const [list, setList] = useState<Experiment[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sourceFormat, setSourceFormat] = useState<string>("glb");
  const [file, setFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!base) return;
    const r = await fetch(`${base}/api/experiments/`, { headers: authHeaders() });
    if (r.status === 401) {
      clearTokens();
      router.replace("/dashboard/login");
      return;
    }
    if (!r.ok) return;
    setList(await r.json());
  }, [base, router]);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/dashboard/login");
      return;
    }
    const id = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(id);
  }, [router, load]);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    if (!base) {
      setErr("Missing NEXT_PUBLIC_API_URL.");
      return;
    }
    if (!file) {
      setErr("Choose a model file (glTF/GLB/STL/OBJ).");
      return;
    }
    const fd = new FormData();
    fd.append("title", title);
    fd.append("slug", slug || slugify(title));
    fd.append("description", description);
    fd.append("source_format", sourceFormat);
    fd.append("model_file", file);
    if (previewFile) fd.append("preview_image", previewFile);
    const r = await fetch(`${base}/api/experiments/`, {
      method: "POST",
      headers: authHeaders(),
      body: fd,
    });
    if (r.status === 401) {
      clearTokens();
      router.replace("/dashboard/login");
      return;
    }
    if (!r.ok) {
      const j = (await r.json().catch(() => ({}))) as Record<string, unknown>;
      setErr(JSON.stringify(j));
      return;
    }
    setMsg("Experiment uploaded.");
    setTitle("");
    setSlug("");
    setDescription("");
    setFile(null);
    setPreviewFile(null);
    void load();
  }

  if (!getAccessToken()) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Experiments</h1>
      <p className="mt-1 max-w-xl text-sm text-zinc-400">
        Showcase work in progress: unreleased apps, robotics or hardware write-ups,
        or CAD and mesh demos. Upload a model file for the interactive 3D viewer;
        use title and description so cards read clearly for non-3D work too. Add
        an optional preview image for the grid.
      </p>

      <form
        onSubmit={upload}
        className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Title</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Slug</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Source format</span>
          <select
            value={sourceFormat}
            onChange={(e) => setSourceFormat(e.target.value)}
            className="rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-white/35"
          >
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Preview image (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPreviewFile(e.target.files?.[0] ?? null)}
            className="text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
          />
          <span className="text-xs text-zinc-500">
            Screenshot or render — shown on the experiments grid.
          </span>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Primary asset (3D model)</span>
          <input
            type="file"
            accept=".glb,.gltf,.stl,.obj"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
          />
          <span className="text-xs text-zinc-500">
            Powers the interactive viewer on the public page. Use title and
            description to spell out app previews, robotics work, or
            documentation — not only the mesh.
          </span>
        </label>
        {err ? (
          <p className="text-sm text-red-400/90" role="alert">
            {err}
          </p>
        ) : null}
        {msg ? <p className="text-sm text-emerald-400/90">{msg}</p> : null}
        <button
          type="submit"
          className="interaction-smooth w-fit rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          Upload experiment
        </button>
      </form>

      <h2 className="mt-12 text-lg font-semibold">Library</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {list.map((ex) => (
          <li
            key={ex.slug}
            className="flex gap-3 border-b border-white/10 py-3"
          >
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
              {ex.preview_image_url ? (
                <Image
                  src={mediaUrl(ex.preview_image_url)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/experiments/${ex.slug}`}
                className="font-medium text-white hover:text-white/90"
              >
                {ex.title}
              </Link>
              <p className="text-zinc-500">{ex.slug}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
