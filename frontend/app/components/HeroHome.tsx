import Image from "next/image";
import Link from "next/link";

/** Matches `public/Background image .png` */
const HERO_BG = "/Background%20image%20.png";

type HeroHomeProps = {
  displayFontClass: string;
  bodyFontClass: string;
  taglineFontClass: string;
};

export function HeroHome({
  displayFontClass,
  bodyFontClass,
  taglineFontClass,
}: HeroHomeProps) {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={HERO_BG}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-linear-to-b from-black/14 via-black/34 to-black/82"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_50%,transparent_0%,rgba(0,0,0,0.5)_100%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-20 flex min-h-dvh flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-32 pt-24 sm:px-6 md:translate-y-10 md:px-[5%] md:pb-36 md:pt-28 lg:translate-y-14">
          <h1
            className={`${displayFontClass} max-w-[min(100%,18ch)] text-center text-[clamp(2rem,9vw,4.75rem)] font-bold uppercase leading-[0.86] tracking-[0.06em] sm:max-w-none sm:tracking-[0.08em] md:text-[clamp(2.5rem,7.5vw,5.25rem)] md:leading-[0.84]`}
          >
            <span className="block leading-[inherit]">
              <span className="hero-title-word hero-title-delay-1 text-white">
                I DO{" "}
              </span>
              <span
                className="hero-title-word hero-title-delay-2 inline-block origin-center -rotate-[2.1deg] text-white/38"
              >
                CRAZY
              </span>
            </span>
            <span className="hero-title-word hero-title-delay-3 mt-1 block sm:mt-1.5">
              COOL STUFF!
            </span>
          </h1>
          <p
            className={`${taglineFontClass} hero-enter hero-enter-delay-1 mt-6 max-w-xl px-2 text-center text-[clamp(1rem,3.2vw,1.35rem)] font-bold leading-snug tracking-tight text-white sm:mt-7 sm:px-0`}
          >
            Brains. Grit. Zero template.
          </p>
          <Link
            href="/portfolio"
            className={`${bodyFontClass} group hero-enter hero-enter-delay-2 interaction-smooth mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[0.9375rem] font-extrabold text-black shadow-lg shadow-black/20 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] sm:mt-10 sm:px-10 sm:py-3.5 sm:text-base`}
          >
            View portfolio
            <span
              className="text-lg leading-none transition-transform duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
              aria-hidden
            >
              &gt;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
