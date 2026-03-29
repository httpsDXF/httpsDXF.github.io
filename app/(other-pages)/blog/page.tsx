import type { Metadata } from "next";
import { siteUrl } from "../../config/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing and notes by Yaw Appiah (httpsDXF) — engineering, STEAM, and technology.",
  alternates: { canonical: `${siteUrl}/blog` },
};

export default function BlogPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Blog</h1>
      <p className="mt-4 text-lg text-white/70">
        Posts and writing will show up here.
      </p>
    </div>
  );
}
