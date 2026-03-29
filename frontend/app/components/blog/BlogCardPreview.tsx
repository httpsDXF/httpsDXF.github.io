import Image from "next/image";
import { mediaUrl } from "@/lib/api";

const docIcon = (
  <svg
    viewBox="0 0 64 64"
    className="h-14 w-14 text-white/22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    aria-hidden
  >
    <path d="M14 8h26l12 12v36a4 4 0 01-4 4H14a4 4 0 01-4-4V12a4 4 0 014-4z" />
    <path d="M40 8v12h12" />
    <path d="M22 34h20M22 42h20M22 50h12" />
  </svg>
);

export function BlogCardPreview({
  coverUrl,
}: {
  coverUrl: string | null;
}) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black ${coverUrl ? "" : "flex items-center justify-center"}`}
    >
      {coverUrl ? (
        <Image
          src={mediaUrl(coverUrl)}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
      ) : (
        docIcon
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}
