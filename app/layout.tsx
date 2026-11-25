import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADICo Global | Connecting People. Creating Opportunities.",
  description: "The ADICo-owned marketplace connecting customers and approved retailers."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
