import type { PortfolioCard } from "@/lib/placeholderContent";
import { findPortfolioCardBySlug } from "@/lib/portfolioUtils";

/** Rich case study content: text, images, and/or embedded video. */
export type CaseStudyBlock =
  | { type: "paragraph"; text: string }
  | {
      type: "image";
      /** Absolute URL or site-relative path (passed through `mediaUrl` when needed) */
      src: string;
      alt?: string;
      caption?: string;
    }
  | {
      type: "video";
      /** 11-char ID or full `youtube.com` / `youtu.be` URL */
      youtube?: string;
      /** Numeric ID or full `vimeo.com/...` URL */
      vimeo?: string;
      /** Direct URL to mp4, webm, etc. (HTML5 `<video>`) */
      fileUrl?: string;
      caption?: string;
    };

/**
 * Section in `CASE_STUDY_SECTIONS`: use `paragraphs` for text-only, or `blocks`
 * to interleave paragraphs and `video` blocks (YouTube, Vimeo, or file URL).
 */
export type CaseStudySectionInput = {
  heading: string;
  paragraphs?: string[];
  blocks?: CaseStudyBlock[];
};

function sectionToBlocks(s: CaseStudySectionInput): CaseStudyBlock[] {
  if (s.blocks && s.blocks.length > 0) return s.blocks;
  if (s.paragraphs?.length) {
    return s.paragraphs.map((text) => ({ type: "paragraph", text }));
  }
  return [];
}

/** Long-form case study bodies keyed by project `slug`. */
const CASE_STUDY_SECTIONS: Record<string, CaseStudySectionInput[]> = {
  "desktop-test-rig": [
    {
      heading: "Goals",
      blocks: [
        {
          type: "paragraph",
          text: "The bench needed to exercise a small joint module without waiting on full integration: enough structure to mount motors and encoders, room for cable routing, and clear sight lines for debugging.",
        },
        {
          type: "image",
          src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80",
          alt: "Lab bench and tooling",
          caption: "Early bench layout before the final harness pass.",
        },
        {
          type: "paragraph",
          text: "Iteration speed mattered more than polish — the frame had to be easy to reconfigure when we changed actuator choice mid-project.",
        },
      ],
    },
    {
      heading: "What we built",
      blocks: [
        {
          type: "paragraph",
          text: "A compact aluminum layout with modular brackets, tie-downs for DAQ, and labeled harness paths so nothing fought the workspace during long bring-up sessions.",
        },
        {
          type: "video",
          youtube: "M7lc1UVf-SE",
          caption: "Short clip from bring-up—audio optional.",
        },
        {
          type: "paragraph",
          text: "Cable service loops and strain relief were mocked early; that cut rework when we swapped from one driver family to another.",
        },
      ],
    },
    {
      heading: "Outcomes",
      paragraphs: [
        "We could run limit sweeps and friction checks in an afternoon instead of losing days to ad-hoc stands. The same rig informed motor sizing for the next revision.",
      ],
    },
  ],
  "ros-bring-up-notes": [
    {
      heading: "Context",
      paragraphs: [
        "A compact mobile base needed reliable transforms and repeatable launches before autonomy work could start. Sim looked fine; hardware needed the same assumptions spelled out explicitly.",
      ],
    },
    {
      heading: "Practice",
      paragraphs: [
        "We standardized launch files per robot profile, added sanity checks for the TF tree, and logged frame IDs whenever a node published odd transforms.",
        "Sim-to-real gaps showed up as timing and wheel slip rather than missing topics — documenting that saved the next integration pass.",
      ],
    },
  ],
  "sensor-fusion-sketch": [
    {
      heading: "Problem",
      paragraphs: [
        "Wheel odometry drifts; the IMU is noisy on this platform. The question was how much blending buys you before complexity outweighs gains.",
      ],
    },
    {
      heading: "Approach",
      paragraphs: [
        "We tried a straightforward complementary-style blend with conservative gains, then compared against raw odometry on a taped course.",
        "Noise models helped set expectations; the bigger win was detecting when GPS-denied segments needed a different trust profile.",
      ],
    },
  ],
  "studio-wordmark": [
    {
      heading: "Brief",
      paragraphs: [
        "The mark had to feel technical but approachable, work at favicon size, and survive both light and dark UI without a separate redraw.",
      ],
    },
    {
      heading: "Craft",
      paragraphs: [
        "Optical balance beat geometric centering: we nudged weight so the wordmark sits calmly next to UI chrome.",
        "Export rules cover minimum clear space, monochrome usage, and when to use the logotype versus the symbol alone.",
      ],
    },
  ],
  "site-grid-system": [
    {
      heading: "Intent",
      paragraphs: [
        "The site should read like an editorial surface: calm rhythm, predictable spacing, and type that scales predictably from phone to desktop.",
      ],
    },
    {
      heading: "System",
      paragraphs: [
        "A small set of breakpoints and spacing tokens drive layout; components consume tokens instead of one-off pixels.",
        "The type scale ties heading levels to body copy so long posts stay readable without custom CSS per page.",
      ],
    },
  ],
  "motion-principles": [
    {
      heading: "Principles",
      blocks: [
        {
          type: "paragraph",
          text: "Motion explains hierarchy: it should clarify where you came from and where focus landed, not decorate for its own sake.",
        },
        {
          type: "paragraph",
          text: "Durations stay short; easing follows natural deceleration so the UI feels responsive without feeling flashy.",
        },
        {
          type: "video",
          fileUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          caption: "Motion study clip—hosted file embed.",
        },
      ],
    },
    {
      heading: "Accessibility",
      paragraphs: [
        "We respect `prefers-reduced-motion`: transitions collapse to instant or near-instant changes when that preference is set.",
      ],
    },
  ],
  "low-light-street-set": [
    {
      heading: "Series",
      paragraphs: [
        "Night work in the city: high contrast, slow shutter discipline, and finding readable silhouettes without crushing shadow detail.",
      ],
    },
    {
      heading: "Process",
      paragraphs: [
        "A small set of primes kept the kit light; most frames were rejected for merge or micro-blur — the keepers are the ones with clear intent.",
      ],
    },
  ],
  "studio-still-life": [
    {
      heading: "Setup",
      paragraphs: [
        "Controlled lighting and a simple surface let texture and edge read clearly — closer to product-adjacent work than documentary street shooting.",
      ],
    },
    {
      heading: "Focus",
      paragraphs: [
        "This set is about material honesty: scratches, reflections, and falloff are part of the story rather than things to erase.",
      ],
    },
  ],
  "travel-log-selects": [
    {
      heading: "Edit",
      paragraphs: [
        "Travel generates thousands of frames; this set is a tight edit — moments that stay legible at postcard scale and still reward a second look.",
      ],
    },
    {
      heading: "Next",
      paragraphs: [
        "Captions and print sizes are still open; the sequence may become a small zine or a gallery strip on the site.",
      ],
    },
  ],
};

export type PortfolioCaseStudySection = {
  heading: string;
  blocks: CaseStudyBlock[];
};

/** Normalize API-stored case study JSON into section + blocks. */
export function normalizeCaseStudyFromApi(
  raw: unknown,
): PortfolioCaseStudySection[] {
  if (!raw || !Array.isArray(raw)) return [];
  const out: PortfolioCaseStudySection[] = [];
  for (const sec of raw) {
    if (!sec || typeof sec !== "object") continue;
    const heading =
      typeof (sec as { heading?: string }).heading === "string"
        ? (sec as { heading: string }).heading
        : "";
    const blocks = (sec as { blocks?: unknown }).blocks;
    if (!Array.isArray(blocks)) continue;
    out.push({ heading, blocks: blocks as CaseStudyBlock[] });
  }
  return out;
}

export function getPortfolioCaseStudy(slug: string): {
  category: string;
  card: PortfolioCard;
  sections: PortfolioCaseStudySection[];
} | null {
  const found = findPortfolioCardBySlug(slug);
  if (!found) return null;
  const raw =
    CASE_STUDY_SECTIONS[slug] ??
    ([
      {
        heading: "Overview",
        paragraphs: [found.card.description],
      },
      {
        heading: "More detail",
        paragraphs: [
          "More depth—constraints, process, and what changed between revisions—can sit in the extended write-up for this project.",
        ],
      },
    ] satisfies CaseStudySectionInput[]);

  const sections: PortfolioCaseStudySection[] = raw.map((sec) => ({
    heading: sec.heading,
    blocks: sectionToBlocks(sec),
  }));

  return { ...found, sections };
}
