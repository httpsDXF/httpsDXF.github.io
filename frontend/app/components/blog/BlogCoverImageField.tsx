"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { getCroppedImg } from "@/lib/cropImage";
import { mediaUrl } from "@/lib/api";

/** Matches blog card / listing frames (see BlogCardPreview). */
const COVER_ASPECT = 4 / 3;

export function BlogCoverImageField({
  coverFile,
  onCoverFileChange,
  initialCoverUrl,
}: {
  coverFile: File | null;
  onCoverFileChange: (f: File | null) => void;
  initialCoverUrl?: string | null;
}) {
  const [cropOpen, setCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
    null,
  );
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!coverFile) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const displayUrl = objectUrl
    ? objectUrl
    : initialCoverUrl
      ? mediaUrl(initialCoverUrl)
      : null;

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setCropOpen(true);
    });
    reader.readAsDataURL(file);
  };

  const applyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setBusy(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCoverFileChange(
        new File([blob], "cover.jpg", { type: "image/jpeg" }),
      );
      setCropOpen(false);
      setImageSrc(null);
    } finally {
      setBusy(false);
    }
  };

  const cancelCrop = () => {
    setCropOpen(false);
    setImageSrc(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-zinc-500">Cover image (optional)</span>
      <p className="text-xs text-zinc-600">
        4:3 frame — drag to position, use zoom to fit your subject.
      </p>

      {displayUrl ? (
        <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
          <Image
            src={displayUrl}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] w-full max-w-md items-center justify-center rounded-xl border border-dashed border-white/15 bg-zinc-900/50 text-sm text-zinc-500">
          No cover
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10">
          {displayUrl ? "Replace cover" : "Choose image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="sr-only"
            onChange={onPickFile}
          />
        </label>
        {coverFile ? (
          <button
            type="button"
            onClick={() => onCoverFileChange(null)}
            className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
          >
            Clear new cover
          </button>
        ) : null}
      </div>

      {cropOpen && imageSrc ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cover-crop-title"
        >
          <div className="flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-xl">
            <h3 id="cover-crop-title" className="text-sm font-medium text-white">
              Position cover (4:3)
            </h3>
            <div className="relative h-[min(56vh,420px)] w-full overflow-hidden rounded-xl bg-zinc-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={COVER_ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                onCropAreaChange={(_, pixels) => setCroppedAreaPixels(pixels)}
                objectFit="horizontal-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="w-12 shrink-0">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer accent-emerald-600"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelCrop}
                className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy || !croppedAreaPixels}
                onClick={() => void applyCrop()}
                className="rounded-lg border border-emerald-600/50 bg-emerald-600/25 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-600/35 disabled:opacity-50"
              >
                {busy ? "Saving…" : "Use cover"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
