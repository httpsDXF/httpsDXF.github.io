/**
 * Primary nav — shared by header and footer so links stay in sync.
 */
export const mainNavItems = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/experiments", label: "Experiments" },
  { href: "/blog", label: "Blog" },
  { href: "/me", label: "Me" },
] as const;
