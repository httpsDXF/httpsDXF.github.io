import { DashboardShell } from "./DashboardShell";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-950 text-white">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
