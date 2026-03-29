import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { siteConfig, siteUrl } from "../../config/site";

export const metadata: Metadata = {
  title: "About",
  description: `Yaw Nhyira Antwi Appiah (httpsDXF): ${siteConfig.person.jobTitle.join(", ")}. Background and how to get in touch.`,
  alternates: { canonical: `${siteUrl}/me` },
};

export default function MePage() {
  return (
    <div className="bg-black text-white">
      <h1 className="sr-only">About me</h1>

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-12 xl:gap-16">
        {/* Portrait — full width on mobile, ~40% on desktop */}
        <div
          className="card-fade-up mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
          style={{ "--card-fade-delay": "0ms" } as CSSProperties}
        >
          <div className="border-2 border-[#0099ff] p-1 sm:p-1.5">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
              <Image
                src="/me.png"
                alt="Yaw Nhyira Antwi Appiah"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 38vw"
                priority
              />
            </div>
          </div>
        </div>

        <div
          className="card-fade-up flex min-w-0 flex-col justify-center gap-8 lg:py-2"
          style={{ "--card-fade-delay": "70ms" } as CSSProperties}
        >
          <div className="space-y-6 text-base leading-relaxed text-white/90 md:text-lg md:leading-relaxed">
            <p>
              I work across software, product and brand, UX, and mechanical
              systems: from code and interfaces to hardware and rigs. I like
              problems that need both careful detail and a clear picture of how
              the pieces fit together.
            </p>
            <p>
              I&apos;m studying mechanical engineering and spend a lot of time on
              hands-on builds, CAD, and integration with electronics and
              software. If it&apos;s a tough brief, I&apos;m usually interested.
            </p>
            <p className="text-white/80">
              Open to work and to talking with people working on similar things.
            </p>
          </div>

          <div>
            <Link
              href="/hire"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            >
              Contact
              <span aria-hidden className="text-base font-normal">
                &gt;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
