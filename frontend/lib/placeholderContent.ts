/** Fallback categories when the server returns none. */
export const PLACEHOLDER_BLOG_CATEGORIES = [
  { id: -1, name: "Notes", slug: "notes", order: 0 },
  { id: -2, name: "Engineering", slug: "engineering", order: 1 },
  { id: -3, name: "Studio", slug: "studio", order: 2 },
  { id: -4, name: "Process", slug: "process", order: 3 },
];

/** Fallback slugs for static builds when the server is unavailable. */
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
    body: `<p>This site is a working notebook: software, hardware, and the messy middle where they meet.</p>
<p>Expect build logs, tooling notes, and the occasional essay on identity and craft.</p>
<h2>What to expect</h2>
<ul><li>Robotics and mechatronics breakdowns</li><li>Tooling and workflow notes</li><li>Occasional brand and photo essays</li></ul>`,
    body_format: "html",
    published: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    media: [],
    categories: [
      { slug: "notes", name: "Notes" },
      { slug: "process", name: "Process" },
    ],
    created_at: ISO("2026-01-10"),
    updated_at: ISO("2026-01-12"),
  },
  {
    id: -2,
    title: "Mechatronics sketch — torque and timing",
    slug: "mechatronics-sketch",
    description:
      "Scribbles from a weekend actuator test: gearing assumptions, safety margins, and what broke first.",
    body: `<p>Weekend rig time: a simple bracket, a motor that ran hotter than expected, and a log of what we’d change on the next pass.</p>
<blockquote><p>Measure twice, simulate once, then measure again.</p></blockquote>
<p>Longer posts can carry step photos, curves, and an honest “what we’d do differently” list.</p>`,
    body_format: "html",
    published: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80",
    media: [],
    categories: [
      { slug: "engineering", name: "Engineering" },
      { slug: "notes", name: "Notes" },
    ],
    created_at: ISO("2026-01-18"),
    updated_at: ISO("2026-01-20"),
  },
  {
    id: -3,
    title: "Brand sprint — type, grid, and motion",
    slug: "visual-identity-sprint",
    description:
      "A one-week pass at hierarchy, spacing, and motion rules for a personal studio site.",
    body: `<p>A tight sprint on hierarchy, spacing, and motion: mood boards, type pairing, and tokens that survive light and dark UI.</p>
<p>The goal was an editorial surface—calm rhythm, predictable spacing, type that scales from phone to desktop.</p>`,
    body_format: "html",
    published: true,
    cover_image_url:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    media: [],
    categories: [
      { slug: "studio", name: "Studio" },
      { slug: "process", name: "Process" },
    ],
    created_at: ISO("2026-02-01"),
    updated_at: ISO("2026-02-03"),
  },
];

export function getPlaceholderPostBySlug(slug: string) {
  return PLACEHOLDER_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

/** Khronos glTF sample models — shown when the server has no experiments yet. */
const GLTF_SAMPLE_BASE =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0";

export const PLACEHOLDER_EXPERIMENT_SLUGS = [
  "prototype-bracket-glb",
  "sample-mechanical-duck",
  "sample-fox-mesh",
] as const;

export const PLACEHOLDER_EXPERIMENTS = [
  {
    id: -1,
    title: "Bracket export — GLB",
    slug: "prototype-bracket-glb",
    description:
      "A minimal Box mesh from the Khronos glTF sample set—handy for testing orbit, lighting, and materials before swapping in your own CAD export.",
    preview_image_url:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    model_url: `${GLTF_SAMPLE_BASE}/Box/glTF-Binary/Box.glb`,
    source_format: "glb",
    created_at: ISO("2026-01-08"),
    updated_at: ISO("2026-01-10"),
  },
  {
    id: -2,
    title: "Classic duck mesh",
    slug: "sample-mechanical-duck",
    description:
      "The well-known Duck GLB—same family of asset the in-browser viewer loads by default. A friendly baseline for framing and scale checks.",
    preview_image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    model_url: `${GLTF_SAMPLE_BASE}/Duck/glTF-Binary/Duck.glb`,
    source_format: "glb",
    created_at: ISO("2026-01-12"),
    updated_at: ISO("2026-01-14"),
  },
  {
    id: -3,
    title: "Fox model",
    slug: "sample-fox-mesh",
    description:
      "A slightly richer glTF from the Khronos samples—useful for testing skinning, materials, and camera framing before publishing your own work.",
    preview_image_url:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80",
    model_url: `${GLTF_SAMPLE_BASE}/Fox/glTF-Binary/Fox.glb`,
    source_format: "glb",
    created_at: ISO("2026-01-20"),
    updated_at: ISO("2026-01-22"),
  },
];

export function getPlaceholderExperimentBySlug(slug: string) {
  return PLACEHOLDER_EXPERIMENTS.find((e) => e.slug === slug) ?? null;
}

/** When the server returns no portfolio categories. */
export const PLACEHOLDER_PORTFOLIO_CATEGORIES = [
  { id: -1, name: "Mechatronics", slug: "mechatronics", order: 0 },
  { id: -2, name: "Brand", slug: "brand", order: 1 },
  { id: -3, name: "Photography", slug: "photography", order: 2 },
] as const;

export type PortfolioCard = {
  /** URL segment for `/portfolio/[slug]` case studies */
  slug: string;
  title: string;
  description: string;
  meta: string;
  /** Cover preview for grid cards (full URL or path) */
  cover_image_url?: string;
};

/** Default cards by category when the server has no projects yet. */
export const PORTFOLIO_PLACEHOLDER_CARDS: Record<string, PortfolioCard[]> = {
  Mechatronics: [
    {
      slug: "desktop-test-rig",
      title: "Desktop test rig",
      description:
        "Frame, actuators, and DAQ layout for quick iteration on joint limits and cabling.",
      meta: "Hardware · Prototype",
      cover_image_url:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80",
    },
    {
      slug: "ros-bring-up-notes",
      title: "ROS bring-up notes",
      description:
        "Launch files, TF tree sanity checks, and sim-to-real gaps we closed on a small mobile base.",
      meta: "Software · Robotics",
      cover_image_url:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    },
    {
      slug: "sensor-fusion-sketch",
      title: "Sensor fusion sketch",
      description:
        "IMU + wheel odometry blending; where noise models helped and where they did not.",
      meta: "Algorithms",
      cover_image_url:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    },
  ],
  Brand: [
    {
      slug: "studio-wordmark",
      title: "Studio wordmark",
      description:
        "Spacing, optical balance, and export rules for web and print lockups.",
      meta: "Identity",
      cover_image_url:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    },
    {
      slug: "site-grid-system",
      title: "Site grid system",
      description:
        "Breakpoints, type scale, and component spacing for a calm, editorial feel.",
      meta: "Design system",
      cover_image_url:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=80",
    },
    {
      slug: "motion-principles",
      title: "Motion principles",
      description:
        "Short guidelines for hover, page transitions, and reduced-motion defaults.",
      meta: "Motion",
      cover_image_url:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    },
  ],
  Photography: [
    {
      slug: "low-light-street-set",
      title: "Low-light street set",
      description:
        "Contrast, shutter discipline, and silhouettes that stay legible after dark.",
      meta: "Series · Urban",
      cover_image_url:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80",
    },
    {
      slug: "studio-still-life",
      title: "Studio still life",
      description:
        "Controlled lighting and texture work for product-adjacent compositions.",
      meta: "Studio",
      cover_image_url:
        "https://images.unsplash.com/photo-1549887552-15cb2be7db9e?w=1200&q=80",
    },
    {
      slug: "travel-log-selects",
      title: "Travel log (selects)",
      description:
        "A tight edit from recent travel—frames that read at postcard scale and reward a second look.",
      meta: "Editorial",
      cover_image_url:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
    },
  ],
};
