import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { CaseStudyBlock } from "@/lib/portfolioCaseStudies";
import { mediaUrl } from "@/lib/api";

function BlockFade({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  return (
    <div
      className="card-fade-up"
      style={
        {
          "--card-fade-delay": `${Math.min(index, 24) * 48}ms`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
function parseYoutubeId(input: string): string | null {
  const t = input.trim();
  if (/^[\w-]{11}$/.test(t)) return t;
  const m = t.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m?.[1] ?? null;
}

function parseVimeoId(input: string): string | null {
  const t = input.trim();
  if (/^\d{6,12}$/.test(t)) return t;
  const m = t.match(/vimeo\.com\/(?:video\/)?(\d{6,12})/);
  return m?.[1] ?? null;
}

function ImageBlock({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "image" }>;
}) {
  const src = mediaUrl(block.src);
  if (!src) return null;
  return (
    <figure className="space-y-2">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60">
        <Image
          src={src}
          alt={block.alt ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
          unoptimized
        />
      </div>
      {block.caption ? (
        <figcaption className="text-sm text-zinc-500">{block.caption}</figcaption>
      ) : null}
    </figure>
  );
}

function VideoBlock({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "video" }>;
}) {
  const yt =
    block.youtube != null && block.youtube !== ""
      ? parseYoutubeId(block.youtube)
      : null;
  const vm =
    block.vimeo != null && block.vimeo !== ""
      ? parseVimeoId(block.vimeo)
      : null;
  const file =
    block.fileUrl != null && block.fileUrl !== "" ? block.fileUrl.trim() : null;

  const n = [yt, vm, file].filter(Boolean).length;
  if (n !== 1) {
    return (
      <p className="text-sm text-amber-200/80">
        Video block needs a single source: YouTube, Vimeo, or a file URL.
      </p>
    );
  }

  return (
    <figure className="space-y-2">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60 shadow-sm">
        {yt ? (
          <div className="aspect-video w-full">
            <iframe
              title={block.caption || "YouTube video"}
              src={`https://www.youtube-nocookie.com/embed/${yt}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        ) : null}
        {vm ? (
          <div className="aspect-video w-full">
            <iframe
              title={block.caption || "Vimeo video"}
              src={`https://player.vimeo.com/video/${vm}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        ) : null}
        {file ? (
          <div className="aspect-video w-full">
            <video
              className="h-full w-full object-contain"
              controls
              playsInline
              preload="metadata"
              aria-label={block.caption || "Video"}
            >
              <source src={file} />
            </video>
          </div>
        ) : null}
      </div>
      {block.caption ? (
        <figcaption className="text-sm text-zinc-500">{block.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function CaseStudyBlocks({ blocks }: { blocks: CaseStudyBlock[] }) {
  return (
    <div className="mt-4 max-w-3xl space-y-6">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          return (
            <BlockFade key={i} index={i}>
              <p className="text-base leading-relaxed text-zinc-400 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-zinc-300">
                {block.text}
              </p>
            </BlockFade>
          );
        }
        if (block.type === "image") {
          return (
            <BlockFade key={i} index={i}>
              <ImageBlock block={block} />
            </BlockFade>
          );
        }
        return (
          <BlockFade key={i} index={i}>
            <VideoBlock block={block} />
          </BlockFade>
        );
      })}
    </div>
  );
}
