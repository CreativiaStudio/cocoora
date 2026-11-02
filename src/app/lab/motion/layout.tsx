import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cocoora Motion Identity Lab — Preview Riservata",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MotionLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
