/** Shown when the API is offline or returns no posts (static GitHub Pages builds). */
export const PLACEHOLDER_BLOG_SLUGS = [
  "welcome-notes",
  "mechatronics-sketch",
  "visual-identity-sprint",
] as const;

const ISO = (d: string) => `${d}T12:00:00.000Z`;

export const PLACEHOLDER_BLOG_POSTS = [
  {
    id: -1,
    title: "Welcome — building in public",
    slug: "welcome-notes",
    description:
      "A short hello and how this space will grow: engineering notes, experiments, and STEAM threads.",
    body: `<p>This is placeholder content so the blog looks alive before your API is connected or before you publish real posts from the dashboard.</p>
<p>Replace it anytime: new posts from the dashboard override the list when your backend returns published entries.</p>
<h2>What to expect</h2>
<ul><li>Robotics and mechatronics breakdowns</li><li>Tooling and workflow notes</li><li>Occasional brand and photo essays</li></ul>`,
    body_format: "html",
    published: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    media: [],
    created_at: ISO("2026-01-10"),
    updated_at: ISO("2026-01-12"),
  },
  {
    id: -2,
    title: "Mechatronics sketch — torque and timing",
    slug: "mechatronics-sketch",
    description:
      "Scribbles from a weekend actuator test: gearing assumptions, safety margins, and what broke first.",
    body: `<p>Placeholder article body. Imagine step-by-step photos of a test rig, torque curves, and a honest “what we’d do differently” list.</p>
<blockquote><p>Measure twice, simulate once, then measure again.</p></blockquote>
<p>Your real post can use the rich editor: images, video, YouTube embeds, code blocks, and dividers.</p>`,
    body_format: "html",
    published: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80",
    media: [],
    created_at: ISO("2026-01-18"),
    updated_at: ISO("2026-01-20"),
  },
  {
    id: -3,
    title: "Brand sprint — type, grid, and motion",
    slug: "visual-identity-sprint",
    description:
      "A one-week pass at hierarchy, spacing, and motion rules for a personal studio site.",
    body: `<p>Placeholder narrative for a brand-focused post: mood boards, type pairing, and exportable tokens.</p>
<p>Swap this content for case-study copy when you are ready; the layout already supports long-form HTML from the editor.</p>`,
    body_format: "html",
    published: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    media: [],
    created_at: ISO("2026-02-01"),
    updated_at: ISO("2026-02-03"),
  },
];

export function getPlaceholderPostBySlug(slug: string) {
  return PLACEHOLDER_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export type PortfolioCard = {
  title: string;
  description: string;
  meta: string;
};

/** Default category sections — extra dashboard categories have no cards until you add CMS data. */
export const PORTFOLIO_PLACEHOLDER_CARDS: Record<string, PortfolioCard[]> = {
  Mechatronics: [
    {
      title: "Desktop test rig",
      description:
        "Frame, actuators, and DAQ layout for quick iteration on joint limits and cabling.",
      meta: "Hardware · Prototype",
    },
    {
      title: "ROS bring-up notes",
      description:
        "Launch files, TF tree sanity checks, and sim-to-real gaps we closed on a small mobile base.",
      meta: "Software · Robotics",
    },
    {
      title: "Sensor fusion sketch",
      description:
        "IMU + wheel odometry blending; where noise models helped and where they did not.",
      meta: "Algorithms",
    },
  ],
  Brand: [
    {
      title: "Studio wordmark",
      description:
        "Spacing, optical balance, and export rules for web and print lockups.",
      meta: "Identity",
    },
    {
      title: "Site grid system",
      description:
        "Breakpoints, type scale, and component spacing for a calm, editorial feel.",
      meta: "Design system",
    },
    {
      title: "Motion principles",
      description:
        "Short guidelines for hover, page transitions, and reduced-motion defaults.",
      meta: "Motion",
    },
  ],
  Photography: [
    {
      title: "Low-light street set",
      description:
        "A study in contrast and shutter discipline — placeholder series until galleries go live.",
      meta: "Series · Urban",
    },
    {
      title: "Studio still life",
      description:
        "Controlled lighting and texture work for product-adjacent compositions.",
      meta: "Studio",
    },
    {
      title: "Travel log (selects)",
      description:
        "Curated frames from recent travel; captions and print sizes TBD.",
      meta: "Editorial",
    },
  ],
};
