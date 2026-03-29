/**
 * Canonical site URL — must match your primary domain in Google Search Console.
 */
export const siteUrl = "https://httpsdxf.me" as const;

/**
 * Optional public inbox for mailto links (e.g. on /hire). Set
 * `NEXT_PUBLIC_CONTACT_EMAIL` in the frontend env at build time.
 */
export const publicContactEmail: string =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";

/**
 * SEO & identity — keep descriptions readable; avoid keyword stuffing.
 */
export const siteConfig = {
  canonicalUrl: siteUrl,
  siteName: "httpsDXF",
  /** Homepage <title> */
  defaultTitle:
    "Yaw Appiah — Software, Mechanical & Mechatronics Engineer | httpsDXF",
  /** Subpages: use template in layout */
  titleTemplate: "%s · httpsDXF",
  description:
    "Yaw Nhyira Antwi Appiah (httpsDXF) — software engineer, mechanical engineer, and mechatronics engineer. Robotics, STEAM, and creative engineering. Portfolio and experiments by Yaw Appiah.",
  /** Used in metadata; focus is clarity for people and crawlers, not ranking guarantees */
  keywords: [
    "httpsDXF",
    "Yaw",
    "Yaw Appiah",
    "Yaw Nhyira Antwi Appiah",
    "Software Engineer",
    "Mechanical Engineer",
    "Mechatronics Engineer",
    "crazy cool stuff",
    "robotics",
    "STEAM",
    "STEAM education",
    "engineering portfolio",
    "Yaw portfolio",
  ] as const,
  person: {
    name: "Yaw Nhyira Antwi Appiah",
    alternateNames: ["Yaw Appiah", "Yaw", "httpsDXF"] as const,
    jobTitle: [
      "Software Engineer",
      "Mechanical Engineer",
      "Mechatronics Engineer",
    ] as const,
  },
  locale: "en_US",
} as const;
