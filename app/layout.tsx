import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dil Ki Baat AI",
  description: "AI-assisted content planning and review for Dil Ki Baat",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
