import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { StoreProvider } from "@/lib/StoreProvider";
import { ThPreferencesProvider } from "@/preferences";

export const runtime = "edge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thorium Web",
  description: "Play with the capabilities of the Readium Web Toolkit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={ inter.className }>
        <StoreProvider>
          <ThPreferencesProvider>
              { children } 
          </ThPreferencesProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
