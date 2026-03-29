import { mergeAttributes, Node } from "@tiptap/core";

/** Self-hosted MP4/WebM/MOV block (uploaded via blog media API). */
export const InlineVideo = Node.create({
  name: "inlineVideo",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "video.inline-story-video" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        class: "inline-story-video",
        controls: true,
        playsInline: true,
        preload: "metadata",
      }),
    ];
  },
});
