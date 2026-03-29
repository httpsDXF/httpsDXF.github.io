import { SiteHeader } from "../components/SiteHeader";

export default function OtherPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-zinc-950 text-white">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-[5%] py-16 md:py-24">
        {children}
      </main>
    </div>
  );
}
