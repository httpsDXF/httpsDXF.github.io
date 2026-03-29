import Image from "next/image";
import { mediaUrl } from "@/lib/api";

const cubeIcon = (
  <svg
    viewBox="0 0 64 64"
    className="h-14 w-14 text-white/25"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    aria-hidden
  >
    <path d="M32 8l24 14v28L32 64 8 50V22L32 8z" />
    <path d="M8 22l24 14 24-14M32 36v28" />
  </svg>
);

type Props = {
  previewUrl: string | null;
  /** Visual variant for static / built-in cards */
  variant?: "default" | "viewer";
};

export function ExperimentCardPreview({ previewUrl, variant = "default" }: Props) {
  const bg =
    variant === "viewer"
      ? "bg-gradient-to-br from-slate-800 via-zinc-900 to-black"
      : "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black";

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden ${bg} ${previewUrl ? "" : "flex items-center justify-center"}`}
    >
      {previewUrl ? (
        <Image
          src={mediaUrl(previewUrl)}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 400px"
          unoptimized
        />
      ) : (
        cubeIcon
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}
