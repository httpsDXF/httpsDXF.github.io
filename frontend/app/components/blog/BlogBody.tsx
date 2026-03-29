import DOMPurify from "isomorphic-dompurify";
import ReactMarkdown from "react-markdown";

let blogHtmlPurifyHooks = false;

function ensureBlogHtmlHooks() {
  if (blogHtmlPurifyHooks) return;
  blogHtmlPurifyHooks = true;
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    const el = node as Element;
    if (data.tagName === "iframe") {
      const src = el.getAttribute("src") ?? "";
      const ok =
        /^https:\/\/(www\.youtube\.com|www\.youtube-nocookie\.com)\/embed\//.test(
          src,
        );
      if (!ok) {
        node.parentNode?.removeChild(node);
      }
    }
    if (data.tagName === "video") {
      const src = el.getAttribute("src") ?? "";
      if (!src || !/^https:\/\//i.test(src)) {
        node.parentNode?.removeChild(node);
      }
    }
  });
}

function sanitizeHtml(html: string): string {
  ensureBlogHtmlHooks();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "h1",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "a",
      "img",
      "hr",
      "div",
      "iframe",
      "video",
    ],
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "src",
      "alt",
      "class",
      "title",
      "allow",
      "allowfullscreen",
      "frameborder",
      "width",
      "height",
      "controls",
      "playsinline",
      "preload",
      "data-youtube-video",
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["target"],
  });
}

export function BlogBody({
  body,
  bodyFormat,
}: {
  body: string;
  bodyFormat: "markdown" | "html";
}) {
  if (bodyFormat === "html") {
    const safe = sanitizeHtml(body);
    return (
      <div
        className="blog-html-content mt-10 max-w-none space-y-4 text-[15px] leading-relaxed text-zinc-300 [&_a]:text-white/90 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-400 [&_code]:rounded-md [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_div[data-youtube-video]]:relative [&_div[data-youtube-video]]:my-6 [&_div[data-youtube-video]]:aspect-video [&_div[data-youtube-video]]:w-full [&_div[data-youtube-video]]:max-w-full [&_div[data-youtube-video]]:overflow-hidden [&_div[data-youtube-video]]:rounded-xl [&_div[data-youtube-video]]:border [&_div[data-youtube-video]]:border-white/10 [&_div[data-youtube-video]_iframe]:absolute [&_div[data-youtube-video]_iframe]:inset-0 [&_div[data-youtube-video]_iframe]:h-full [&_div[data-youtube-video]_iframe]:w-full [&_h1]:mt-10 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-white [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white/95 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-white/90 [&_iframe]:max-w-full [&_img]:my-6 [&_img]:max-h-[min(70vh,560px)] [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-white/10 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:leading-relaxed [&_p]:font-serif [&_p]:text-[17px] [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_ul]:list-disc [&_ul]:pl-6 [&_video.inline-story-video]:my-6 [&_video.inline-story-video]:max-h-[min(70vh,560px)] [&_video.inline-story-video]:w-auto [&_video.inline-story-video]:max-w-full [&_video.inline-story-video]:rounded-xl [&_video.inline-story-video]:border [&_video.inline-story-video]:border-white/10"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }

  return (
    <div className="mt-10 max-w-none space-y-4 text-[15px] leading-relaxed text-zinc-300 [&_h1]:mt-10 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-white [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white/95 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_a]:text-white/90 [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded-md [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-400">
      <ReactMarkdown>{body}</ReactMarkdown>
    </div>
  );
}
