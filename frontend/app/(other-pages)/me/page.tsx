import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { siteConfig, siteUrl } from "../../config/site";

export const metadata: Metadata = {
  title: "About",
  description: `Yaw Nhyira Antwi Appiah (httpsDXF): ${siteConfig.person.jobTitle.join(", ")}. Tech, design, engineering, and how to connect.`,
  alternates: { canonical: `${siteUrl}/me` },
};

export default function MePage() {
  return (
    <div className="text-white">
      <h1 className="sr-only">About me</h1>

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-12 xl:gap-16">
        <div
          className="card-fade-up mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
          style={{ "--card-fade-delay": "0ms" } as CSSProperties}
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
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

        <div
          className="card-fade-up flex min-w-0 flex-col justify-center gap-8 lg:py-2"
          style={{ "--card-fade-delay": "70ms" } as CSSProperties}
        >
          <div className="space-y-6 text-base leading-relaxed text-white/90 md:text-lg md:leading-relaxed">
            <p>
              I&apos;m a tech-loving polymath who thrives on blending creativity
              and precision. Whether I&apos;m building standout brands,
              designing seamless user experiences, building up software, pushing
              the limits of immersive technology or mechanical systems, I&apos;m
              always exploring how it all connects.
            </p>
            <p>
              Actively pursuing Mechanical Engineering studies in Academia, I
              bring together hands-on tech and big picture thinking to create
              some seriously crazy cool stuff. Full of energy and always ready
              for a challenge, I&apos;m here to shake things up and shape the
              future one game-changing idea at a time, with badass Engineering
              brilliance.
            </p>
            <p className="text-white/85">
              I&apos;m open to work and to connect with like-minded people.
            </p>
          </div>

          <div>
            <Link
              href="/hire"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            >
              Let&apos;s connect
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
