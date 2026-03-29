import Image from "next/image";
import Link from "next/link";
import { footerConfig } from "../config/footer";
import { mainNavItems } from "../config/navigation";
import { fontHeroTagline } from "../fonts";

function splitBrandName(full: string) {
  const lower = full.toLowerCase();
  if (lower.startsWith("https") && full.length > 5) {
    return { prefix: full.slice(0, 5), suffix: full.slice(5) };
  }
  return { prefix: full, suffix: "" };
}

function SocialIconGitHub({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function SocialIconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function SocialIconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialIconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialEntries = [
  { key: "github", label: "GitHub", href: footerConfig.social.github, Icon: SocialIconGitHub },
  { key: "instagram", label: "Instagram", href: footerConfig.social.instagram, Icon: SocialIconInstagram },
  { key: "x", label: "X", href: footerConfig.social.x, Icon: SocialIconX },
  { key: "linkedin", label: "LinkedIn", href: footerConfig.social.linkedin, Icon: SocialIconLinkedIn },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { prefix, suffix } = splitBrandName(footerConfig.brand.displayName);

  return (
    <footer className="mt-auto rounded-t-[2.25rem] bg-black px-[5%] pb-10 pt-14 text-center md:rounded-t-[3rem] md:pb-12 md:pt-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-10 md:gap-12">
        <Link
          href="/"
          className="interaction-fast flex items-center gap-3 text-white hover:opacity-90"
        >
          <span className="relative block h-11 w-12 shrink-0 md:h-12 md:w-[3.25rem]">
            <Image src="/logo.svg" alt="" fill className="object-contain" />
          </span>
          <span
            className={`${fontHeroTagline.className} text-xl font-bold tracking-tight text-white md:text-2xl`}
          >
            <span className="lowercase">{prefix}</span>
            {suffix ? <span>{suffix.toUpperCase()}</span> : null}
          </span>
        </Link>

        <ul className="flex items-center justify-center gap-8 md:gap-10">
          {socialEntries.map(({ key, label, href, Icon }) => (
            <li key={key}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="interaction-fast text-white hover:opacity-70"
                aria-label={label}
              >
                <Icon className="h-6 w-6 md:h-7 md:w-7" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex w-full flex-col items-center gap-4 md:gap-5">
          <p className="text-sm font-bold text-zinc-500 md:text-base">Quick Links</p>
          <nav
            className="flex w-full max-w-xs flex-col items-center gap-3 md:max-w-none md:flex-row md:flex-wrap md:justify-center md:gap-x-10 md:gap-y-2"
            aria-label="Quick links"
          >
            {mainNavItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="interaction-fast block w-full text-center text-base font-bold text-white hover:text-white/80 md:w-auto md:text-lg"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="interaction-fast block w-full text-center text-base font-bold text-zinc-500 hover:text-zinc-300 md:w-auto md:text-lg"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <p className="text-center text-xs text-zinc-500 md:text-sm">
          © {year} {footerConfig.brand.displayName} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
