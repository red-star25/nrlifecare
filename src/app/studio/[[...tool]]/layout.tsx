import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue editor",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[200] bg-white" style={{ height: "100dvh" }}>
      {children}
    </div>
  );
}
