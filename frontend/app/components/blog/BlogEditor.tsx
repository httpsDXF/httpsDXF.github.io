"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/core";
import type { EditorState } from "@tiptap/pm/state";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import { InlineVideo } from "./inlineVideo";

const ACCENT =
  "border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400/80";
const NEUTRAL =
  "border-zinc-500/50 text-zinc-300 hover:bg-white/10 hover:border-zinc-400/70";

function circleBtn(
  onClick: () => void,
  title: string,
  className: string,
  children: React.ReactNode,
) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-zinc-900/90 transition ${className}`}
    >
      {children}
    </button>
  );
}

async function uploadBlogMedia(file: File): Promise<string | null> {
  const base = getApiBase();
  if (!base) return null;
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${base}/api/blog/media/`, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  });
  if (!r.ok) return null;
  const data = (await r.json()) as { url?: string };
  return data.url ?? null;
}

export function BlogEditor({
  onChange,
  initialHtml = "",
}: {
  onChange: (html: string) => void;
  /** Initial HTML; changing this after mount does not update the editor—remount with `key` if needed. */
  initialHtml?: string;
}) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [insertStripOpen, setInsertStripOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!insertStripOpen) return;
    const close = (e: MouseEvent) => {
      const el = stripRef.current;
      if (el && !el.contains(e.target as Node)) {
        setInsertStripOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [insertStripOpen]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { HTMLAttributes: { class: "list-disc pl-6 my-2" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-6 my-2" } },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-white/90 underline underline-offset-4" },
      }),
      Image.configure({
        HTMLAttributes: {
          class:
            "my-4 max-h-[min(70vh,560px)] w-auto max-w-full rounded-xl border border-white/10",
        },
      }),
      InlineVideo,
      Youtube.configure({
        nocookie: true,
        width: 640,
        height: 360,
        HTMLAttributes: {
          class:
            "h-full w-full max-w-full rounded-xl border-0",
        },
      }),
      Placeholder.configure({
        placeholder: "Tell your story…",
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[min(60vh,520px)] pb-2 pl-2 pt-5 text-[17px] leading-[1.75] text-zinc-200 sm:pl-8 [&_p]:font-serif [&_p]:text-[17px] [&_h2]:font-sans [&_h3]:font-sans",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChangeRef.current(ed.getHTML());
    },
  });

  const insertImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/gif,image/webp";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const url = await uploadBlogMedia(file);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      setInsertStripOpen(false);
    };
    input.click();
  }, [editor]);

  const insertVideoFile = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/webm,video/quicktime";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const url = await uploadBlogMedia(file);
      if (url) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "inlineVideo",
            attrs: { src: url },
          })
          .run();
      }
      setInsertStripOpen(false);
    };
    input.click();
  }, [editor]);

  const insertYoutube = useCallback(() => {
    if (!editor) return;
    const raw = window.prompt("Paste a YouTube URL");
    if (raw === null || raw.trim() === "") return;
    editor.chain().focus().setYoutubeVideo({ src: raw.trim() }).run();
    setInsertStripOpen(false);
  }, [editor]);

  const insertEmbed = useCallback(() => {
    insertYoutube();
  }, [insertYoutube]);

  const openUnsplash = useCallback(() => {
    window.open("https://unsplash.com", "_blank", "noopener,noreferrer");
    setInsertStripOpen(false);
  }, []);

  const insertCode = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleCodeBlock().run();
    setInsertStripOpen(false);
  }, [editor]);

  const insertDivider = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setHorizontalRule().run();
    setInsertStripOpen(false);
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const floatingShouldShow = useCallback(
    ({ editor: ed, state }: { editor: Editor; state: EditorState }) => {
      if (ed.isActive("codeBlock")) return false;
      const { $from } = state.selection;
      if ($from.parent.type.name !== "paragraph") return false;
      return $from.parent.content.size === 0;
    },
    [],
  );

  if (!editor) {
    return (
      <div className="min-h-[360px] rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-zinc-500">
        Loading editor…
      </div>
    );
  }

  return (
    <div ref={stripRef} className="relative">
      <FloatingMenu
        editor={editor}
        shouldShow={floatingShouldShow}
        options={{
          placement: "left-start",
          offset: { mainAxis: -4, crossAxis: 10 },
        }}
        className="z-20 flex items-center gap-1.5"
      >
        {!insertStripOpen ? (
          circleBtn(
            () => setInsertStripOpen(true),
            "Add block",
            NEUTRAL,
            <span className="text-lg font-light leading-none text-zinc-200">
              +
            </span>,
          )
        ) : (
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/95 px-1.5 py-1 shadow-lg shadow-black/40 backdrop-blur-sm">
            {circleBtn(
              () => setInsertStripOpen(false),
              "Close",
              NEUTRAL,
              <span className="text-sm text-zinc-300">×</span>,
            )}
            {circleBtn(
              () => void insertImage(),
              "Image from device",
              ACCENT,
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="8.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
                <path d="M21 15l-5-5-4 4-2-2-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>,
            )}
            {circleBtn(
              openUnsplash,
              "Browse Unsplash (copy URL, then use Image)",
              ACCENT,
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <rect x="5" y="5" width="14" height="14" rx="2" />
                <rect x="9" y="7" width="6" height="5" rx="0.5" fill="currentColor" stroke="none" />
              </svg>,
            )}
            {circleBtn(
              () => void insertVideoFile(),
              "Upload video file",
              ACCENT,
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <rect x="3" y="6" width="14" height="12" rx="2" />
                <path d="M17 10l4-2v8l-4-2v-4z" fill="currentColor" stroke="none" />
              </svg>,
            )}
            {circleBtn(
              insertEmbed,
              "Embed YouTube",
              ACCENT,
              <span className="font-mono text-sm text-emerald-400">&lt; &gt;</span>,
            )}
            {circleBtn(
              insertCode,
              "Code block",
              ACCENT,
              <span className="font-mono text-sm text-emerald-400">{"{ }"}</span>,
            )}
            {circleBtn(
              insertDivider,
              "Divider",
              ACCENT,
              <svg
                className="h-5 w-5 text-emerald-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M4 8h16M4 12h.01M8 12h8M4 16h16" strokeLinecap="round" />
              </svg>,
            )}
          </div>
        )}
      </FloatingMenu>

      <BubbleMenu
        editor={editor}
        shouldShow={({ editor: ed }) =>
          ed !== null &&
          !ed.isActive("codeBlock") &&
          !ed.state.selection.empty
        }
        options={{ placement: "top", offset: 8 }}
        className="z-30 flex flex-wrap items-center gap-0.5 rounded-lg border border-white/15 bg-zinc-900/95 px-1 py-1 shadow-lg shadow-black/40"
      >
        <button
          type="button"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-2 py-1 text-xs font-semibold ${
            editor.isActive("bold")
              ? "bg-white/15 text-white"
              : "text-zinc-300 hover:bg-white/10"
          }`}
        >
          B
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-2 py-1 text-xs italic ${
            editor.isActive("italic")
              ? "bg-white/15 text-white"
              : "text-zinc-300 hover:bg-white/10"
          }`}
        >
          I
        </button>
        <button
          type="button"
          title="Link"
          onClick={() => setLink()}
          className={`rounded px-2 py-1 text-xs ${
            editor.isActive("link")
              ? "bg-white/15 text-white"
              : "text-zinc-300 hover:bg-white/10"
          }`}
        >
          Link
        </button>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
}
